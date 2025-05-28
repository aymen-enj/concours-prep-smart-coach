import React from 'react';
import MathRenderer from './MathRenderer';

interface ImageFigureData {
  type: 'image';
  image_url: string;
  title?: string;
  description?: string;
  alt_text?: string;
  width?: string | number;
  height?: string | number;
}

interface ImageRendererProps {
  figureData: ImageFigureData;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ figureData }) => {
  if (!figureData || figureData.type !== 'image' || !figureData.image_url) {
    return <div>Invalid image configuration.</div>;
  }

  const { image_url, title, description, alt_text, width = '100%', height = 'auto' } = figureData;

  return (
    <div className="image-renderer">
      {title && <h3 className="text-center text-lg font-medium mb-2">{title}</h3>}
      <img 
        src={image_url}
        alt={alt_text || description || title || "Figure"}
        style={{ 
          width: width,
          height: height,
          maxWidth: '100%',
          display: 'block',
          margin: '0 auto'
        }}
        className="border-0"
      />
      {description && (
        <p className="text-sm text-center mt-2 text-gray-600">
          <MathRenderer text={description} />
        </p>
      )}
    </div>
  );
};

export default ImageRenderer; 