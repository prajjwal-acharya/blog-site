"""
Example Bokeh histogram plot.

Usage:
  python scripts/generate-bokeh-plot.py scripts/plots/example-histogram.py example_histogram
"""

import numpy as np
from bokeh.plotting import figure
from bokeh.models import HoverTool


def create_plot():
    """Create an example interactive histogram."""
    # Generate data
    data = np.random.normal(loc=100, scale=15, size=1000)
    hist, edges = np.histogram(data, bins=30)

    # Create figure
    p = figure(
        title="Distribution Histogram (Example)",
        width=800,
        height=500,
        toolbar_location="right",
        tools="pan,wheel_zoom,box_zoom,reset,save",
    )

    # Add bars
    p.quad(
        top=hist,
        bottom=0,
        left=edges[:-1],
        right=edges[1:],
        fill_color="navy",
        line_color="white",
        alpha=0.7,
    )

    # Style
    p.title.text_font_size = "14pt"
    p.xaxis.axis_label = "Value"
    p.yaxis.axis_label = "Frequency"
    p.xaxis.axis_label_text_font_style = "bold"
    p.yaxis.axis_label_text_font_style = "bold"

    # Add hover tool
    hover = HoverTool(
        tooltips=[
            ("Range", "@left{0.0} - @right{0.0}"),
            ("Count", "@top"),
        ]
    )
    p.add_tools(hover)

    return p
