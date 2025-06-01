import React from 'react';
import MathRenderer from './MathRenderer';

interface ImageFigureData {
  type: 'image';
  library: string;
  image_url: string;
  title?: string;
  alt_text?: string;
  description?: string;
  width?: string;
  height?: string;
}

interface ImageRendererProps {
  figureData: ImageFigureData;
}

const ImageRenderer: React.FC<ImageRendererProps> = ({ figureData }) => {
  console.log("Rendering image from URL:", figureData.image_url);
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error("Erreur de chargement de l'image:", figureData.image_url);
    e.currentTarget.src = "/images/image-not-found.png";
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {figureData.title && (
        <h3 className="text-lg font-medium mb-3 text-center">{figureData.title}</h3>
      )}
      <img 
        src={figureData.image_url}
        alt={figureData.alt_text || figureData.title || "Figure"}
        style={{ 
          width: figureData.width || 'auto',
          maxWidth: '100%',
          height: figureData.height || 'auto',
          maxHeight: '500px',
          objectFit: 'contain'
        }}
        className="rounded-md border border-gray-200 dark:border-gray-700"
        onError={handleImageError}
      />
      {figureData.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">{figureData.description}</p>
      )}
    </div>
  );
};

export default ImageRenderer; 