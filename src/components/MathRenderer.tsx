import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathRendererProps {
  text: string;
  block?: boolean;
}

/**
 * Component to render text that may contain LaTeX math formulas
 * Processes text and renders LaTeX formulas inside $ $ or $$ $$ delimiters
 */
const MathRenderer: React.FC<MathRendererProps> = ({ text, block = false }) => {
  // Defensive: if text is not a string, render nothing or fallback
  if (typeof text !== 'string') {
    return <span>{String(text ?? '')}</span>;
  }

  // No math formulas
  if (!text.includes('$')) {
    return <span>{text}</span>;
  }

  // Split the text by $ (for inline math) and $$ (for block math)
  const segments = [];
  let currentIndex = 0;
  let inMath = false;
  let inBlockMath = false;

  // Find all math expressions
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '$') {
      // Check if it's a block math delimiter ($$)
      const isBlockDelimiter = i + 1 < text.length && text[i + 1] === '$';
      
      if (isBlockDelimiter) {
        // Handle block math
        if (!inMath && !inBlockMath) {
          // Start of block math
          if (currentIndex < i) {
            segments.push({
              type: 'text',
              content: text.substring(currentIndex, i)
            });
          }
          currentIndex = i + 2; // Skip the $$
          inBlockMath = true;
          i++; // Skip the next $ as we've already processed it
        } else if (inBlockMath) {
          // End of block math
          segments.push({
            type: 'blockMath',
            content: text.substring(currentIndex, i)
          });
          currentIndex = i + 2; // Skip the $$
          inBlockMath = false;
          i++; // Skip the next $ as we've already processed it
        }
      } else {
        // Handle inline math
        if (!inMath && !inBlockMath) {
          // Start of inline math
          if (currentIndex < i) {
            segments.push({
              type: 'text',
              content: text.substring(currentIndex, i)
            });
          }
          currentIndex = i + 1; // Skip the $
          inMath = true;
        } else if (inMath) {
          // End of inline math
          segments.push({
            type: 'inlineMath',
            content: text.substring(currentIndex, i)
          });
          currentIndex = i + 1; // Skip the $
          inMath = false;
        }
      }
    }
  }

  // Add the remaining text
  if (currentIndex < text.length) {
    segments.push({
      type: 'text',
      content: text.substring(currentIndex)
    });
  }

  // Render the segments
  return (
    <span className="math-renderer">
      {segments.map((segment, index) => {
        if (segment.type === 'text') {
          return <span key={index}>{segment.content}</span>;
        } else if (segment.type === 'inlineMath') {
          try {
            return <InlineMath key={index} math={segment.content} />;
          } catch (error) {
            console.error('Error rendering inline math:', error);
            return <code key={index}>${segment.content}$</code>;
          }
        } else if (segment.type === 'blockMath') {
          try {
            return <BlockMath key={index} math={segment.content} />;
          } catch (error) {
            console.error('Error rendering block math:', error);
            return <pre key={index}>$${segment.content}$$</pre>;
          }
        }
        return null;
      })}
    </span>
  );
};

export default MathRenderer;