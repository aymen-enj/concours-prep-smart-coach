// src/components/PlotRenderer.tsx
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  Text,
} from 'recharts';
import 'katex/dist/katex.min.css';
import katex from 'katex';

// Helper component to render text with KaTeX
const KaTeXText: React.FC<any> = (props) => {
  const { text, x, y, stroke, fill, className, style, textAnchor, verticalAnchor, fontSize } = props;
  // Check if the text contains KaTeX delimiters.
  const containsKaTeX = typeof text === 'string' && (text.includes('$') || text.includes('\\') || text.includes('\\') || text.includes('\\[') || text.includes('\]') || text.includes('\\{') || text.includes('\\}'));

  // If the component is used in a context that expects a simple React node (like Recharts Label content),
  // and contains KaTeX, render as a span with dangerouslySetInnerHTML.
  // Otherwise, if it's plain text or used in a context expecting Recharts Text element,
  // render as Recharts Text.

  // We can't reliably detect the context (Label content vs direct render) just from props.
  // A pragmatic approach is to assume that if KaTeX is present, it's intended for a context
  // that can handle raw HTML (like Label content),
  // and if not, it's for direct rendering via Recharts Text.

  if (containsKaTeX) {
      try {
        const unit = props.unit || '';
        const valueWithUnit = unit ? `${props.text}\\ \\mathrm{${unit}}` : `${props.text}`;
        const html = katex.renderToString(valueWithUnit, { throwOnError: false });
         // Return a simple span with dangerouslySetInnerHTML
         // Recharts Label component's `content` prop can render this HTML within SVG.
         return (
            <span
                dangerouslySetInnerHTML={{ __html: html }}
                style={{
                    fontSize: fontSize, // Use fontSize from props
                    lineHeight: 1,
                    display: 'inline-block',
                    whiteSpace: 'nowrap', // Prevent text wrapping
                    verticalAlign: 'middle', // Help with vertical alignment
                    ...style // Merge external styles
                }}
                 // Recharts Label component handles positioning based on its own props.
                 // We don't need to pass x, y, textAnchor, verticalAnchor to the span.
            />
         );
      } catch (e) {
          console.error("Error rendering KaTeX in PlotRenderer (span):", text, e);
           // Fallback to plain text rendering on error
    return (
      <Text
        x={x}
        y={y}
        stroke={stroke}
        fill={fill}
        className={className}
        style={style}
                 textAnchor={textAnchor}
                 verticalAnchor={verticalAnchor}
      >
                {`Error rendering math: ${text}`}
      </Text>
    );
  }
  } else {
    // Render plain text using Recharts Text component if no KaTeX
     return (
        <Text
            x={x}
            y={y}
            stroke={stroke}
            fill={fill}
            className={className}
            style={style}
        textAnchor={textAnchor}
        verticalAnchor={verticalAnchor}
      >
        {text}
          </Text>
       );
  }
};

// Helper component to render KaTeX ticks on axes
const KaTeXTick = (props: any) => {
  const { x, y, payload, fill, fontSize = 12, unit } = props;
  try {
    // If unit is in LaTeX with $...$, remove the $ for KaTeX
    let latexUnit = unit;
    if (latexUnit && latexUnit.startsWith('$') && latexUnit.endsWith('$')) {
      latexUnit = latexUnit.slice(1, -1);
    }
    const valueWithUnit = latexUnit ? `${payload.value}~\\mathrm{${latexUnit}}` : `${payload.value}`;
    const html = katex.renderToString(valueWithUnit, { throwOnError: false });
    return (
      <g transform={`translate(${x},${y})`}>
        <foreignObject width="80" height="24" x={-40} y={-12}>
          <span style={{ color: fill, fontSize }} dangerouslySetInnerHTML={{ __html: html }} />
        </foreignObject>
      </g>
    );
  } catch {
    return (
      <text x={x} y={y} fill={fill} fontSize={fontSize} textAnchor="middle">
        {unit ? `${payload.value} ${unit}` : payload.value}
      </text>
    );
  }
};

// Custom Tooltip component with KaTeX rendering
const KaTeXTooltip = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="custom-tooltip" style={{ 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '8px',
      borderRadius: '4px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '4px' }}>
        <strong>{label}</strong>
      </div>
      {payload.map((entry, i) => {
        let valueHtml = '';
        if (entry.unit) {
          let unit = entry.unit;
          if (unit.startsWith('$') && unit.endsWith('$')) {
            unit = unit.slice(1, -1);
          }
          valueHtml = katex.renderToString(`${entry.value}\\ \\mathrm{${unit}}`, { throwOnError: false });
        } else {
          valueHtml = katex.renderToString(`${entry.value}`, { throwOnError: false });
        }
        return (
          <div key={i} style={{ 
            color: entry.color, 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            marginBottom: '2px'
          }}>
            <span>{entry.name}:</span>
            <span dangerouslySetInnerHTML={{ __html: valueHtml }} />
          </div>
        );
      })}
    </div>
  );
};

