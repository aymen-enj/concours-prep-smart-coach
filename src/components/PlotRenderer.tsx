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
  annotations?: {
      type: 'text';
      x_start: number;
      x_end: number;
      y_position_factor: number; // e.g., -0.1 to position above the chart
      text: string;
      style?: React.CSSProperties;
      textAnchor?: 'start' | 'middle' | 'end';
      verticalAnchor?: 'start' | 'middle' | 'end';
  }[];
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

  // Determine chart dimensions. Using responsive container for flexibility.
  // You might need to adjust height based on content (title, legend, axes labels)
  const chartHeight = 400; // Example height, adjust as needed
  const chartWidth = 1000; // Example width, adjust as needed
  return (
    <div style={{ width: '100%', height: chartHeight, maxWidth: '1000px', margin: '0 auto' }}> {/* Reduced max width and centered */}
      {title && <h3 style={{ textAlign: 'center' }}><KaTeXText text={title} fontSize={14} /></h3>} {/* Pass fontSize to title */}
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data_points} margin={{ top: 20, right: 80, left: 80, bottom: 40 }}> {/* Increased left/right and bottom margins */}
          {grid && <CartesianGrid strokeDasharray="3 3" />}

          {/* XAxis with KaTeXText for label */}
          <XAxis
            dataKey={x_axis.key}
            label={x_axis.label ? { value: x_axis.label, position: 'bottom', style: { textAnchor: 'middle' } } : undefined}
            unit={x_axis.unit}
            domain={x_axis.domain}
            ticks={x_axis.ticks}
          >
           {/* Using the KaTeXText helper for the label value */}
           {x_axis.label && (
               <Label
                  value={x_axis.label}
                  position="bottom"
                  style={{ textAnchor: 'middle' }}
                   content={<KaTeXText text={x_axis.label} fontSize={12} />} // x/y ignored by Label, pass fontSize
               />
           )}
          </XAxis>

          {/* YAxes */}
          {yAxesComponents}

          {/* Add custom horizontal Y-axis label at the top */}
          {y_axes.map(axis => axis.label && (
              <text
                  key={`custom-yaxis-label-${axis.id}`}
                  x={axis.orientation === 'left' ? 40 : chartWidth - 40} // Adjust x position based on orientation
                  y={10} // Position at the top
                  textAnchor={axis.orientation === 'left' ? 'middle' : 'middle'} // Center the text
                  dominantBaseline="hanging" // Align the top of the text to the y coordinate
                  style={{ fontSize: '12px' }}
              >
                  <KaTeXText text={axis.label} fontSize={12} />
              </text>
          ))}

          <Tooltip /> {/* Default tooltip, customize if needed */}

          {legend && <Legend />}

          {linesComponents}

          {/* Render Annotations */}
          {/* Annotations positioning might require converting chart coordinates to SVG coordinates */}
          {/* A simplified approach is to place text relative to chart container or use Recharts' internal hooks/components */}
          {/* For now, a basic text rendering for annotations: */}
          {annotations && annotations.map((annotation, index) => {
              if (annotation.type === 'text') {
                  // This positioning is simplified and assumes the x_start/x_end relate to data domain.
                  // Precise positioning relative to chart area requires more context or calculation.
                  // A simple approach is to place text at calculated SVG coordinates.
                  // Recharts doesn't directly expose easy ways to map data coords to SVG coords for arbitrary elements.
                  // Let's just render them absolutely or relative to a container for now, or make a best guess at position within the chart area.

                  // A possible strategy: find a data point near x_start/x_end and position relative to it.
                  // Or position relative to the ResponsiveContainer bounds.

                  // Let's add a placeholder rendering for annotations.
                  // A proper implementation would need to calculate screen coordinates from data coordinates.
                  // For demonstration, let's just add a simple text label at a fixed position or relative to the top of the chart.
                   // Placing annotation text above the chart title for simplicity
                  return (
                      <div
                          key={`annotation-${index}`}
                           style={{
                               position: 'absolute',
                               top: `${(annotation.y_position_factor || 0) * 100}%`, // Position above chart
                               left: '50%', // Center horizontally - needs refinement based on x_start/x_end
                               transform: 'translateX(-50%)',
                               ...annotation.style,
                               // This absolute positioning is relative to the parent div, not the chart axes.
                               // For positioning relative to axes, more complex Recharts custom rendering is needed.
                           }}
                      >
                          {annotation.text} {/* No KaTeX rendering here in this simplified placement */}
                      </div>
                  );
              }
              return null;
          })}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlotRenderer;