import React, { useState, useMemo } from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, TablePagination, Chip, Box, Typography, TextField,
    FormControl, InputLabel, Select, MenuItem, InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { manufacturersData } from '../data/manufacturers';

// Metric display component with trend icon
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

    const filteredData = useMemo(() => {
        const filtered = manufacturersData.filter(item => {
            const searchLower = search.toLowerCase();
            const matchesSearch = item.name.toLowerCase().includes(searchLower) || 
                                item.status.toLowerCase().includes(searchLower);
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
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

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
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

            {/* Table */}
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>#</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Manufacturer</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>YoY</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>MoM</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Profit</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>MoM CTC</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>YoY CTC</TableCell>
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
                                    <TableCell><MetricCell value={row.yoy} /></TableCell>
                                    <TableCell><MetricCell value={row.mom} /></TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(row.profit)}</TableCell>
                                    <TableCell><MetricCell value={row.momCtc} /></TableCell>
                                    <TableCell><MetricCell value={row.yoyCtc} /></TableCell>
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

            {/* Summary Cards */}
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
        </Box>
    );
};

export default ManufacturerTable;
