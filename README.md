# D3 Data Visualization Portfolio

[![Storybook](https://img.shields.io/badge/Storybook-7.4-ff4785?logo=storybook&logoColor=white)](https://storybook.js.org/)
[![D3.js](https://img.shields.io/badge/D3.js-v7-f9a03c?logo=d3.js&logoColor=white)](https://d3js.org/)
[![React](https://img.shields.io/badge/React-16-61dafb?logo=react&logoColor=white)](https://reactjs.org/)
[![Material-UI](https://img.shields.io/badge/Material--UI-v4-0081cb?logo=mui&logoColor=white)](https://v4.mui.com/)

A collection of custom **D3.js data visualizations** built as React components for a production analytics platform. Each chart was built from scratch using D3 v7, with interactive tooltips, responsive sizing, animated transitions, and dark/light theming support.

> **[View Live Demo → https://thodges314.github.io/D3_PORTFOLIO/](https://thodges314.github.io/D3_PORTFOLIO/)**

---

## Visualization Components

| Component                        | Description                                                                                    |
| -------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Doughnut Chart**               | Animated pie/doughnut with hover arc expansion and polyline labels                             |
| **Spider / Radar Chart**         | Radar plot with concentric grid rings, animated web fill, and interactive data points          |
| **Filled Line Chart**            | Area chart with gradient fill, animated path drawing, and axis labels                          |
| **Filled Line (Multi-Series)**   | Multi-dataset comparison variant supporting 1–3 overlaid series                                |
| **Diverging Index Bar**          | Horizontal bar chart diverging from a center baseline (index = 100)                            |
| **Diverging Bar (Multi-Series)** | Multi-dataset comparison variant with grouped bars                                             |
| **Scatterplot**                  | Clustered scatter visualization with color-coded groups and collision handling                 |
| **Radial Scatter**               | Complex radial layout with arc-based category labels, interactive dots, and focus/dim on hover |
| **US State Map**                 | Choropleth map using GeoJSON with gradient color scale and SVG blur shadow                     |
| **US DMA Map**                   | Designated Market Area (DMA) region choropleth variant                                         |
| **List Viz**                     | Ranked list visualization with inline index bar indicators                                     |
| **Full Table Viz**               | Interactive data table with sorting, pagination, and conditional formatting                    |

---

## Architecture Highlights

### Context-Based Tooltip System

All D3 charts share a single tooltip component managed through React Context and `useImperativeHandle`:

```
ToolTipContext.Provider (wraps app)
  └── ToolTip2 component (renders tooltip DOM, exposes moveToolTip/hideToolTip via ref)
      └── D3 Charts (consume context, call tooltip methods on mouse events)
```

This pattern means:

- **One tooltip instance** for the entire app (no duplication)
- **D3 manages tooltip positioning and content** via imperative ref calls
- **Smooth D3 transitions** on show/hide (easeQuadIn/easeQuadOut)
- **Smart positioning** that avoids viewport overflow
- Supports both single-column and two-column tooltip layouts

### Responsive Layout System

Charts are wrapped in a `LayoutCard` component providing:

- 5 responsive column widths: `small` (25%), `small2` (33%), `medium` (50%), `medium2` (66%), `large` (100%)
- Breakpoint-based reflowing via CSS media queries
- Material-UI Card elevation for depth
- ResizeObserver integration for dynamic height

### Theming

Full light/dark mode support via Material-UI's `ThemeProvider`:

- CSS class-based theming (`text-primary`, `bg-default`, `fill-primary`, etc.)
- Theme-aware SVG fills and strokes
- Coordinated color palettes between UI and D3

### Custom Hook: `useD3`

A lightweight hook wrapping D3's selection pattern with React refs and effects:

```js
export const useD3 = (renderChartFn, dependencies) => {
  const ref = React.useRef();
  React.useEffect(() => {
    renderChartFn(d3.select(ref.current));
    return () => {};
  }, dependencies);
  return ref;
};
```

---

## Tech Stack

- **D3.js v7** — all chart rendering, transitions, scales, geo projections
- **React 16** — component architecture, hooks, context
- **Material-UI v4** — theming, cards, CSS baseline
- **SCSS** — shared variables, responsive layouts
- **Storybook 7** — component showcase and documentation
- **Webpack 5** — bundling (via Storybook)

---

## Running Locally

```bash
# Install dependencies
npm install

# Start Storybook dev server
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) to browse the component library.

## Building for Deployment

```bash
npm run build-storybook
```

Static output will be in the `docs/` directory, ready for GitHub Pages or any static host.

---

## Project Context

These components were built as part of a **Data Portrait Analysis** platform — a Looker Extension that visualized audience analytics data across demographics, interests, health indicators, and geographic distributions. The D3 components received data as props and rendered entirely client-side with interactive tooltips and responsive layouts.

This portfolio extracts just the visualization layer to showcase the D3 and React engineering work independently of the proprietary data platform.
