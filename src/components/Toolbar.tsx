import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiMove, FiRotateCw, FiZoomIn, FiZoomOut, FiGrid, FiLayers } from 'react-icons/fi';

const ToolbarContainer = styled.div`
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  backdrop-filter: blur(10px);
`;

const ToolGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1rem;
  border-right: 1px solid ${props => props.theme.border};

  &:last-child {
    border-right: none;
  }
`;

const ToolButton = styled(motion.button)<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${props => props.active ? props.theme.primary : 'transparent'};
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  border-radius: 8px;
  color: ${props => props.active ? 'white' : props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.active ? props.theme.primary : props.theme.border};
    border-color: ${props => props.theme.primary};
  }
`;

const ToolLabel = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.textSecondary};
  margin-left: 0.5rem;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ZoomValue = styled.span`
  font-size: 0.9rem;
  color: ${props => props.theme.text};
  min-width: 60px;
  text-align: center;
`;

interface ToolbarProps {
  selectedTool?: string;
  onToolSelect?: (tool: string) => void;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  showGrid?: boolean;
  onToggleGrid?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool = 'select',
  onToolSelect = () => {},
  zoom = 1,
  onZoomChange = () => {},
  showGrid = true,
  onToggleGrid = () => {}
}) => {
  const handleZoomIn = () => {
    const newZoom = Math.min(zoom * 1.2, 3);
    onZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom / 1.2, 0.1);
    onZoomChange(newZoom);
  };

  const handleResetZoom = () => {
    onZoomChange(1);
  };

  return (
    <ToolbarContainer>
      <ToolGroup>
        <ToolButton
          active={selectedTool === 'select'}
          onClick={() => onToolSelect('select')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Select Tool"
        >
          <FiMove />
        </ToolButton>
        <ToolLabel>Select</ToolLabel>
      </ToolGroup>

      <ToolGroup>
        <ToolButton
          active={selectedTool === 'rotate'}
          onClick={() => onToolSelect('rotate')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Rotate Tool"
        >
          <FiRotateCw />
        </ToolButton>
        <ToolLabel>Rotate</ToolLabel>
      </ToolGroup>

      <ToolGroup>
        <ZoomControls>
          <ToolButton
            onClick={handleZoomOut}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Zoom Out"
          >
            <FiZoomOut />
          </ToolButton>
          
          <ZoomValue onClick={handleResetZoom} style={{ cursor: 'pointer' }}>
            {Math.round(zoom * 100)}%
          </ZoomValue>
          
          <ToolButton
            onClick={handleZoomIn}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Zoom In"
          >
            <FiZoomIn />
          </ToolButton>
        </ZoomControls>
      </ToolGroup>

      <ToolGroup>
        <ToolButton
          active={showGrid}
          onClick={onToggleGrid}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Toggle Grid"
        >
          <FiGrid />
        </ToolButton>
        <ToolLabel>Grid</ToolLabel>
      </ToolGroup>

      <ToolGroup>
        <ToolButton
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title="Layers"
        >
          <FiLayers />
        </ToolButton>
        <ToolLabel>Layers</ToolLabel>
      </ToolGroup>
    </ToolbarContainer>
  );
};

export default Toolbar;