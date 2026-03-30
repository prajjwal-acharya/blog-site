# Placeholder Examples

This guide shows how to use and replace placeholders in your articles.

## 1. Image Placeholder

### ArticleML (Input)
```
## Architecture

The system has three main components:

[!IMAGE] : {desc: "System architecture diagram showing API, cache, and storage layers"}

The API layer handles requests...
```

### Generated MDX (After Parsing)
```tsx
## Architecture

The system has three main components:

<Placeholder type="image" title="Image" description="System architecture diagram showing API, cache, and storage layers" />

The API layer handles requests...
```

### Manual Edit (Final)
```tsx
import Image from "next/image";

## Architecture

The system has three main components:

<Image 
  src="/images/system-architecture.png" 
  alt="System architecture diagram showing API, cache, and storage layers"
  width={900}
  height={600}
/>

The API layer handles requests...
```

---

## 2. Code Placeholder

### ArticleML (Input)
```
## Implementation

Here's how to implement quantization in Python:

[!CODE] : {desc: "NumPy implementation of post-training quantization with int8 conversion"}

The key function is `np.quantize()`...
```

### Generated MDX (After Parsing)
```tsx
## Implementation

Here's how to implement quantization in Python:

<Placeholder type="code" title="Code" description="NumPy implementation of post-training quantization with int8 conversion" />

The key function is `np.quantize()`...
```

### Manual Edit (Final)
```tsx
import CodeBlock from "@/components/blog/CodeBlock";

## Implementation

Here's how to implement quantization in Python:

<CodeBlock language="python" title="Quantization Implementation">
{`import numpy as np

def quantize_to_int8(weights):
    """Convert FP32 weights to INT8"""
    min_val = weights.min()
    max_val = weights.max()
    
    # Map to INT8 range
    scale = (max_val - min_val) / 255
    zero_point = min_val
    
    quantized = ((weights - zero_point) / scale).astype(np.int8)
    return quantized, scale, zero_point

# Usage
w = np.random.randn(1000, 1000)
q, s, z = quantize_to_int8(w)`}
</CodeBlock>

The key function is `np.quantize()`...
```

---

## 3. Video Placeholder

### ArticleML (Input)
```
## Tutorial

Watch this video to see the technique in action:

[!VIDEO] : {desc: "Live coding session showing end-to-end quantization workflow"}

In the video, we demonstrate...
```

### Generated MDX (After Parsing)
```tsx
## Tutorial

Watch this video to see the technique in action:

<Placeholder type="video" title="Video" description="Live coding session showing end-to-end quantization workflow" />

In the video, we demonstrate...
```

### Manual Edit (Final - Using YouTube)
```tsx
## Tutorial

Watch this video to see the technique in action:

<iframe 
  width="100%" 
  height="600" 
  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
  frameBorder="0" 
  allowFullScreen
></iframe>

In the video, we demonstrate...
```

Or for a custom video component:
```tsx
<VideoEmbed 
  src="/videos/quantization-tutorial.mp4"
  title="Quantization Tutorial"
  poster="/images/quantization-poster.png"
/>
```

---

## 4. Simulation Placeholder

### ArticleML (Input)
```
## Interactive Demo

Try adjusting the quantization bits to see the effect:

[!SIMULATION] : {desc: "Interactive slider to adjust quantization bits and see MSE change"}

As you can see above...
```

### Generated MDX (After Parsing)
```tsx
## Interactive Demo

Try adjusting the quantization bits to see the effect:

<Placeholder type="simulation" title="Interactive Simulation" description="Interactive slider to adjust quantization bits and see MSE change" />

As you can see above...
```

### Manual Edit (Final - Using Bokeh)
```tsx
import BokehVisualization from "@/components/blog/BokehVisualization";

## Interactive Demo

Try adjusting the quantization bits to see the effect:

<BokehVisualization 
  title="Quantization Effects"
  src="/bokeh/quantization-demo.html"
  height={600}
/>

As you can see above...
```

---

## Best Practices

### 1. Descriptive Descriptions
❌ **Bad:**
```
[!IMAGE] : {desc: "diagram"}
```

✅ **Good:**
```
[!IMAGE] : {desc: "Attention mechanism showing query, key, value matrices and softmax computation"}
```

The description helps you remember what content should go there.

### 2. Consistent Component Imports
Keep your imports at the top:
```tsx
import Image from "next/image";
import CodeBlock from "@/components/blog/CodeBlock";
import BokehVisualization from "@/components/blog/BokehVisualization";

// ... rest of content
```

### 3. File Organization
- Images: `public/images/`
- Videos: `public/videos/`
- Bokeh plots: `public/bokeh/`
- Data files: `public/data/`

### 4. Alt Text & Accessibility
Always include descriptive alt text for images:
```tsx
<Image 
  src="/images/architecture.png"
  alt="System architecture with API server, cache layer, and database"
  width={900}
  height={600}
/>
```

### 5. Responsive Sizing
Consider mobile viewers:
```tsx
<Image 
  src="/images/large-diagram.png"
  alt="Complex diagram"
  width={1200}
  height={800}
  // Let Next.js optimize for all screen sizes
  responsive
/>
```

---

## Placeholder Appearance

When rendered in the browser, placeholders look like this:

![Placeholder appearance](data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect fill='%23f3e8ff' width='400' height='200' /%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle' font-size='48' fill='%235b21b6'%3E⚙️%3C/text%3E%3Ctext x='50%25' y='70%25' text-anchor='middle' font-size='16' fill='%235b21b6'%3EInteractive Simulation%3C/text%3E%3Ctext x='50%25' y='85%25' text-anchor='middle' font-size='12' fill='%239333ea'%3E[Placeholder — to be filled during publication]%3C/text%3E%3C/svg%3E)

This visual reminder helps you track what still needs to be filled in before publishing.

---

## Checklist Before Publishing

- [ ] All placeholders replaced with actual content
- [ ] Images have alt text
- [ ] Code examples are syntax-highlighted
- [ ] Videos/simulations load correctly
- [ ] Links are working
- [ ] Math equations render properly
- [ ] Tables display correctly
- [ ] Build passes: `npm run build`
- [ ] Local preview looks good: `npm run dev`

---

Happy editing! 📝
