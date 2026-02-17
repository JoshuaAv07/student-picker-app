# 🎓 Student Picker - React TypeScript App

A professional, component-based student participation randomizer with clean architecture and separated concerns.

## 📁 Project Structure

```
student-picker-app/
├── public/
│   └── index.html              # HTML template
├── src/
│   ├── components/             # React components
│   │   ├── ActionButtons.tsx   # Pick and Reset buttons
│   │   ├── Confetti.tsx        # Confetti animation overlay
│   │   ├── FileUpload.tsx      # File upload interface
│   │   ├── Header.tsx          # App header and title
│   │   ├── Instructions.tsx    # Usage instructions
│   │   ├── ProgressBar.tsx     # Progress tracking bar
│   │   ├── Stats.tsx           # Statistics cards
│   │   └── WinnerDisplay.tsx   # Selected student display
│   ├── styles/                 # CSS modules
│   │   ├── global.css          # Global styles and fonts
│   │   ├── animations.css      # Keyframe animations
│   │   ├── App.css             # Main app container styles
│   │   ├── ActionButtons.css   # Button styles
│   │   ├── FileUpload.css      # Upload component styles
│   │   ├── Header.css          # Header styles
│   │   ├── Instructions.css    # Instructions styles
│   │   ├── ProgressBar.css     # Progress bar styles
│   │   ├── Stats.css           # Stats cards styles
│   │   └── WinnerDisplay.css   # Winner display styles
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Interface definitions
│   ├── utils/                  # Utility functions
│   │   └── helpers.ts          # File parsing and storage helpers
│   ├── App.tsx                 # Main application component
│   └── index.tsx               # Application entry point
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🏗️ Architecture Overview

### Component Structure

The app follows a **modular component architecture** with clear separation of concerns:

#### 1. **Presentational Components** (UI-focused)
- `Header` - Displays app title and tagline
- `FileUpload` - Handles file selection UI
- `Stats` - Shows statistics cards
- `ProgressBar` - Displays progress visualization
- `WinnerDisplay` - Shows selected student
- `ActionButtons` - Pick and reset controls
- `Instructions` - Usage guide
- `Confetti` - Celebration animation

#### 2. **Container Component** (Logic-focused)
- `App` - Main container managing state and orchestrating child components

### Style Organization

Each component has its own CSS file, promoting:
- **Encapsulation**: Styles are scoped to specific components
- **Maintainability**: Easy to find and modify component-specific styles
- **Reusability**: Components can be moved between projects

#### Style Files:
- `global.css` - Base styles, fonts, and reset
- `animations.css` - Reusable animation keyframes
- `[Component].css` - Component-specific styles

### Utilities

Helper functions are separated into utility modules:
- **File Parsing**: `parseCSV()`, `parseTXT()`
- **Storage Management**: `loadFromStorage()`, `saveToStorage()`, `clearFromStorage()`

### Type Definitions

TypeScript interfaces ensure type safety:
- `Student` - Student data structure
- `StudentPickerState` - Application state shape

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm start
```

3. **Build for production:**
```bash
npm run build
```

## 🎨 Design System

### Color Palette
- **Primary**: `#800000` (Maroon)
- **Backgrounds**: `#fffbf0`, `#fff5e6` (Cream/Amber tones)
- **Accents**: `#fed7aa`, `#d4af37` (Gold tones)

### Typography
- **Headers**: Lora (Serif)
- **Body**: Merriweather (Serif)

### Spacing System
- Uses consistent rem-based spacing
- Responsive breakpoint at 768px

## 📦 Component Props

### FileUpload
```typescript
interface FileUploadProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadedFileName: string;
}
```

### Stats
```typescript
interface StatsProps {
  totalStudents: number;
  remainingStudents: number;
  selectedCount: number;
}
```

### ProgressBar
```typescript
interface ProgressBarProps {
  progress: number; // 0-100
}
```

### WinnerDisplay
```typescript
interface WinnerDisplayProps {
  selectedStudent: string;
  isSpinning: boolean;
  allPicked: boolean;
}
```

### ActionButtons
```typescript
interface ActionButtonsProps {
  onPickStudent: () => void;
  onReset: () => void;
  isSpinning: boolean;
  hasStudents: boolean;
}
```

### Confetti
```typescript
interface ConfettiProps {
  show: boolean;
}
```

## 🔄 State Management

State is managed in the `App` component using React hooks:

- `allStudents` - Complete student list
- `remainingStudents` - Students not yet selected
- `selectedStudent` - Current/last selected student
- `isSpinning` - Animation state
- `uploadedFileName` - Name of uploaded file
- `showConfetti` - Confetti animation trigger

### Persistence
- Uses `localStorage` for data persistence
- Survives page refreshes
- Automatically saves/loads state

## 🎯 Key Features

1. **Component Isolation**: Each component is self-contained and reusable
2. **Type Safety**: Full TypeScript support with interfaces
3. **Separation of Concerns**: Logic, UI, and styles are separated
4. **Responsive Design**: Mobile-friendly with CSS media queries
5. **Accessibility**: Semantic HTML and proper ARIA attributes
6. **Performance**: Optimized animations using CSS only
7. **Maintainability**: Clear file structure and naming conventions

## 🛠️ Development Guidelines

### Adding a New Component

1. Create component file in `src/components/`
2. Create corresponding CSS file in `src/styles/`
3. Define TypeScript interfaces if needed
4. Import and use in parent component

### Modifying Styles

- Global changes → `global.css`
- Animations → `animations.css`
- Component-specific → `[Component].css`

### Adding Utility Functions

- Add to `src/utils/helpers.ts`
- Export for reuse across components

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## 🔐 Privacy

All data stored locally in browser. No server communication.

## 📄 License

Free to use for educational and personal projects.

---

**Built with React, TypeScript, and attention to architecture** 🎓
