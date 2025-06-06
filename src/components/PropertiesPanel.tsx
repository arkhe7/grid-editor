import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiSettings, FiType, FiImage, FiLayers, FiGrid } from 'react-icons/fi'; // FiGrid eklendi
import { GridSlot } from '../types';
import { useGrid } from '../contexts/GridContext'; // useGrid import edildi

const Panel = styled.div`
  height: 100%;
  background: ${props => props.theme.surface};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PanelTitle = styled.h3`
  color: ${props => props.theme.text};
  margin: 0;
  font-size: 1.1rem;
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h4`
  color: ${props => props.theme.text};
  margin: 0 0 1rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PropertyGroup = styled.div`
  margin-bottom: 1rem;
`;

const PropertyLabel = styled.label`
  display: block;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const PropertyInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;

  &:focus {
    border-color: ${props => props.theme.primary};
    box-shadow: 0 0 0 2px rgba(46, 213, 115, 0.1);
  }
`;

const PropertySelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: ${props => props.theme.background};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  font-size: 0.9rem;
  outline: none;
  cursor: pointer;

  option {
    background: ${props => props.theme.background};
    color: ${props => props.theme.text};
  }
`;

const PropertyCheckbox = styled.input.attrs({ type: 'checkbox' })`
  margin-right: 0.5rem;
  accent-color: ${props => props.theme.primary};
`;

const ColorInput = styled.input.attrs({ type: 'color' })`
  width: 100%;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;
`;

const RangeInput = styled.input.attrs({ type: 'range' })`
  width: 100%;
  margin: 0.5rem 0;
  accent-color: ${props => props.theme.primary};
`;

const RangeValue = styled.span`
  color: ${props => props.theme.textSecondary};
  font-size: 0.8rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${props => props.theme.textSecondary};
`;

