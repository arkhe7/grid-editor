import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { GridConfig, GridSlot, User, GridCategory } from '../types'; // GridCategory eklendi
// Simple UUID generator instead of uuid package
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface GridContextType {
  currentGrid: GridConfig | null;
  savedGrids: GridConfig[];
  setCurrentGrid: (grid: GridConfig | null) => void;
  createNewGrid: (name?: string, templateType?: 'default' | 'tierList') => GridConfig; // İmza güncellendi
  saveGrid: (grid: GridConfig) => void;
  loadGrid: (gridId: string) => GridConfig | null;
  deleteGrid: (gridId: string) => void;
  updateSlot: (slotId: string, updates: Partial<GridSlot>) => void;
  addUserToSlot: (slotId: string, user: User) => void;
  removeUserFromSlot: (slotId: string) => void;
  clearAllSlots: () => void;
  duplicateGrid: (gridId: string) => GridConfig | null;
  updateGridBackgroundColor: (color: string) => void; // Yeni fonksiyon eklendi
}

const GridContext = createContext<GridContextType | undefined>(undefined);

const createDefaultSlot = (x: number, y: number, slotSize: number): GridSlot => ({
  id: generateId(),
  user: null,
  x: 0, // Will be set later
  y: 0, // Will be set later
  width: slotSize,
  height: slotSize,
  rotation: 0,
  scale: 1,
  borderRadius: 15, // Değişiklik: borderRadius 5'ten 15'e çıkarıldı
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
  backgroundColor: 'rgba(255, 255, 255, 0.05)', // Daha soluk bir arka plan
  opacity: 1,
  shadowBlur: 0,
  shadowColor: 'rgba(0, 0, 0, 0.5)',
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  textColor: '#ffffff',
  textSize: 8, // Değişiklik: textSize 10'dan 8'e düşürüldü
  textPosition: 'bottom',
  showFollowers: false,
  showDescription: false
});

interface GridProviderProps {
  children: ReactNode;
}

