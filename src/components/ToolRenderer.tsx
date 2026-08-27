import React from 'react';
import { ToolDefinition } from '../types';
import { TextTools } from './tools/TextTools';
import { PdfTools } from './tools/PdfTools';
import { ImageTools } from './tools/ImageTools';
import { SocialMediaTools } from './tools/SocialMediaTools';
import { EducationTools } from './tools/EducationTools';
import { CareerTools } from './tools/CareerTools';
import { DeveloperTools } from './tools/DeveloperTools';
import { UtilityTools } from './tools/UtilityTools';

interface ToolRendererProps {
  tool: ToolDefinition;
}

export const ToolRenderer: React.FC<ToolRendererProps> = ({ tool }) => {
  const cat = tool.categoryId;

  if (cat === 'pdf-tools') {
    return <PdfTools toolId={tool.id} />;
  }

  if (cat === 'image-tools') {
    return <ImageTools toolId={tool.id} />;
  }

  if (cat === 'text-tools') {
    return <TextTools toolId={tool.id} />;
  }

  if (cat === 'social-media') {
    return <SocialMediaTools toolId={tool.id} />;
  }

  if (cat === 'education') {
    return <EducationTools toolId={tool.id} />;
  }

  if (cat === 'career') {
    return <CareerTools toolId={tool.id} />;
  }

  if (cat === 'developer') {
    return <DeveloperTools toolId={tool.id} />;
  }

  // Fallback to Utility / Finance Tools
  return <UtilityTools toolId={tool.id} />;
};
