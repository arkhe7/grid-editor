import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Stage, Layer, Rect, Text } from 'react-konva'; // Text eklendi
import { motion } from 'framer-motion';
import { FiSave, FiDownload, FiSettings, FiUsers, FiArrowLeft, FiTrash2 } from 'react-icons/fi';
import { useGrid } from '../contexts/GridContext';
import { useUsers } from '../contexts/UserContext';
import GridSlotComponent from '../components/GridSlot';
import UserSearchModal from '../components/UserSearchModal';
import PropertiesPanel from '../components/PropertiesPanel';
import Toolbar from '../components/Toolbar';
import { GridSlot } from '../types';

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.background};
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${props => props.theme.surface};
  border-bottom: 1px solid ${props => props.theme.border};
  backdrop-filter: blur(10px);
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
  }
`;

const GridTitle = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.text};
  margin: 0;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ActionButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.primary};
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }

  &.secondary {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.text};
    border: 1px solid ${props => props.theme.border};
  }

  &.danger {
    background: ${props => props.theme.error};
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
  width: 100%;
  height: calc(100vh - 140px);
`;

const SidePanel = styled(motion.div)<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '350px' : '0'};
  background: ${props => props.theme.surface};
  border-left: 1px solid ${props => props.theme.border};
  transition: width 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const GridEditor: React.FC = () => {
  const { gridId } = useParams<{ gridId: string }>();
  const navigate = useNavigate();
  const stageRef = useRef<any>(null);
  
  const { currentGrid, setCurrentGrid, loadGrid, saveGrid, createNewGrid } = useGrid();
  const { users } = useUsers();
  
  const [selectedSlot, setSelectedSlot] = useState<GridSlot | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState(true);
  const [currentSlotForUser, setCurrentSlotForUser] = useState<string | null>(null);

  useEffect(() => {
    if (gridId) {
      const grid = loadGrid(gridId);
      if (!grid) {
        // Grid not found, create a new one with the ID from URL
        // URL'den gelen ID ile yeni bir 'default' grid oluştur.
        // Eğer templateType bilgisi de URL'den veya başka bir yerden geliyorsa, o da burada değerlendirilebilir.
        // Şimdilik, ID var ama grid yoksa, default bir grid oluşturuyoruz.
        const newGrid = createNewGrid(`Grid ${gridId}`, 'default'); 
        setCurrentGrid({ ...newGrid, id: gridId }); // ID'yi koru
      }
      // Eğer grid bulunduysa, loadGrid zaten setCurrentGrid'i çağırıyor.
    } else {
      // Create new default grid if no ID provided
      const newGrid = createNewGrid('New Default Grid', 'default');
      setCurrentGrid(newGrid);
    }
  }, [gridId, loadGrid, createNewGrid, setCurrentGrid]);

  const handleSaveGrid = () => {
    if (currentGrid) {
      saveGrid(currentGrid);
      // Show success message or toast
    }
  };

  const handleExportGrid = () => {
    if (!stageRef.current || !currentGrid) return;
    
    const stage = stageRef.current;
    
    // Export the stage as PNG with full resolution
    const uri = stage.toDataURL({
      mimeType: 'image/png',
      quality: 1,
      pixelRatio: 1,
      width: 1920,
      height: 1080
    });
    
    const link = document.createElement('a');
    link.download = `${currentGrid.name || 'grid'}-1920x1080.png`;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSlotClick = (slot: GridSlot) => {
    console.log('🎯 Slot clicked:', slot.id, 'has user:', !!slot.user);
    setSelectedSlot(slot);
    if (!slot.user) {
      console.log('📝 Setting current slot for user:', slot.id);
      setCurrentSlotForUser(slot.id);
      console.log('🔓 Opening user modal...');
      setShowUserModal(true);
    } else {
      console.log('👤 Slot already has user:', slot.user.screen_name);
    }
  };

  const handleSlotDoubleClick = (slot: GridSlot) => {
    if (slot.user) {
      setCurrentSlotForUser(slot.id);
      setShowUserModal(true);
    }
  };

  const handleUserSelect = (user: any) => {
    console.log('👤 User selected:', user.screen_name, 'for slot:', currentSlotForUser);
    if (currentSlotForUser && currentGrid) {
      const updatedGrid = {
        ...currentGrid,
        slots: currentGrid.slots.map(slot =>
          slot.id === currentSlotForUser ? { ...slot, user } : slot
        )
      };
      setCurrentGrid(updatedGrid);
      setShowUserModal(false);
      setCurrentSlotForUser(null);
      console.log('✅ User added to grid successfully');
    } else {
      console.error('❌ Missing currentSlotForUser or currentGrid');
    }
  };

  const handleSlotUpdate = (slotId: string, updates: Partial<GridSlot>) => {
    if (!currentGrid) return;
    
    const updatedGrid = {
      ...currentGrid,
      slots: currentGrid.slots.map(slot =>
        slot.id === slotId ? { ...slot, ...updates } : slot
      )
    };
    setCurrentGrid(updatedGrid);
  };

  const handleRemoveUser = (slotId: string) => {
    handleSlotUpdate(slotId, { user: null });
  };

  const handleClearAll = () => {
    if (!currentGrid) return;
    
    if (window.confirm('Are you sure you want to clear all profiles?')) {
      const updatedGrid = {
        ...currentGrid,
        slots: currentGrid.slots.map(slot => ({ ...slot, user: null }))
      };
      setCurrentGrid(updatedGrid);
    }
  };

  if (!currentGrid) {
    return (
      <Container>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          Loading...
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <BackButton
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            Back
          </BackButton>
          <GridTitle>{currentGrid.name}</GridTitle>
        </HeaderLeft>
        
        <HeaderRight>
          <ActionButton
            className="secondary"
            onClick={() => setShowPropertiesPanel(!showPropertiesPanel)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSettings />
            Properties
          </ActionButton>
          
          <ActionButton
            className="danger"
            onClick={handleClearAll}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiTrash2 />
            Clear All
          </ActionButton>
          
          <ActionButton
            className="secondary"
            onClick={handleExportGrid}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiDownload />
            Export
          </ActionButton>
          
          <ActionButton
            onClick={handleSaveGrid}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiSave />
            Save
          </ActionButton>
        </HeaderRight>
      </Header>

      <Toolbar />

      <MainContent>
        <CanvasContainer>
          <div style={{ position: 'relative' }}>
            <Stage
              ref={stageRef}
              width={1152}
              height={648}
              scaleX={0.6}
              scaleY={0.6}
            >
              <Layer>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={currentGrid.width}
                  height={currentGrid.height}
                  fill={currentGrid.backgroundColor} // TODO: Bu string gradyan ise Konva Rect fill bunu doğrudan desteklemez.
                                                    // Konva için fillLinearGradient... özellikleri kullanılmalı veya düz renk olmalı.
                                                    // Şimdilik string bırakıyorum, GridContext'teki backgroundColor'a göre davranacak.
                />

                {/* Kategoriler (eğer varsa) */}
                {currentGrid.categories?.map(category => (
                  <React.Fragment key={`category-group-${category.id}`}>
                    <Rect
                      x={0} // Kategori tüm genişliği kaplasın
                      y={category.yPosition}
                      width={currentGrid.width} // Grid genişliği kadar
                      height={category.height}
                      fill={category.backgroundColor || 'rgba(0,0,0,0.1)'} // Kategori arka planı
                      listening={false} // Tıklama olaylarını almasın
                    />
                    <Text
                      text={category.title}
                      x={20} // Sol kenardan biraz içeride
                      y={category.yPosition + 20} // Kategori üstünden biraz aşağıda
                      fontSize={category.fontSize || 32}
                      fill={category.textColor || '#ffffff'}
                      fontStyle="bold"
                      listening={false}
                    />
                  </React.Fragment>
                ))}
                
                {/* Grid slots */}
                {currentGrid.slots.map(slot => (
                  <GridSlotComponent
                    key={slot.id}
                    slot={slot}
                    isSelected={selectedSlot?.id === slot.id}
                    onClick={() => handleSlotClick(slot)}
                    onDoubleClick={() => handleSlotDoubleClick(slot)}
                    onUpdate={(updates) => handleSlotUpdate(slot.id, updates)}
                    onRemoveUser={() => handleRemoveUser(slot.id)}
                  />
                ))}
              </Layer>
            </Stage>
            
            {/* HTML Click Overlays for reliable clicking */}
            {/* {currentGrid.slots.map(slot => (
              <div
                key={`overlay-${slot.id}`}
                style={{
                  position: 'absolute',
                  left: slot.x * 0.6,
                  top: slot.y * 0.6,
                  width: slot.width * 0.6,
                  height: (slot.height + 40) * 0.6, // Add Profile text'i de kapsasın diye
                  cursor: 'pointer',
                  zIndex: 10,
                  pointerEvents: 'auto',
                  backgroundColor: 'rgba(0, 255, 0, 0.1)', // Debug: slight green overlay
                  border: '2px solid rgba(0, 255, 0, 0.3)', // Debug: green border
                  borderRadius: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 255, 0, 0.1)';
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️ HTML Overlay clicked for slot:', slot.id);
                  handleSlotClick(slot);
                }}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log('🖱️🖱️ HTML Overlay double-clicked for slot:', slot.id);
                  handleSlotDoubleClick(slot);
                }}
                title={slot.user ? `@${slot.user.screen_name}` : 'Click to add profile'}
              />
            ))} */}
          </div>
        </CanvasContainer>

        <SidePanel isOpen={showPropertiesPanel}>
          <PropertiesPanel
            selectedSlot={selectedSlot}
            onSlotUpdate={(updates) => selectedSlot && handleSlotUpdate(selectedSlot.id, updates)}
          />
        </SidePanel>
      </MainContent>

      {showUserModal && (
        <UserSearchModal
          onUserSelect={handleUserSelect}
          onClose={() => {
            console.log('🔒 Closing user modal');
            setShowUserModal(false);
            setCurrentSlotForUser(null);
          }}
        />
      )}
    </Container>
  );
};

export default GridEditor;