export const GridProvider: React.FC<GridProviderProps> = ({ children }) => {
  const [currentGrid, setCurrentGrid] = useState<GridConfig | null>(null);
  const [savedGrids, setSavedGrids] = useState<GridConfig[]>([]);

  // Load saved grids from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedGrids');
    if (saved) {
      try {
        setSavedGrids(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading saved grids:', error);
      }
    }
  }, []);

  // Save grids to localStorage whenever savedGrids changes
  useEffect(() => {
    localStorage.setItem('savedGrids', JSON.stringify(savedGrids));
  }, [savedGrids]);

  const createNewGrid = useCallback((name?: string, templateType: 'default' | 'tierList' = 'default'): GridConfig => { // İmza güncellendi
    const slots: GridSlot[] = [];
    const categories: GridCategory[] = []; // categories eklendi
    const canvasWidth = 1920; // canvasWidth ve Height yukarı taşındı
    const canvasHeight = 1080;
    let gridName = name; // gridName ve totalSlots yukarı taşındı
    let totalSlots = 0;

    if (templateType === 'tierList') {
      gridName = name || 'New Tier List';
      const numCategories = 4;
      const topPadding = 30; // Canvas üstünden kategoriye kadar olan boşluk
      const categoryHeaderHeight = 60; // Kategori başlığı ve ikon için ayrılan yükseklik
      const categorySpacing = 10; // Kategoriler arası dikey boşluk
      
      // Toplam kullanılabilir yükseklik (başlıklar ve aralıklar çıkarıldıktan sonra)
      const totalAvailableCategoryContentHeight = canvasHeight - topPadding - (numCategories * categoryHeaderHeight) - ((numCategories -1) * categorySpacing);
      const categoryContentHeightPerCategory = totalAvailableCategoryContentHeight / numCategories;

      const categoryTitleFontSize = 28; // Biraz küçültüldü
      const categoryLeftPadding = 30; // Kategori başlığı için sol boşluk
      const categoryIconSize = 30; // İkon boyutu (varsa)
      const categoryTitleXOffset = categoryLeftPadding + categoryIconSize + 15; // Başlık X konumu

      const defaultCategoryTitles = ["BERA CHAIN", "ABSTRACT CHAIN", "MONAD CHAIN", "OTHER CHAINS"];
      const defaultCategoryColors = [
        'rgba(255, 140, 0, 0.3)', // DarkOrange
        'rgba(50, 205, 50, 0.3)',  // LimeGreen
        'rgba(138, 43, 226, 0.3)', // BlueViolet
        'rgba(119, 136, 153, 0.3)'  // LightSlateGray
      ];

      for (let i = 0; i < numCategories; i++) {
        const categoryId = generateId();
        const currentCategoryYPosition = topPadding + i * (categoryHeaderHeight + categoryContentHeightPerCategory + categorySpacing);
        categories.push({
          id: categoryId,
          title: defaultCategoryTitles[i] || `Category ${i + 1}`,
          yPosition: currentCategoryYPosition,
          height: categoryHeaderHeight + categoryContentHeightPerCategory, // Başlık + içerik yüksekliği
          backgroundColor: defaultCategoryColors[i] || 'rgba(128, 128, 128, 0.2)',
          textColor: '#ffffff',
          fontSize: categoryTitleFontSize,
          // iconUrl: placeholder // İkon eklenebilir
        });

        // Slotları kategori içine yerleştirme
        const slotSize = 100; // Slotlar 100x100 kare olacak
        const slotSpacing = 15;
        // Kategori başlığının solundaki boşluk + başlık genişliği (tahmini) + slotlar için başlangıç boşluğu
        const slotsStartX = categoryTitleXOffset + (defaultCategoryTitles[i].length * categoryTitleFontSize * 0.5) + 50; 
        const slotsAvailableWidth = canvasWidth - slotsStartX - categoryLeftPadding; // Sağ kenar boşluğu da categoryLeftPadding kadar
        const slotsPerRow = Math.floor(slotsAvailableWidth / (slotSize + slotSpacing));
        
        const categoryContentStartY = currentCategoryYPosition + categoryHeaderHeight;

        // Örnek olarak her kategoriye 7 slot ekleyelim (veya sığdığı kadar)
        const numSlotsToCreate = Math.min(7, slotsPerRow); 
        totalSlots += numSlotsToCreate;

        for (let j = 0; j < numSlotsToCreate; j++) {
          const slotX = slotsStartX + j * (slotSize + slotSpacing);
          // Slotları kategori içerik alanında dikey olarak ortala
          const slotY = categoryContentStartY + (categoryContentHeightPerCategory - slotSize) / 2;

          if (slotX + slotSize <= canvasWidth - categoryLeftPadding) { // Canvas sınırlarını kontrol et
            const slot = createDefaultSlot(slotX, slotY, slotSize);
            slot.x = slotX;
            slot.y = slotY; 
            slot.width = slotSize; // Kare slot
            slot.height = slotSize; // Kare slot
            slot.categoryId = categoryId;
            slots.push(slot);
          }
        }
      }
    } else { // Default grid (önceki 4x2 mantığı)
      gridName = name || `Default Grid`; // İsim güncellendi
      const numCols = 6;
      const numRows = 2;
      totalSlots = numCols * numRows;

      const innerPadding = 80; // Değişiklik: innerPadding 40'tan 80'e çıkarıldı
      const outerMarginX = 150; 
      const outerMarginY = 200;

      const effectiveCanvasWidth = canvasWidth - (2 * outerMarginX);
      const effectiveCanvasHeight = canvasHeight - (2 * outerMarginY);
      
      const availableWidthForSlots = effectiveCanvasWidth - (innerPadding * (numCols - 1));
      const availableHeightForSlots = effectiveCanvasHeight - (innerPadding * (numRows - 1));
      
      const slotWidthBasedOnCols = availableWidthForSlots / numCols;
      const slotHeightBasedOnRows = availableHeightForSlots / numRows;
      
      const actualSlotSide = Math.min(slotWidthBasedOnCols, slotHeightBasedOnRows);

      const gridContentWidth = numCols * actualSlotSide + (numCols - 1) * innerPadding;
      const gridContentHeight = numRows * actualSlotSide + (numRows - 1) * innerPadding;

      const startX = outerMarginX + (effectiveCanvasWidth - gridContentWidth) / 2;
      const startY = outerMarginY + (effectiveCanvasHeight - gridContentHeight) / 2;

      for (let r = 0; r < numRows; r++) {
        for (let c = 0; c < numCols; c++) {
          const x = startX + c * (actualSlotSide + innerPadding);
          const y = startY + r * (actualSlotSide + innerPadding);
          
          const slot = createDefaultSlot(x, y, actualSlotSide);
          slot.x = x;
          slot.y = y;
          // createDefaultSlot zaten width ve height'ı actualSlotSide olarak ayarlar.
          // Bu yüzden burada tekrar slot.width ve slot.height atamasına gerek yok.
          slots.push(slot);
        }
      }
    }
    // const slots: GridSlot[] = []; // Bu satır yukarı taşındı -> Bu yorum ve altındaki blok gereksiz, kaldırılacak.
    // const numCols = 4; 
    // const numRows = 2;
    // const totalSlots = numCols * numRows;

    // const canvasWidth = 1920;
    // const canvasHeight = 1080;
    
    // const padding = 40; 
    // const availableWidth = canvasWidth - (padding * (numCols + 1));
    // const availableHeight = canvasHeight - (padding * (numRows + 1));
    
    // const slotWidth = availableWidth / numCols;
    // const slotHeight = availableHeight / numRows;

    // for (let r = 0; r < numRows; r++) {
    //   for (let c = 0; c < numCols; c++) {
    //     const x = padding + c * (slotWidth + padding);
    //     const y = padding + r * (slotHeight + padding);
    //     const slot = createDefaultSlot(x, y, Math.min(slotWidth, slotHeight)); 
    //     slot.x = x;
    //     slot.y = y;
    //     slot.width = slotWidth;
    //     slot.height = slotHeight;
    //     slots.push(slot);
    //   }
    // }

    const newGrid: GridConfig = {
      id: generateId(),
      name: gridName, 
      size: totalSlots, 
      width: canvasWidth,
      height: canvasHeight,
      backgroundColor: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      slots,
      categories: templateType === 'tierList' ? categories : undefined, // categories eklendi
      templateType, // templateType eklendi
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return newGrid;
  }, []);

  const saveGrid = useCallback((grid: GridConfig) => {
    const updatedGrid = {
      ...grid,
      updatedAt: new Date().toISOString()
    };

    setSavedGrids(prev => {
      const existing = prev.find(g => g.id === grid.id);
      if (existing) {
        return prev.map(g => g.id === grid.id ? updatedGrid : g);
      } else {
        return [...prev, updatedGrid];
      }
    });

    if (currentGrid?.id === grid.id) {
      setCurrentGrid(updatedGrid);
    }
  }, [currentGrid]);

  const loadGrid = useCallback((gridId: string): GridConfig | null => {
    const grid = savedGrids.find(g => g.id === gridId);
    if (grid) {
      setCurrentGrid(grid); // Dikkat: Bu, GridEditor'daki useEffect ile döngüye neden olabilir.
                           // GridEditor'daki useEffect'in bağımlılıklarını kontrol et.
      return grid;
    }
    return null;
  }, [savedGrids]);

  const deleteGrid = useCallback((gridId: string) => {
    setSavedGrids(prev => prev.filter(g => g.id !== gridId));
    if (currentGrid?.id === gridId) {
      setCurrentGrid(null);
    }
  }, [currentGrid]);

  const updateSlot = useCallback((slotId: string, updates: Partial<GridSlot>) => {
    if (!currentGrid) return;

    const updatedGrid = {
      ...currentGrid,
      slots: currentGrid.slots.map(slot =>
        slot.id === slotId ? { ...slot, ...updates } : slot
      ),
      updatedAt: new Date().toISOString()
    };

    setCurrentGrid(updatedGrid);
  }, [currentGrid]);

  const addUserToSlot = useCallback((slotId: string, user: User) => {
    if (!currentGrid) return;
    const updatedGrid = {
      ...currentGrid,
      slots: currentGrid.slots.map(slot =>
        slot.id === slotId ? { ...slot, user } : slot
      ),
      updatedAt: new Date().toISOString()
    };
    setCurrentGrid(updatedGrid);
  }, [currentGrid]);

  const removeUserFromSlot = useCallback((slotId: string) => {
    if (!currentGrid) return;
    const updatedGrid = {
      ...currentGrid,
      slots: currentGrid.slots.map(slot =>
        slot.id === slotId ? { ...slot, user: null } : slot
      ),
      updatedAt: new Date().toISOString()
    };
    setCurrentGrid(updatedGrid);
  }, [currentGrid]);

  const clearAllSlots = useCallback(() => {
    if (!currentGrid) return;

    const updatedGrid = {
      ...currentGrid,
      slots: currentGrid.slots.map(slot => ({ ...slot, user: null })),
      updatedAt: new Date().toISOString()
    };

    setCurrentGrid(updatedGrid);
  }, [currentGrid]);

  const duplicateGrid = useCallback((gridId: string): GridConfig | null => {
    const originalGrid = savedGrids.find(g => g.id === gridId);
    if (!originalGrid) return null;

    const duplicatedGrid: GridConfig = {
      ...originalGrid,
      id: generateId(),
      name: `${originalGrid.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      slots: originalGrid.slots.map(slot => ({
        ...slot,
        id: generateId()
      }))
    };

    setSavedGrids(prev => [...prev, duplicatedGrid]);
    return duplicatedGrid;
  }, [savedGrids]);

  const updateGridBackgroundColor = useCallback((color: string) => {
    if (!currentGrid) return;
    setCurrentGrid(prev => {
      if (!prev) return null;
      const updatedGrid = { 
        ...prev, 
        backgroundColor: color, 
        updatedAt: new Date().toISOString() 
      };
      // Otomatik kaydetme istenirse burada saveGrid çağrılabilir
      // saveGrid(updatedGrid); 
      return updatedGrid;
    });
  }, [currentGrid, setCurrentGrid /*, saveGrid */]);

  return (
    <GridContext.Provider value={{
      currentGrid,
      savedGrids,
      setCurrentGrid,
      createNewGrid,
      saveGrid,
      loadGrid,
      deleteGrid,
      updateSlot,
      addUserToSlot,
      removeUserFromSlot,
      clearAllSlots,
      duplicateGrid,
      updateGridBackgroundColor // Yeni fonksiyon context değerine eklendi
    }}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (context === undefined) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};
