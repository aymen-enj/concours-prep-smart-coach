# SVG Approach Documentation

This document provides information about the SVG approach that was initially used for implementing figures in the medical exam preparation application.

## Overview

The application initially used a programmatic SVG approach for rendering figures, which offered the following advantages:

- Scalable vector graphics that look sharp at any resolution
- Programmatic creation and manipulation of graphics
- Support for mathematical formulas within figures using KaTeX
- Interactive elements

However, due to precision requirements and time constraints, we've switched to using PNG images.

## Components Used

1. **SvgFileRenderer.tsx**: Loads SVG files from a URL and renders them
2. **RawSvgRenderer.tsx**: Renders raw SVG content provided as a string
3. **DiagramRenderer.tsx**: Creates SVG diagrams programmatically using JSON configuration
4. **PlotRenderer.tsx**: Creates interactive plots using Recharts library

## SVG and Programmatic Figure Formats

### SVG File Format

SVG files were stored in the `public/svg/` directory and referenced in the exam JSON files with the structure:

```json
{
  "type": "svg_file",
  "library": "svg",
  "svg_url": "/svg/figure_name.svg",
  "title": "Figure Title",
  "description": "Figure description"
}
```

### Programmatic Plot Format

Plots were defined programmatically with data points and styling:

```json
{
  "type": "plot",
  "library": "recharts",
  "title": "Plot Title",
  "data_points": [
    { "x": 0, "y1": 10, "y2": 20 },
    { "x": 10, "y1": 15, "y2": 25 }
  ],
  "series": [
    {
      "name": "Series 1",
      "data_key": "y1",
      "color": "#8884d8",
      "line_style": "solid"
    },
    {
      "name": "Series 2",
      "data_key": "y2",
      "color": "#82ca9d",
      "line_style": "dashed"
    }
  ],
  "x_axis": { 
    "key": "x",
    "label": "X Axis",
    "domain": [0, 100]
  },
  "y_axes": [
    {
      "id": "left",
      "orientation": "left",
      "label": "Y Axis",
      "domain": [0, 30]
    }
  ]
}
```

### Programmatic Diagram Format

Diagrams were defined with SVG elements in JSON:

```json
{
  "type": "diagram",
  "description": "Diagram Description",
  "viewBox": "0 0 500 250",
  "elements": [
    { 
      "element_type": "line", 
      "x1": 50, "y1": 50, 
      "x2": 200, "y2": 50, 
      "stroke": "black", 
      "stroke_width": 2 
    },
    { 
      "element_type": "text", 
      "x": 100, "y": 75, 
      "text": "Label", 
      "font_size": 14 
    },
    // More elements...
  ]
}
```

## Conversion to PNG Approach

To move quickly with development, we've:

1. Created a new `ImageRenderer.tsx` component for rendering PNG images
2. Updated JSON configurations to use "type": "image" instead of programmatic figures
3. Replaced SVG URLs and programmatic definitions with PNG image URLs
4. Backed up original SVG files and programmatic configurations for future reference

## Example Conversions

### SVG File to PNG Conversion:
**Original SVG reference:**
```json
{
  "type": "svg_file",
  "library": "svg",
  "svg_url": "/svg/q19_case1.svg",
  "title": "Case 1: Hématies agglutinées (sérum d'un animal atteint)",
  "description": "Illustration montrant l'agglutination des hématies dans la case 1"
}
```

**New PNG reference:**
```json
{
  "type": "image",
  "library": "img",
  "image_url": "/images/medecine2023/q19_case1.png",
  "title": "Case 1: Hématies agglutinées (sérum d'un animal atteint)",
  "description": "Illustration montrant l'agglutination des hématies dans la case 1"
}
```

### Programmatic Plot to PNG Conversion:
**Original plot configuration:**
```json
{
  "type": "plot",
  "library": "recharts",
  "title": "Évolution des concentrations pendant l'effort",
  "data_points": [
    { "distance": 0, "phosphocreatine": 10, "atp": 5, "acideLactique": 2 },
    // More data points...
  ],
  "series": [
    // Series configuration...
  ],
  "x_axis": {
    // X axis configuration...
  },
  "y_axes": [
    // Y axes configuration...
  ]
}
```

**New PNG reference:**
```json
{
  "type": "image",
  "library": "img",
  "image_url": "/images/medecine2023/q11_concentrations.png",
  "title": "Évolution des concentrations pendant l'effort",
  "description": "Graphique montrant l'évolution des concentrations de phosphocréatine, ATP et acide lactique en fonction de la distance parcourue"
}
```

## Future Considerations

If precision and programmatic control become higher priorities in the future, we can revisit the SVG approach. The backed-up files and this documentation will serve as a reference for reimplementing that approach. 