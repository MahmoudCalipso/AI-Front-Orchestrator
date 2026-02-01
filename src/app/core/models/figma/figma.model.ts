/**
 * Figma Models
 * All Figma-related DTOs matching backend Python models
 */

// ==================== Figma Analyze Request ====================
export interface FigmaAnalyzeRequest {
  figma_url: string;
  figma_token?: string;
  project_name?: string;
  generate_code?: boolean;
  framework?: string;
  language?: string;
}

// ==================== Figma Analysis Response ====================
export interface FigmaAnalysisResponseDTO {
  analysis_id: string;
  figma_url: string;
  project_name: string;
  components: FigmaComponent[];
  styles: FigmaStyle[];
  pages: FigmaPage[];
  generated_code?: GeneratedCode;
  summary: string;
  created_at: string;
}

// ==================== Figma Component ====================
export interface FigmaComponent {
  id: string;
  name: string;
  type: string;
  description?: string;
  properties: ComponentProperty[];
  children?: FigmaComponent[];
  bounds: Bounds;
}

// ==================== Component Property ====================
export interface ComponentProperty {
  name: string;
  type: string;
  value: any;
  description?: string;
}

// ==================== Figma Style ====================
export interface FigmaStyle {
  id: string;
  name: string;
  type: string;
  description?: string;
  properties: StyleProperty[];
}

// ==================== Style Property ====================
export interface StyleProperty {
  name: string;
  value: any;
  unit?: string;
}

// ==================== Figma Page ====================
export interface FigmaPage {
  id: string;
  name: string;
  description?: string;
  components: FigmaComponent[];
  frames: FigmaFrame[];
}

// ==================== Figma Frame ====================
export interface FigmaFrame {
  id: string;
  name: string;
  type: string;
  bounds: Bounds;
  components: FigmaComponent[];
}

// ==================== Bounds ====================
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// ==================== Generated Code ====================
export interface GeneratedCode {
  files: GeneratedFile[];
  total_files: number;
}

// ==================== Generated File ====================
export interface GeneratedFile {
  path: string;
  content: string;
  language: string;
  type: string;
}

// ==================== Figma Component Type ====================
export enum FigmaComponentType {
  FRAME = 'frame',
  GROUP = 'group',
  COMPONENT = 'component',
  INSTANCE = 'instance',
  TEXT = 'text',
  RECTANGLE = 'rectangle',
  ELLIPSE = 'ellipse',
  VECTOR = 'vector',
  STAR = 'star',
  LINE = 'line',
  REGULAR_POLYGON = 'regular_polygon'
}

// ==================== Figma Style Type ====================
export enum FigmaStyleType {
  COLOR = 'color',
  TEXT = 'text',
  EFFECT = 'effect',
  GRID = 'grid'
}
