import { Box, Link } from '@mui/material';
import { useState } from 'react';

/**
 * Componente que oferece um link para pular diretamente para o conteúdo principal,
 * útil para acessibilidade via teclado.
 */
export default function SkipLink() {
    const [focused, setFocused] = useState(false);

    return (
        <Box
            component="div"
            sx={{
                position: 'fixed',
                top: '10px',
                left: '10px',
                zIndex: 9999,
                transform: focused ? 'translateY(0)' : 'translateY(-100%)',
                transition: 'transform 0.3s',
            }}
        >
            <Link
                href="#main-content"
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById('main-content')?.focus();
                    document.getElementById('main-content')?.scrollIntoView();
                }}
                sx={{
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    p: 2,
                    borderRadius: 1,
                    fontWeight: 'medium',
                    display: 'inline-block',
                    '&:focus': {
                        outline: '3px solid',
                        outlineColor: 'primary.light',
                    }
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
            >
                Pular para o conteúdo principal
            </Link>
        </Box>
    );
}