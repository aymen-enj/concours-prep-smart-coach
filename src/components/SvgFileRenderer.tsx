import React, { useState, useEffect } from 'react';

interface SvgFileFigureData {
  type: 'svg_file';
  svg_url: string;
  description?: string;
}

interface SvgFileRendererProps {
  figureData: SvgFileFigureData;
}

const SvgFileRenderer: React.FC<SvgFileRendererProps> = ({ figureData }) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!figureData || figureData.type !== 'svg_file' || !figureData.svg_url) {
      setError('Invalid SVG configuration.');
      setIsLoading(false);
      return;
    }

    const fetchSvg = async () => {
      try {
        const response = await fetch(figureData.svg_url);
        if (!response.ok) {
          throw new Error(`Failed to fetch SVG: ${response.status} ${response.statusText}`);
        }
        const svgText = await response.text();
        setSvgContent(svgText);
        setIsLoading(false);
      } catch (err) {
        setError(`Error loading SVG: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };

    fetchSvg();
  }, [figureData]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">Chargement du graphique...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="svg-renderer" dangerouslySetInnerHTML={{ __html: svgContent }} />
  );
};

export default SvgFileRenderer; 