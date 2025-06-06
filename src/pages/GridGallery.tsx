import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiEdit, FiTrash2, FiCopy, FiDownload, FiArrowLeft } from 'react-icons/fi';
import { useGrid } from '../contexts/GridContext';

const Container = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: ${props => props.theme.background};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const BackButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 15px;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${props => props.theme.text};
  margin: 0;
`;

const GridsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const GridCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.theme.primary};
  }
`;

const GridPreview = styled.div`
  height: 200px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const PreviewGrid = styled.div<{ size: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.size}, 1fr);
  gap: 4px;
  width: 80%;
  height: 80%;
`;

const PreviewSlot = styled.div<{ hasUser: boolean }>`
  background: ${props => props.hasUser 
    ? 'linear-gradient(135deg, #2ed573, #5352ed)' 
    : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const GridName = styled.h3`
  font-size: 1.2rem;
  color: ${props => props.theme.text};
  margin-bottom: 0.5rem;
`;

const GridInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: ${props => props.theme.textSecondary};
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled(motion.button)`
  padding: 0.5rem;
  background: transparent;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
  }

  &.danger:hover {
    background: ${props => props.theme.error};
    border-color: ${props => props.theme.error};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${props => props.theme.textSecondary};
`;

const EmptyTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const GridGallery: React.FC = () => {
  const navigate = useNavigate();
  const { savedGrids, deleteGrid, duplicateGrid } = useGrid();

  const handleEdit = (gridId: string) => {
    navigate(`/editor/${gridId}`);
  };

  const handleDelete = (gridId: string) => {
    if (window.confirm('Are you sure you want to delete this grid?')) {
      deleteGrid(gridId);
    }
  };

  const handleDuplicate = (gridId: string) => {
    const duplicated = duplicateGrid(gridId);
    if (duplicated) {
      navigate(`/editor/${duplicated.id}`);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFilledSlotsCount = (grid: any) => {
    return grid.slots.filter((slot: any) => slot.user !== null).length;
  };

  if (savedGrids.length === 0) {
    return (
      <Container>
        <Header>
          <BackButton
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft />
            Back to Home
          </BackButton>
          <Title>Grid Gallery</Title>
        </Header>
        
        <EmptyState>
          <EmptyTitle>No Grids Found</EmptyTitle>
          <p>You haven't created any grids yet. Start by creating your first grid!</p>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton
          onClick={() => navigate('/')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft />
          Back to Home
        </BackButton>
        <Title>Grid Gallery ({savedGrids.length})</Title>
      </Header>

      <GridsContainer>
        {savedGrids.map((grid, index) => (
          <GridCard
            key={grid.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <GridPreview>
              <PreviewGrid size={grid.size}>
                {grid.slots.map((slot, slotIndex) => (
                  <PreviewSlot 
                    key={slotIndex} 
                    hasUser={slot.user !== null}
                  />
                ))}
              </PreviewGrid>
            </GridPreview>
            
            <CardContent>
              <GridName>{grid.name}</GridName>
              <GridInfo>
                <span>{grid.size}×{grid.size} • {getFilledSlotsCount(grid)}/{grid.slots.length} filled</span>
                <span>{formatDate(grid.updatedAt)}</span>
              </GridInfo>
              
              <Actions>
                <ActionButton
                  onClick={() => handleEdit(grid.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Edit Grid"
                >
                  <FiEdit />
                </ActionButton>
                
                <ActionButton
                  onClick={() => handleDuplicate(grid.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Duplicate Grid"
                >
                  <FiCopy />
                </ActionButton>
                
                <ActionButton
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Export Grid"
                >
                  <FiDownload />
                </ActionButton>
                
                <ActionButton
                  className="danger"
                  onClick={() => handleDelete(grid.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Delete Grid"
                >
                  <FiTrash2 />
                </ActionButton>
              </Actions>
            </CardContent>
          </GridCard>
        ))}
      </GridsContainer>
    </Container>
  );
};

export default GridGallery;