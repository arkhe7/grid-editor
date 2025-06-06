import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components';
import { GridProvider } from './contexts/GridContext';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider as CustomThemeProvider } from './contexts/ThemeContext';
// import { TierListProvider } from './contexts/TierListContext'; // TierListProvider kaldırıldı
import HomePage from './pages/HomePage';
import GridEditor from './pages/GridEditor';
import GridGallery from './pages/GridGallery';
// import TierListEditor from './pages/TierListEditor'; // TierListEditor kaldırıldı
import { defaultTheme } from './themes/defaultTheme';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.background};
  color: ${props => props.theme.text};
`;

const App: React.FC = () => {
  return (
    <CustomThemeProvider>
      <ThemeProvider theme={defaultTheme}>
        <UserProvider>
          <GridProvider>
            <AppContainer>
              <Router>
                {/* <TierListProvider> */} {/* TierListProvider kaldırıldı */}
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/editor/:gridId?" element={<GridEditor />} />
                    <Route path="/gallery" element={<GridGallery />} />
                    {/* <Route path="/tier-list-editor" element={<TierListEditor />} /> */} {/* TierListEditor route'ları kaldırıldı */}
                    {/* <Route path="/tier-list-editor/:tierListId" element={<TierListEditor />} /> */}
                  </Routes>
                {/* </TierListProvider> */}
              </Router>
            </AppContainer>
          </GridProvider>
        </UserProvider>
      </ThemeProvider>
    </CustomThemeProvider>
  );
};

export default App;
