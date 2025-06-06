# Advanced Grid Editor

A powerful, modern grid editor built with React, Konva, and TypeScript. This is an advanced version of the original grid editor with enhanced features, animations, and customization options.

## Features

### Core Features
- **Interactive Grid Creation**: Create grids of various sizes (3x3, 4x4, 5x5, 6x6, 8x8)
- **Drag & Drop Interface**: Intuitive drag-and-drop functionality using Konva
- **User Profile Integration**: Search and add user profiles from a JSON database
- **Real-time Editing**: Live preview of changes with instant feedback

### Advanced Features
- **Custom Styling**: Extensive customization options for each slot
  - Border radius, width, and color
  - Background colors and opacity
  - Shadow effects with blur, color, and offset
  - Text styling and positioning
- **Animations**: Smooth animations powered by Framer Motion
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple Export Formats**: Export grids as PNG, JPG, SVG, or PDF
- **Grid Management**: Save, load, duplicate, and delete grids
- **Theme Support**: Multiple built-in themes (default, dark, light)

### User Interface
- **Modern Design**: Clean, professional interface with glassmorphism effects
- **Properties Panel**: Comprehensive properties panel for detailed customization
- **Toolbar**: Quick access to tools and controls
- **Search Modal**: Advanced user search with filtering and sorting
- **Gallery View**: Visual gallery of saved grids

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and better development experience
- **Konva**: 2D canvas library for high-performance graphics
- **Styled Components**: CSS-in-JS styling with theme support
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing
- **Vite**: Fast build tool and development server

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd react-grid-editor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Creating a New Grid
1. Click on "Create New Grid" from the home page
2. Select your desired grid size (3x3, 4x4, 5x5, 6x6, or 8x8)
3. The grid editor will open with an empty grid

### Adding Profiles
1. Click on any empty slot in the grid
2. Search for users by username or description
3. Click on a user to add them to the slot
4. Customize the slot using the properties panel

### Customizing Slots
1. Select a slot by clicking on it
2. Use the properties panel on the right to customize:
   - Position and size
   - Appearance (colors, borders, shadows)
   - Text styling and positioning
   - Display options (followers, description)

### Saving and Exporting
- **Save**: Click the "Save" button to save your grid
- **Export**: Click "Export" to download as PNG
- **Gallery**: Access saved grids from the gallery

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── GridSlot.tsx    # Individual grid slot component
│   ├── UserSearchModal.tsx  # User search interface
│   ├── PropertiesPanel.tsx  # Properties editing panel
│   └── Toolbar.tsx     # Editor toolbar
├── contexts/           # React contexts for state management
│   ├── GridContext.tsx # Grid data and operations
│   ├── UserContext.tsx # User data and search
│   └── ThemeContext.tsx # Theme management
├── pages/              # Main application pages
│   ├── HomePage.tsx    # Landing page
│   ├── GridEditor.tsx  # Main editor interface
│   └── GridGallery.tsx # Saved grids gallery
├── themes/             # Theme definitions
│   └── defaultTheme.ts # Default theme configuration
├── types/              # TypeScript type definitions
│   └── index.ts        # All type definitions
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles
```

## Key Improvements Over Original

1. **Performance**: Canvas-based rendering with Konva for smooth interactions
2. **Customization**: Extensive styling options for each slot
3. **User Experience**: Modern UI with animations and responsive design
4. **Functionality**: Advanced search, filtering, and grid management
5. **Maintainability**: TypeScript, modular architecture, and clean code
6. **Scalability**: Context-based state management and component reusability

## Future Enhancements

- **Templates**: Pre-designed grid templates
- **Collaboration**: Real-time collaborative editing
- **Cloud Storage**: Save grids to cloud storage
- **Advanced Animations**: Slot entrance/exit animations
- **Batch Operations**: Bulk editing of multiple slots
- **Custom Themes**: User-created themes
- **Plugin System**: Extensible plugin architecture

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.