import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiGrid, FiPlus, FiFolder, FiSettings, FiList } from 'react-icons/fi'; // FiList eklendi
import { useGrid } from '../contexts/GridContext';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${props => props.theme.background};
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-align: center;
  background: linear-gradient(135deg, #2ed573, #5352ed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-bottom: 4rem;
  max-width: 600px;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  width: 100%;
`;

const ActionCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    border-color: ${props => props.theme.primary};
  }
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.primary}, ${props => props.theme.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: white;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.text};
`;

const CardDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  line-height: 1.6;
`;

const SizeSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
`;

const SizeButton = styled(motion.button)`
  padding: 0.5rem 1rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: 10px;
  background: transparent;
  color: ${props => props.theme.text};
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${props => props.theme.primary};
    border-color: ${props => props.theme.primary};
  }
`;

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { createNewGrid, savedGrids, setCurrentGrid } = useGrid();

  const handleCreateDefaultGrid = (size: number) => {
    // Boyut bilgisi artık createNewGrid içinde yönetiliyor,
    // ama isim için kullanabiliriz veya templateType'a göre farklı isimler verebiliriz.
    // Şimdilik 'default' templateType için size bilgisini isimde kullanmıyoruz.
    // createNewGrid fonksiyonu 'default' için zaten '4x2 Grid' gibi bir isim atıyor.
    // Eğer farklı boyutlar için farklı varsayılan gridler isteniyorsa,
    // createNewGrid fonksiyonu daha da geliştirilebilir.
    const newGrid = createNewGrid(`New ${size}x${size} Grid (Default)`, 'default'); 
    setCurrentGrid(newGrid);
    navigate(`/editor/${newGrid.id}`);
  };

  const handleCreateTierList = () => {
    const newGrid = createNewGrid('New Tier List', 'tierList');
    setCurrentGrid(newGrid);
    navigate(`/editor/${newGrid.id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Container>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Title variants={itemVariants}>
          Advanced Grid Editor
        </Title>
        
        <Subtitle variants={itemVariants}>
          Create stunning profile grids with advanced customization, animations, and export options
        </Subtitle>

        <GridContainer>
          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconWrapper>
              <FiPlus />
            </IconWrapper>
            <CardTitle>Create New Grid</CardTitle>
            <CardDescription>
              Start with a fresh grid and customize it to your liking
            </CardDescription>
            <SizeSelector>
              {/* Şimdilik sadece varsayılan boyutta bir grid oluşturma butonu bırakalım,
                  boyut seçimi createNewGrid içinde templateType'a göre yönetiliyor.
                  Eğer farklı default boyutlar istenirse bu butonlar tekrar düzenlenebilir.
                  Örnek olarak tek bir "Default Grid" butonu: */}
              <SizeButton
                onClick={() => handleCreateDefaultGrid(4)} // Örnek olarak 4x4 (veya context'teki default)
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Default Grid
              </SizeButton>
            </SizeSelector>
          </ActionCard>

          {/* Yeni Tier List Kartı */}
          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateTierList} // Doğrudan editor'e yönlendir
          >
            <IconWrapper>
              <FiList />
            </IconWrapper>
            <CardTitle>Liste Oluştur</CardTitle>
            <CardDescription>
              Kategorilere ayrılmış öğe listeleri (tier list) oluşturun
            </CardDescription>
          </ActionCard>

          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/gallery')}
          >
            <IconWrapper>
              <FiFolder />
            </IconWrapper>
            <CardTitle>Saved Grids</CardTitle>
            <CardDescription>
              Access your previously saved grids ({savedGrids.length} saved)
            </CardDescription>
          </ActionCard>

          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconWrapper>
              <FiGrid />
            </IconWrapper>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              Choose from pre-designed templates to get started quickly
            </CardDescription>
          </ActionCard>

          <ActionCard
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IconWrapper>
              <FiSettings />
            </IconWrapper>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Customize themes, export settings, and application preferences
            </CardDescription>
          </ActionCard>
        </GridContainer>
      </motion.div>
    </Container>
  );
};

export default HomePage;
