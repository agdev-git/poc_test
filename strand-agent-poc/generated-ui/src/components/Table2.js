import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Table2 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [tableData, setTableData] = useState(null);
    const [error, setError] = useState(null);

    const generateTableViaMCP = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/api/generate-table', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error('MCP API request failed');
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                setTableData(result.data);
            } else {
                throw new Error(result.error || 'No data returned');
            }
        } catch (err) {
            console.error('Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        generateTableViaMCP();
    }, [generateTableViaMCP]);

    return (
        <Box sx={{ p: 3 }}>
            <Button 
                startIcon={<ArrowBackIcon />} 
                onClick={() => navigate('/')}
                sx={{ mb: 2 }}
            >
                Back
            </Button>
            
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                Manufacturer Analysis (Random Data via MCP)
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, gap: 2 }}>
                    <CircularProgress size={60} />
                    <Typography variant="h6" color="text.secondary">
                        Step 1: Generating random MD data...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Step 2: MCP parsing MD to JSON...
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This may take 10-15 seconds
                    </Typography>
                </Box>
            ) : error ? (
                <Box>
                    <Typography color="error" sx={{ mb: 2 }}>
                        Error: {error}
                    </Typography>
                </Box>
            ) : tableData ? (
                <Box>
                    <Typography variant="body2" color="success.main" sx={{ mb: 2, fontWeight: 600 }}>
                        ✅ Random Data Generated & Parsed by MCP!
                    </Typography>
                    <TableContainer component={Paper} elevation={3}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Code</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Name</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Overall Summary</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Pricing Driver</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Component Analysis</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Category Analysis</TableCell>
                                    <TableCell sx={{ color: 'white', fontWeight: 600 }}>Marketplace Analysis</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableData.map((row) => (
                                    <TableRow key={row.code} sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}>
                                        <TableCell sx={{ fontWeight: 600 }}>{row.code}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{row.overallSummary}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{row.pricingDriverSummary}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{row.componentAnalysis}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{row.categoryAnalysis}</TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>{row.marketplaceAnalysis}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            ) : (
                <Typography color="error">No data available</Typography>
            )}
        </Box>
    );
};

export default Table2;
