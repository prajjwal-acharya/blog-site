"""
Example Bokeh time series plot.

Usage:
  python scripts/generate-bokeh-plot.py scripts/plots/example-timeseries.py example_timeseries
"""

import numpy as np
from datetime import datetime, timedelta
from bokeh.plotting import figure
from bokeh.models import HoverTool


def create_plot():
    """Create an example interactive time series plot."""
    # Generate time series data
    dates = [datetime(2024, 1, 1) + timedelta(days=i) for i in range(365)]
    values = np.cumsum(np.random.randn(365)) + 100

    # Create figure
    p = figure(
        title="Interactive Time Series (Example)",
        x_axis_type="datetime",
        width=900,
        height=500,
        toolbar_location="right",
        tools="pan,wheel_zoom,box_zoom,reset,save",
    )

    # Add line
    line = p.line(dates, values, line_width=2, color="navy", alpha=0.8)
    circles = p.circle(dates, values, size=4, color="navy", alpha=0.5)

    # Style
    p.title.text_font_size = "14pt"
    p.xaxis.axis_label = "Date"
    p.yaxis.axis_label = "Value"
    p.xaxis.axis_label_text_font_style = "bold"
    p.yaxis.axis_label_text_font_style = "bold"

    # Add hover tool
    hover = HoverTool(
        tooltips=[
            ("Date", "@x{%F}"),
            ("Value", "@y{0.00}"),
        ],
        formatters={"@x": "datetime"},
    )
    p.add_tools(hover)

    return p
