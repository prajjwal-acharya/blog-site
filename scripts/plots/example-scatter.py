"""
Example Bokeh scatter plot.

Usage:
  python scripts/generate-bokeh-plot.py scripts/plots/example-scatter.py example_scatter
"""

import numpy as np
from bokeh.plotting import figure
from bokeh.palettes import Category20
from bokeh.transform import transform


def create_plot():
    """Create an example interactive scatter plot."""
    # Generate random data
    n = 500
    x = np.random.randn(n)
    y = np.random.randn(n)
    colors = np.random.choice(Category20[20], n)
    sizes = np.random.randint(10, 25, n)

    # Create figure
    p = figure(
        title="Interactive Scatter Plot (Example)",
        width=800,
        height=600,
        toolbar_location="right",
        tools="pan,wheel_zoom,box_zoom,reset,save",
    )

    # Add scatter
    p.circle(
        x,
        y,
        size=sizes,
        color=colors,
        alpha=0.6,
        hover_color="navy",
        hover_alpha=0.9,
    )

    # Style
    p.title.text_font_size = "14pt"
    p.xaxis.axis_label = "X Axis"
    p.yaxis.axis_label = "Y Axis"
    p.xaxis.axis_label_text_font_style = "bold"
    p.yaxis.axis_label_text_font_style = "bold"

    # Add hover tool
    from bokeh.models import HoverTool
    hover = HoverTool(tooltips=[("Index", "$index"), ("(X,Y)", "($x, $y)")])
    p.add_tools(hover)

    return p
