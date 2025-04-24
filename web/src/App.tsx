import './App.css';
import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { AppRoutes } from './routes';

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
    <Container
      fluid
      className="d-flex flex-column px-0 min-vh-100"
      style={isTouch ? { WebkitTapHighlightColor: "transparent" } : undefined}
    >
      <AppRoutes />
    </Container>
  );
}

export default App;