interface PlotFigureData {
  type: 'plot';
  library: 'recharts' | 'plotly.js';
  title?: string;
  data_points: any[];
  series: {
    name: string;
    data_key: string;
    unit?: string;
    color: string;
    line_style: 'solid' | 'dashed' | 'dotted';
    y_axis_id?: string;
  }[];
  x_axis: {
    key: string;
    label?: string;
    unit?: string;
    domain?: [number, number];
    ticks?: number[];
  };
  y_axes: {
    id: string;
    orientation?: 'left' | 'right';
    label?: string;
    unit?: string;
    domain?: [number, number];
    ticks?: number[];
    stroke?: string; // Color for the axis
  }[];
  legend?: boolean;
  grid?: boolean;
  annotations?: (
    | {
        type: 'text';
        x_start: number;
        x_end: number;
        y_position_factor: number;
        text: string;
        style?: React.CSSProperties;
        textAnchor?: 'start' | 'middle' | 'end';
        verticalAnchor?: 'start' | 'middle' | 'end';
    }
    | {
        type: 'line';
        x1: number; // Start x in data units
        y1: number; // Start y in data units
        x2: number; // End x in data units
        y2: number; // End y in data units
        stroke?: string; // Line color
        strokeWidth?: number;
        strokeDasharray?: string;
    }
  )[];
}

interface PlotRendererProps {
  figureData: PlotFigureData;
}

const PlotRenderer: React.FC<PlotRendererProps> = ({ figureData }) => {
  if (!figureData || figureData.type !== 'plot' || figureData.library !== 'recharts') {
    return <div>Invalid plot configuration.</div>;
  }

  const {
    title,
    data_points,
    series,
    x_axis,
    y_axes,
    legend = true,
    grid = true,
    annotations,
  } = figureData;

  // Prepare Y-axes components
  const yAxesComponents = y_axes.map((axis, index) => (
    <YAxis
      key={axis.id}
      yAxisId={axis.id}
      orientation={axis.orientation}
      unit={axis.unit}
      domain={axis.domain}
      ticks={axis.ticks}
      stroke={axis.stroke || '#888'} // Use specified color or default
      tick={<KaTeXTick unit={axis.unit} />}
    />
  ));

  // Prepare Lines components
  const linesComponents = series.map((s) => {
      const strokeDasharray = s.line_style === 'dashed' ? '5 5' : s.line_style === 'dotted' ? '2 2' : undefined;
      return (
          <Line
              key={s.data_key}
              type="monotone" // Or 'linear', 'step' etc.
              dataKey={s.data_key}
              stroke={s.color}
              strokeDasharray={strokeDasharray}
              yAxisId={s.y_axis_id}
              dot={false} // Hide dots by default
              name={s.name} // Used in Tooltip and Legend
              unit={s.unit} // Used in Tooltip
          />
      );
  });

  // Function to render annotations
  const renderAnnotations = () => {
    if (!annotations) return null;

    return annotations.map((annotation, index) => {
      if (annotation.type === 'text') {
        return (
          <div
            key={`annotation-${index}`}
            style={{
              position: 'absolute',
              top: `${(annotation.y_position_factor || 0) * 100}%`,
              left: '50%',
              transform: 'translateX(-50%)',
              ...annotation.style,
            }}
          >
            {annotation.text}
          </div>
        );
      } else if (annotation.type === 'line') {
        // For line annotations, we need to use SVG line element
        // The coordinates will be converted from data space to pixel space by Recharts
        return (
          <svg
            key={`line-annotation-${index}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none'
            }}
          >
            <line
              x1={`${(annotation.x1 / (x_axis.domain?.[1] || 10)) * 100}%`}
              y1={`${100 - ((annotation.y1 - (y_axes[0].domain?.[0] || 0)) / ((y_axes[0].domain?.[1] || 6) - (y_axes[0].domain?.[0] || 0))) * 100}%`}
              x2={`${(annotation.x2 / (x_axis.domain?.[1] || 10)) * 100}%`}
              y2={`${100 - ((annotation.y2 - (y_axes[0].domain?.[0] || 0)) / ((y_axes[0].domain?.[1] || 6) - (y_axes[0].domain?.[0] || 0))) * 100}%`}
              stroke={annotation.stroke || '#666'}
              strokeWidth={annotation.strokeWidth || 1}
              strokeDasharray={annotation.strokeDasharray || '5,5'}
            />
          </svg>
        );
      }
      return null;
    });
  };

  // Determine chart dimensions
  const chartHeight = 400;
  const chartWidth = 1000;

  return (
    <div style={{ width: '100%', height: chartHeight, maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
      {title && <h3 style={{ textAlign: 'center' }}><KaTeXText text={title} fontSize={14} /></h3>}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data_points} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
          {grid && <CartesianGrid strokeDasharray="3 3" stroke="#888" />}
          <XAxis
            dataKey={x_axis.key}
            domain={x_axis.domain}
            ticks={x_axis.ticks}
            stroke="#000"
            strokeWidth={1}
            tick={{ fontSize: 12, fill: '#000' }}
          >
            {x_axis.label && (
              <Label
                value={x_axis.label}
                position="bottom"
                offset={10}
                style={{ textAnchor: 'middle', fontSize: '12px' }}
                content={<KaTeXText text={x_axis.label} fontSize={12} />}
              />
            )}
          </XAxis>
          {yAxesComponents}
          {y_axes.map(axis => axis.label && (
            <text
              key={`custom-yaxis-label-${axis.id}`}
              x={axis.orientation === 'left' ? 10 : chartWidth - 10}
              y={10}
              textAnchor={axis.orientation === 'left' ? 'start' : 'end'}
              style={{ fontSize: '12px', fill: '#000' }}
            >
              <KaTeXText text={axis.label} fontSize={12} />
            </text>
          ))}
          <Tooltip content={KaTeXTooltip} />
          {legend && <Legend verticalAlign="top" align="center" />}
          {linesComponents}
        </LineChart>
      </ResponsiveContainer>
      {renderAnnotations()}
    </div>
  );
};

export default PlotRenderer;