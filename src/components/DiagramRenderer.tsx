// src/components/DiagramRenderer.tsx
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Helper component to render KaTeX within SVG ForeignObject
const SvgKaTeX: React.FC<{ x: number; y: number; text: string; fontSize?: number; textAnchor?: 'start' | 'middle' | 'end'; }> = ({ x, y, text, fontSize = 12, textAnchor = 'start' }) => {
  // Map SVG text anchor to CSS text-align
  const textAlign = textAnchor === 'start' ? 'left' : textAnchor === 'middle' ? 'center' : 'right';
  
  // Estimate size needed for the foreignObject. This is a simplification.
  // Real sizing would depend on rendered math complexity.
  const width = text.length * (fontSize * 0.6); // Rough estimate
  const height = fontSize * 1.5; // Rough estimate

  // Adjust x and y based on textAnchor
  let adjustedX = x;
  if (textAnchor === 'middle') adjustedX = x - width / 2;
  if (textAnchor === 'end') adjustedX = x - width;

  // Adjust y based on vertical alignment - assumes default middle for foreignObject content
  const adjustedY = y - height / 2; // Center vertically around the provided y

  try {
    const html = katex.renderToString(text, { throwOnError: false });

    return (
      <foreignObject x={adjustedX} y={adjustedY} width={width} height={height}>
        {/* Use a div to contain the rendered math */}
        <div style={{ fontSize: `${fontSize}px`, lineHeight: 1, verticalAlign: 'middle', textAlign }}>
             {/* dangerouslySetInnerHTML is needed to render the HTML output from KaTeX */}
            <span dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </foreignObject>
    );
  } catch (e) {
    console.error("Error rendering KaTeX in SVG:", text, e);
    // Render fallback text in case of KaTeX error
    return (
       <text x={x} y={y} style={{ fontSize: `${fontSize}px`, fill: 'red' }} textAnchor={textAnchor}>
           {`Error: ${text}`}
       </text>
    );
  }
};


interface SvgElement {
  element_type: string; // e.g., 'line', 'rect', 'circle', 'text', 'path', 'group'
  id?: string;
  [key: string]: any; // Other SVG attributes (x, y, x1, y1, r, d, stroke, fill, etc.)
  label?: { // Optional label, can contain KaTeX
      text: string;
      x: number; // Position relative to the element or group
      y: number;
      font_size?: number;
      text_anchor?: 'start' | 'middle' | 'end';
  };
  elements?: SvgElement[]; // For group elements
}

interface DiagramFigureData {
  type: 'diagram';
  description?: string;
  viewBox?: string;
  elements: SvgElement[];
  // You might add a 'defs' field here for reusable SVG elements like markers
  // defs?: { [key: string]: any }; // Example structure
}

interface DiagramRendererProps {
  figureData: DiagramFigureData;
}

const renderSvgElement = (element: SvgElement, key: string | number): React.ReactNode => {
  const { element_type, label, elements, ...attributes } = element;

  let svgElement = null;

  switch (element_type) {
    case 'line':
      svgElement = <line {...attributes} key={key} />;
      break;
    case 'rect':
      svgElement = <rect {...attributes} key={key} />;
      break;
    case 'circle':
      svgElement = <circle {...attributes} key={key} />;
      break;
    case 'text':
       // Check if text contains KaTeX delimiters
       if (typeof attributes.text === 'string' && attributes.text.includes('$')) {
           return (
              <SvgKaTeX
                 key={key}
                 x={attributes.x}
                 y={attributes.y}
                 text={attributes.text}
                 fontSize={attributes.font_size || 12}
                 textAnchor={attributes.text_anchor}
              />
           );
       }
      svgElement = <text {...attributes} key={key}>{attributes.text}</text>;
      break;
    case 'path':
      svgElement = <path {...attributes} key={key} />;
      break;
    case 'group':
      svgElement = (
        <g {...attributes} key={key}>
          {elements && elements.map((el, i) => renderSvgElement(el, i))}
        </g>
      );
      break;
    // Add other SVG element types as needed (e.g., polygon, polyline, ellipse)
    default:
      console.warn('Unknown SVG element type:', element_type);
      return null;
  }

  // Render label if exists. Position relative to the element's origin or bounding box - simplified here
   const labelElement = label && (
       // Label position (x, y) from JSON is relative to parent group or SVG.
       // We render the label as a separate SVG element.
        typeof label.text === 'string' && label.text.includes('$') ? (
            <SvgKaTeX
               key={`${key}-label`}
               x={label.x}
               y={label.y}
               text={label.text}
               fontSize={label.font_size}
               textAnchor={label.text_anchor}
            />
        ) : (
           <text
              key={`${key}-label`}
              x={label.x}
              y={label.y}
              style={{ fontSize: label.font_size, fill: 'black' }}
               textAnchor={label.text_anchor}
           >
               {label.text}
           </text>
        )
   );


  // If the element is a group, return the group with its elements and its label
  if (element_type === 'group') {
      return (
          <React.Fragment key={key}>
              {svgElement}
              {labelElement}
          </React.Fragment>
      );
  }


  // For single elements, return the element and its label as a group or fragment
  return (
      <React.Fragment key={key}>
          {svgElement}
          {labelElement}
      </React.Fragment>
  );
};


const DiagramRenderer: React.FC<DiagramRendererProps> = ({ figureData }) => {
  if (!figureData || figureData.type !== 'diagram') {
    return <div>Invalid diagram configuration.</div>;
  }

  const { viewBox = '0 0 300 200', elements } = figureData;

  return (
    <div className="diagram-renderer">
      {/* Add a title or description here if figureData included one */}
      <svg viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
        {/* Define reusable elements like arrow markers */}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
           {/* Add other defs as needed */}
        </defs>
        {/* Render the main elements */}
        {elements && elements.map((element, index) => renderSvgElement(element, index))}
      </svg>
    </div>
  );
};

export default DiagramRenderer;