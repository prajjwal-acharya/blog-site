#!/usr/bin/env python3
"""
Generate Bokeh plots for blog articles.

Usage:
  python scripts/generate-bokeh-plot.py <plot_script.py> <output_name>

Example:
  python scripts/generate-bokeh-plot.py scripts/plots/scatter.py scatter
  # Output: public/bokeh/scatter.html

The plot script should define a 'create_plot()' function that returns a Bokeh figure or layout.
"""

import sys
import os
from pathlib import Path

# Check if bokeh is installed
try:
    from bokeh.plotting import output_file, save
except ImportError:
    print("❌ Error: bokeh is not installed.")
    print("   Install it with: pip install bokeh")
    sys.exit(1)


def generate_bokeh_plot(script_path: str, output_name: str):
    """
    Generate a Bokeh plot from a Python script.

    Args:
        script_path: Path to the Python script containing create_plot() function
        output_name: Name for the output HTML file (without .html extension)
    """
    # Resolve paths
    script_path = Path(script_path).resolve()
    output_dir = Path("public/bokeh").resolve()
    output_file_path = output_dir / f"{output_name}.html"

    # Verify input script exists
    if not script_path.exists():
        print(f"❌ Error: Script not found: {script_path}")
        sys.exit(1)

    # Create output directory if needed
    output_dir.mkdir(parents=True, exist_ok=True)

    try:
        # Load the plot script
        import importlib.util
        spec = importlib.util.spec_from_file_location("plot_module", script_path)
        plot_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(plot_module)

        # Get the create_plot function
        if not hasattr(plot_module, "create_plot"):
            print(f"❌ Error: {script_path} must define a create_plot() function")
            sys.exit(1)

        # Generate the plot
        print(f"📊 Generating plot from {script_path}...")
        figure = plot_module.create_plot()

        # Save as HTML
        output_file(str(output_file_path))
        save(figure)

        print(f"✅ Plot saved to {output_file_path}")
        print(f"\n📝 Add this to your article:")
        print(f"   !BOKEH title=\"Your Plot Title\" src=\"/bokeh/{output_name}.html\"")
        print(f"   !END-BOKEH")

    except Exception as e:
        print(f"❌ Error generating plot: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    script_path = sys.argv[1]
    output_name = sys.argv[2]
    generate_bokeh_plot(script_path, output_name)
