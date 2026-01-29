import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@mui/material';
import Visualization from './components/Visualization';

// Theme configuration
const theme = createTheme({
    palette: {
        primary: { main: '#1976d2' },
        background: { default: '#f5f5f5' }
    }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* User Query Display */}
                <Box sx={{ mb: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        🤖 Generated from query: "show me the  graph  for top 5 companies with yoy "
                    </Typography>
                </Box>
                <Visualization />
            </Container>
        </ThemeProvider>
    );
}

export default App;