interface PropertiesPanelProps {
  selectedSlot: GridSlot | null;
  onSlotUpdate: (updates: Partial<GridSlot>) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ selectedSlot, onSlotUpdate }) => {
  const { currentGrid, updateGridBackgroundColor } = useGrid();

  const handleSlotPropertyChange = (property: keyof GridSlot, value: any) => {
    if (selectedSlot) {
      onSlotUpdate({ [property]: value });
    }
  };

  const handleGridBackgroundColorChange = (color: string) => {
    if (currentGrid) {
      updateGridBackgroundColor(color);
    }
  };

  return (
    <Panel>
      <PanelHeader>
        <FiSettings />
        <PanelTitle>Properties</PanelTitle>
      </PanelHeader>

      <PanelContent>
        {currentGrid && (
          <Section>
            <SectionTitle>
              <FiGrid /> {/* İkon güncellendi/eklendi */}
              Grid Settings
            </SectionTitle>
            <PropertyGroup>
              <PropertyLabel>Canvas Background Color</PropertyLabel>
              <ColorInput
                value={currentGrid.backgroundColor || '#000000'}
                onChange={(e) => handleGridBackgroundColorChange(e.target.value)}
              />
            </PropertyGroup>
          </Section>
        )}

        {selectedSlot ? (
          <>
            {/* Position & Size */}
            <Section>
              <SectionTitle>
                <FiLayers />
            Position & Size
          </SectionTitle>
          
          <PropertyGroup>
            <PropertyLabel>X Position</PropertyLabel>
            <PropertyInput
              type="number"
              value={selectedSlot.x}
              onChange={(e) => handleSlotPropertyChange('x', parseInt(e.target.value))}
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Y Position</PropertyLabel>
            <PropertyInput
              type="number"
              value={selectedSlot.y}
              onChange={(e) => handleSlotPropertyChange('y', parseInt(e.target.value))}
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Width</PropertyLabel>
            <PropertyInput
              type="number"
              value={selectedSlot.width}
              onChange={(e) => handleSlotPropertyChange('width', parseInt(e.target.value))}
              min="50"
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Height</PropertyLabel>
            <PropertyInput
              type="number"
              value={selectedSlot.height}
              onChange={(e) => handleSlotPropertyChange('height', parseInt(e.target.value))}
              min="50"
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Rotation</PropertyLabel>
            <RangeInput
              min="0"
              max="360"
              value={selectedSlot.rotation}
              onChange={(e) => handleSlotPropertyChange('rotation', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.rotation}°</RangeValue>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Scale</PropertyLabel>
            <RangeInput
              min="0.1"
              max="3"
              step="0.1"
              value={selectedSlot.scale}
              onChange={(e) => handleSlotPropertyChange('scale', parseFloat(e.target.value))}
            />
            <RangeValue>{selectedSlot.scale}x</RangeValue>
          </PropertyGroup>
        </Section>

        {/* Appearance */}
        <Section>
          <SectionTitle>
            <FiImage />
            Appearance
          </SectionTitle>

          <PropertyGroup>
            <PropertyLabel>Border Radius</PropertyLabel>
            <RangeInput
              min="0"
              max="50"
              value={selectedSlot.borderRadius}
              onChange={(e) => handleSlotPropertyChange('borderRadius', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.borderRadius}px</RangeValue>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Border Width</PropertyLabel>
            <RangeInput
              min="0"
              max="10"
              value={selectedSlot.borderWidth}
              onChange={(e) => handleSlotPropertyChange('borderWidth', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.borderWidth}px</RangeValue>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Border Color</PropertyLabel>
            <ColorInput
              value={selectedSlot.borderColor}
              onChange={(e) => handleSlotPropertyChange('borderColor', e.target.value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Background Color</PropertyLabel>
            <ColorInput
              value={selectedSlot.backgroundColor}
              onChange={(e) => handleSlotPropertyChange('backgroundColor', e.target.value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Opacity</PropertyLabel>
            <RangeInput
              min="0"
              max="1"
              step="0.1"
              value={selectedSlot.opacity}
              onChange={(e) => handleSlotPropertyChange('opacity', parseFloat(e.target.value))}
            />
            <RangeValue>{Math.round(selectedSlot.opacity * 100)}%</RangeValue>
          </PropertyGroup>
        </Section>

        {/* Shadow */}
        <Section>
          <SectionTitle>Shadow</SectionTitle>

          <PropertyGroup>
            <PropertyLabel>Shadow Blur</PropertyLabel>
            <RangeInput
              min="0"
              max="50"
              value={selectedSlot.shadowBlur}
              onChange={(e) => handleSlotPropertyChange('shadowBlur', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.shadowBlur}px</RangeValue>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Shadow Color</PropertyLabel>
            <ColorInput
              value={selectedSlot.shadowColor}
              onChange={(e) => handleSlotPropertyChange('shadowColor', e.target.value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Shadow Offset X</PropertyLabel>
            <RangeInput
              min="-20"
              max="20"
              value={selectedSlot.shadowOffsetX}
              onChange={(e) => handleSlotPropertyChange('shadowOffsetX', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.shadowOffsetX}px</RangeValue>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Shadow Offset Y</PropertyLabel>
            <RangeInput
              min="-20"
              max="20"
              value={selectedSlot.shadowOffsetY}
              onChange={(e) => handleSlotPropertyChange('shadowOffsetY', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.shadowOffsetY}px</RangeValue>
          </PropertyGroup>
        </Section>

        {/* Text */}
        <Section>
          <SectionTitle>
            <FiType />
            Text
          </SectionTitle>

          <PropertyGroup>
            <PropertyLabel>Text Color</PropertyLabel>
            <ColorInput
              value={selectedSlot.textColor}
              onChange={(e) => handleSlotPropertyChange('textColor', e.target.value)}
            />
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Text Size</PropertyLabel>
            <RangeInput
              min="8"
              max="32"
              value={selectedSlot.textSize}
              onChange={(e) => handleSlotPropertyChange('textSize', parseInt(e.target.value))}
            />
            <RangeValue>{selectedSlot.textSize}px</RangeValue>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>Text Position</PropertyLabel>
            <PropertySelect
              value={selectedSlot.textPosition}
              onChange={(e) => handleSlotPropertyChange('textPosition', e.target.value)}
            >
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="center">Center</option>
              <option value="overlay">Overlay</option>
            </PropertySelect>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>
              <PropertyCheckbox
                checked={selectedSlot.showFollowers}
                onChange={(e) => handleSlotPropertyChange('showFollowers', e.target.checked)}
              />
              Show Followers Count
            </PropertyLabel>
          </PropertyGroup>

          <PropertyGroup>
            <PropertyLabel>
              <PropertyCheckbox
                checked={selectedSlot.showDescription}
                onChange={(e) => handleSlotPropertyChange('showDescription', e.target.checked)}
              />
              Show Description
            </PropertyLabel>
          </PropertyGroup>
        </Section>
          </>
        ) : (
          <EmptyState>
            <p>Select a slot to edit its properties</p>
          </EmptyState>
        )}
      </PanelContent>
    </Panel>
  );
};

export default PropertiesPanel;
