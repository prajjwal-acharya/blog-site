# Bokeh Visualization Guide

This guide explains how to add interactive Bokeh plots to your blog articles.

## Overview

Bokeh is a powerful Python visualization library that creates interactive, web-based plots. Your blog now supports embedding Bokeh visualizations as fully interactive, playful graphics that readers can pan, zoom, and explore.

## Workflow

### 1. Create a Bokeh Plot Script

Create a Python script in `scripts/plots/` that defines a `create_plot()` function:

```python
# scripts/plots/my-visualization.py

from bokeh.plotting import figure
import numpy as np

def create_plot():
    """Create your interactive visualization."""
    # Generate/load data
    x = np.linspace(0, 4*np.pi, 100)
    y = np.sin(x)

    # Create figure
    p = figure(
        title="My Interactive Plot",
        width=800,
        height=500,
        toolbar_location="right",
        tools="pan,wheel_zoom,box_zoom,reset,save"
    )

    # Add glyphs (circles, lines, etc.)
    p.line(x, y, line_width=2, color="navy")

    # Style
    p.title.text_font_size = "14pt"
    p.xaxis.axis_label = "X Axis"
    p.yaxis.axis_label = "Y Axis"

    return p
```

**Key Requirements:**
- Function must be named `create_plot()`
- Must return a Bokeh `figure` or `layout` object
- Don't call `output_file()` or `save()` — the generator script handles that

### 2. Generate the HTML Plot

Use the provided generator script to convert your plot to HTML:

```bash
python scripts/generate-bokeh-plot.py scripts/plots/my-visualization.py my_viz
```

This creates `public/bokeh/my_viz.html`.

### 3. Add to Your Article

In your `.articleml` file, add a `!BOKEH` block:

```
!BOKEH title="My Interactive Plot" src="/bokeh/my_viz.html"
!END-BOKEH
```

**Optional: Set custom height** (default 500px):

```
!BOKEH title="My Interactive Plot" src="/bokeh/my_viz.html" height="600"
!END-BOKEH
```

### 4. Rebuild and Deploy

The plot will render in your article with full interactivity:
- 🎯 Hover tooltips
- 🔍 Pan and zoom
- 💾 Save as PNG via toolbar
- 🎨 Interactive legends and selections

## Examples

### Scatter Plot

```python
# scripts/plots/scatter.py
from bokeh.plotting import figure
import numpy as np

def create_plot():
    n = 500
    x = np.random.randn(n)
    y = np.random.randn(n)
    colors = np.random.choice(['red', 'green', 'blue'], n)

    p = figure(title="Scatter Plot", width=800, height=600)
    p.circle(x, y, color=colors, size=8, alpha=0.6)
    return p
```

### Time Series

```python
# scripts/plots/timeseries.py
from bokeh.plotting import figure
from datetime import datetime, timedelta
import numpy as np

def create_plot():
    dates = [datetime(2024, 1, 1) + timedelta(days=i) for i in range(365)]
    values = np.cumsum(np.random.randn(365))

    p = figure(title="Time Series", x_axis_type="datetime", width=900, height=500)
    p.line(dates, values, line_width=2)
    return p
```

### Heatmap with Hover

```python
# scripts/plots/heatmap.py
from bokeh.plotting import figure
from bokeh.transform import transform
from bokeh.palettes import Viridis256
import numpy as np

def create_plot():
    data = np.random.randn(10, 10)

    x, y = np.meshgrid(range(10), range(10))
    x = x.flatten()
    y = y.flatten()
    values = data.flatten()

    p = figure(title="Heatmap", width=600, height=600)
    p.rect(
        x=x, y=y, width=1, height=1,
        fill_color=transform('values', 'linear', low=min(values),
                            high=max(values), palette=Viridis256),
        line_color=None
    )
    return p
```

## Installation

Ensure Bokeh is installed:

```bash
pip install bokeh
```

## Tips for Great Visualizations

1. **Add Hover Tooltips** — Users love interactive feedback:
   ```python
   from bokeh.models import HoverTool
   hover = HoverTool(tooltips=[("Value", "@y"), ("Date", "@x{%F}")],
                     formatters={"@x": "datetime"})
   p.add_tools(hover)
   ```

2. **Use Appropriate Tools** — Pan, zoom, reset, save are standard:
   ```python
   p = figure(tools="pan,wheel_zoom,box_zoom,reset,save")
   ```

3. **Style for Readability** — Larger titles and labels:
   ```python
   p.title.text_font_size = "16pt"
   p.xaxis.axis_label_text_font_size = "12pt"
   ```

4. **Responsive Width** — Set width/height explicitly:
   ```python
   p = figure(width=800, height=500)  # Will be responsive in CSS
   ```

5. **Use Color Palettes** — Bokeh has great built-in palettes:
   ```python
   from bokeh.palettes import Category20, Viridis256, Spectral11
   colors = Category20[20]
   ```

## Troubleshooting

**Plot doesn't appear?**
- Check the `src` path matches the generated HTML location
- Ensure the HTML file exists in `public/bokeh/`

**Plot loads but isn't interactive?**
- Verify you called `p.add_tools()` or passed `tools=` to figure()
- Check browser console for errors

**Script generation fails?**
- Ensure `create_plot()` returns a Bokeh figure/layout
- Check for import errors in your script
- Use `python scripts/generate-bokeh-plot.py` to see error details

## File Structure

```
blog-site/
├── public/
│   └── bokeh/                    # Generated HTML plots
│       ├── scatter.html
│       ├── timeseries.html
│       └── histogram.html
├── scripts/
│   ├── generate-bokeh-plot.py   # Generator script
│   └── plots/                    # Your plot scripts
│       ├── example-scatter.py
│       ├── example-timeseries.py
│       ├── example-histogram.py
│       └── my-visualization.py
└── src/
    └── content/
        └── posts/
            └── my-article.mdx    # Articles with !BOKEH blocks
```

## Advanced: Custom Layouts

Combine multiple plots with Bokeh layouts:

```python
from bokeh.layouts import row, column
from bokeh.plotting import figure

def create_plot():
    p1 = figure(title="Plot 1", width=400, height=400)
    p2 = figure(title="Plot 2", width=400, height=400)
    p3 = figure(title="Plot 3", width=800, height=300)

    p1.line([1,2,3], [4,5,6])
    p2.circle([1,2,3], [4,5,6])
    p3.line([1,2,3,4], [1,4,3,2])

    # Create a layout
    layout = column(
        row(p1, p2),
        p3
    )
    return layout
```

---

Happy visualizing! 📊
