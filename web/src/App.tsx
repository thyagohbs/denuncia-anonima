import './App.css';
import { ThemeProvider } from './theme/ThemeProvider';
import { AppRoutes } from './routes';
import { useState, useEffect } from 'react';
import { Box, CssBaseline } from '@mui/material';

// Estender a interface Navigator para incluir a propriedade msMaxTouchPoints
interface NavigatorWithMSTouch extends Navigator {
  msMaxTouchPoints?: number;
}

function App() {
  // Detectar se está em um dispositivo touch
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const nav = navigator as NavigatorWithMSTouch;
    const touchDevice =
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0) ||
      (nav.msMaxTouchPoints !== undefined && nav.msMaxTouchPoints > 0);

    setIsTouch(touchDevice);

    // Adiciona classe ao body para permitir estilos específicos para touch
    if (touchDevice) {
      document.body.classList.add('touch-device');
    }

    // Listener para mudança de tamanho da tela
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ThemeProvider>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          ...(isTouch && {
            WebkitTapHighlightColor: 'transparent',
          }),
        }}
      >
        <AppRoutes />
      </Box>
    </ThemeProvider>
  );
}

export default App;
