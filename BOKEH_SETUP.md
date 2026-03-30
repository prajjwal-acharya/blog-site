# Bokeh Setup Instructions

## Quick Start

### 1. Install Bokeh

```bash
pip install bokeh numpy
```

### 2. Generate a Sample Plot

```bash
python scripts/generate-bokeh-plot.py scripts/plots/example-scatter.py example_scatter
```

You should see:
```
📊 Generating plot from scripts/plots/example-scatter.py...
✅ Plot saved to public/bokeh/example_scatter.html

📝 Add this to your article:
   !BOKEH title="Your Plot Title" src="/bokeh/example_scatter.html"
   !END-BOKEH
```

### 3. Verify the HTML File

Check that `public/bokeh/example_scatter.html` was created:

```bash
ls -lh public/bokeh/
```

### 4. Test in Your Article

Add this to your `.articleml` file:

```
## Visualizations

!BOKEH title="Example Scatter Plot" src="/bokeh/example_scatter.html" height="600"
!END-BOKEH
```

Then rebuild:

```bash
npm run build
npm run dev
```

Visit your blog post and interact with the visualization!

## Creating Your Own Plots

See [BOKEH_GUIDE.md](./BOKEH_GUIDE.md) for detailed instructions on creating custom visualizations.

## Workflow Summary

```
┌─ Create plot script
│   (scripts/plots/my-plot.py)
│
├─ Run generator
│   (python scripts/generate-bokeh-plot.py ...)
│
├─ Generated HTML
│   (public/bokeh/my-plot.html)
│
├─ Add to article
│   (!BOKEH title="..." src="/bokeh/my-plot.html" !END-BOKEH)
│
└─ Rebuild blog
    (npm run build && npm run dev)
```

## Troubleshooting

### "bokeh is not installed"
```bash
pip install bokeh numpy
```

### Generator script not found
Make sure you're running from the blog root:
```bash
cd /path/to/blog-site
python scripts/generate-bokeh-plot.py ...
```

### Plot doesn't show in article
1. Verify HTML file exists: `ls public/bokeh/my-plot.html`
2. Check the `src=` path in your article matches
3. Rebuild: `npm run build`

### Need help?
Check the example scripts:
- `scripts/plots/example-scatter.py`
- `scripts/plots/example-timeseries.py`
- `scripts/plots/example-histogram.py`

---

Happy plotting! 📊
