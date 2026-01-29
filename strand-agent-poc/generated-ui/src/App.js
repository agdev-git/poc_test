import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Container, Typography, Box } from '@mui/material';
import Visualization from './components/Visualization';
import Table1 from './components/Table1';
import Table2 from './components/Table2';

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
            <Router>
                <Routes>
                    <Route path="/" element={
                        <Container maxWidth="xl" sx={{ py: 4 }}>
                            <Box sx={{ mb: 2, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    🤖 Generated from query: "show me a table of manufacturers"
                                </Typography>
                            </Box>
                            <Visualization />
                        </Container>
                    } />
                    <Route path="/table1" element={<Table1 />} />
                    <Route path="/table2" element={<Table2 />} />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
