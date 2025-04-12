import { Box, BoxProps } from '@mui/material';
import { forwardRef, ReactNode } from 'react';

interface ContentProps extends BoxProps {
    children: ReactNode;
}

const Content = forwardRef<HTMLDivElement, ContentProps>(
    ({ children, ...props }, ref) => {
        return (
            <Box
                ref={ref}
                id="main-content"
                component="div"
                role="main"
                tabIndex={-1}
                sx={{
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    width: '100%',
                    ...props.sx
                }}
                {...props}
            >
                {children}
            </Box>
        );
    }
);

Content.displayName = 'Content';

export default Content;