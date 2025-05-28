import React from 'react';

interface RawSvgFigureData {
  type: 'raw_svg';
  svg_content: string;
  description?: string;
}

interface RawSvgRendererProps {
  figureData: RawSvgFigureData;
}

const RawSvgRenderer: React.FC<RawSvgRendererProps> = ({ figureData }) => {
  if (!figureData || figureData.type !== 'raw_svg' || !figureData.svg_content) {
    return <div>Invalid SVG configuration.</div>;
  }

  return (
    <div className="svg-renderer" dangerouslySetInnerHTML={{ __html: figureData.svg_content }} />
  );
};

export default RawSvgRenderer; 