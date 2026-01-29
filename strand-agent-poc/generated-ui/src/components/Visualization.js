import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Chip, Box, Typography, TextField,
    FormControl, InputLabel, Select, MenuItem, InputAdornment, Button, Dialog, DialogTitle, DialogContent, IconButton, CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { manufacturersData } from '../data/manufacturers';

const MetricCell = ({ value }) => {
    const isPositive = value >= 0;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive ? (
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 18 }} />
            ) : (
                <TrendingDownIcon sx={{ color: '#f44336', fontSize: 18 }} />
            )}
            <Typography 
                sx={{ 
                    color: isPositive ? '#4caf50' : '#f44336', 
                    fontWeight: 500, 
                    fontSize: 14 
                }}
            >
                {value > 0 ? '+' : ''}{value}%
            </Typography>
        </Box>
    );
};

const ManufacturerTable = () => {
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [showDeepDive, setShowDeepDive] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [graphLoading, setGraphLoading] = useState(false);
    const [graphComponent, setGraphComponent] = useState(null);
    const navigate = useNavigate();

    const generateFallbackGraph = (manufacturer) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenue = [];
        const yoy = [];
        const mom = [];
        const trend = [];
        
        const baseRevenue = manufacturer.profit / 12;
        
        for (let i = 0; i < 12; i++) {
            const variance = (Math.random() - 0.5) * 0.4;
            revenue.push(Math.round(baseRevenue * (1 + variance)));
            yoy.push(Math.round((manufacturer.yoy + (Math.random() - 0.5) * 10) * 100) / 100);
            mom.push(Math.round((manufacturer.mom + (Math.random() - 0.5) * 5) * 100) / 100);
            trend.push(Math.round((15 + i * 2 + (Math.random() - 0.5) * 5) * 100) / 100);
        }
        
        return { months, revenue, yoy, mom, trend };
    };

    const handleActionClick = async (manufacturer) => {
        setSelectedManufacturer(manufacturer);
        setModalOpen(true);
        setGraphLoading(true);
        setGraphComponent(null);

        try {
            const response = await fetch('http://localhost:3001/api/generate-graph', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ manufacturer })
            });

            if (!response.ok) {
                throw new Error('API request failed');
            }

            const result = await response.json();
            
            if (result.success && result.data) {
                setGraphComponent(result.data);
            } else {
                throw new Error(result.error || 'No graph data returned');
            }
        } catch (error) {
            console.error('Error calling graph API:', error);
            // Fallback: Generate graph client-side
            const fallbackData = generateFallbackGraph(manufacturer);
            setGraphComponent(fallbackData);
        } finally {
            setGraphLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedManufacturer(null);
        setGraphComponent(null);
        setGraphLoading(false);
    };

    const filteredData = useMemo(() => {
        let filtered = manufacturersData.filter(item => {
            const searchLower = search.toLowerCase();
            const matchesSearch = item.name.toLowerCase().includes(searchLower) || 
                                item.status.toLowerCase().includes(searchLower);
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            const matchesYoy = true;
            const matchesMom = true;
            return matchesSearch && matchesStatus && matchesYoy && matchesMom;
        });
        
        setPage(0);
        return filtered;
    }, [search, statusFilter]);

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                Manufacturer Performance Dashboard
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                <Button 
                    variant="outlined" 
                    onClick={() => setShowDeepDive(!showDeepDive)}
                >
                    {showDeepDive ? 'Hide Deep Dive' : 'Deep Dive'}
                </Button>
                <TextField
                    placeholder="Search manufacturer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 300 }}
                    size="small"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ width: 150 }} size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="red">Red</MenuItem>
                        <MenuItem value="green">Green</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Manufacturer</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                            {showDeepDive && <TableCell sx={{ color: 'white', fontWeight: 600 }}>Deep Dive</TableCell>}
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>YoY</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>MoM</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Profit</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>MoM CTC</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>YoY CTC</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * 10, page * 10 + 10)
                            .map((row, index) => (
                                <TableRow 
                                    key={row.id}
                                    sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                                        '&:hover': { backgroundColor: '#e3f2fd' }
                                    }}
                                >
                                    <TableCell>{page * 10 + index + 1}</TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={row.status.toUpperCase()} 
                                            color={row.status === 'green' ? 'success' : 'error'}
                                            size="small"
                                        />
                                    </TableCell>
                                    {showDeepDive && (
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button size="small" variant="text" onClick={() => navigate('/table1')}>Link 1</Button>
                                                <Button size="small" variant="text" onClick={() => navigate('/table2')}>Link 2</Button>
                                            </Box>
                                        </TableCell>
                                    )}
                                    <TableCell><MetricCell value={row.yoy} /></TableCell>
                                    <TableCell><MetricCell value={row.mom} /></TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(row.profit)}</TableCell>
                                    <TableCell><MetricCell value={row.momCtc} /></TableCell>
                                    <TableCell><MetricCell value={row.yoyCtc} /></TableCell>
                                    <TableCell>
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            onClick={() => handleActionClick(row)}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Action
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filteredData.length}
                    page={page}
                    rowsPerPage={10}
                    rowsPerPageOptions={[10]}
                    onPageChange={(e, newPage) => setPage(newPage)}
                />
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">
                        {manufacturersData.filter(m => m.status === 'red').length}
                    </Typography>
                    <Typography variant="body2">Red (Underperforming)</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">
                        {manufacturersData.filter(m => m.status === 'green').length}
                    </Typography>
                    <Typography variant="body2">Green (Performing)</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">
                        {manufacturersData.length}
                    </Typography>
                    <Typography variant="body2">Total</Typography>
                </Paper>
            </Box>

            <Dialog 
                open={modalOpen} 
                onClose={handleCloseModal} 
                maxWidth="lg" 
                fullWidth
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                        Revenue Details - {selectedManufacturer?.name} (MCP Generated)
                    </Typography>
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {graphLoading ? (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 500, gap: 2 }}>
                            <CircularProgress size={60} />
                            <Typography variant="h6" color="text.secondary">
                                Generating graph via Ollama + MCP UI...
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                This may take 5-10 seconds
                            </Typography>
                        </Box>
                    ) : graphComponent ? (
                        <Box sx={{ width: '100%', height: 500, mt: 2 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={graphComponent.months.map((month, idx) => ({
                                    month,
                                    revenue: graphComponent.revenue[idx],
                                    yoy: graphComponent.yoy[idx],
                                    mom: graphComponent.mom[idx],
                                    trend: graphComponent.trend[idx]
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis yAxisId="left" label={{ value: 'Revenue ($)', angle: -90, position: 'insideLeft' }} />
                                    <YAxis yAxisId="right" orientation="right" label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar yAxisId="left" dataKey="revenue" fill="#ff9800" name="Revenue" />
                                    <Bar yAxisId="right" dataKey="yoy" fill="#9c27b0" name="YoY %" />
                                    <Bar yAxisId="right" dataKey="mom" fill="#4caf50" name="MoM %" />
                                    <Line yAxisId="right" type="monotone" dataKey="trend" stroke="#2196f3" strokeWidth={2} dot={{ r: 4 }} name="Trend %" />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </Box>
                    ) : (
                        <Box sx={{ height: 500, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="error">Failed to generate graph</Typography>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default ManufacturerTable;
