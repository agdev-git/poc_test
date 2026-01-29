const fs = require('fs').promises;
const path = require('path');
const OllamaClient = require('./ollamaClient');

class StrandAgent {
    constructor() {
        this.ollama = new OllamaClient();
        this.outputDir = path.join(__dirname, '..', 'generated-ui', 'src');
    }

    detectVisualizationType(query) {
        const lower = query.toLowerCase();
        if (lower.includes('bar chart') || lower.includes('bar graph')) return 'bar';
        if (lower.includes('pie chart') || lower.includes('pie graph')) return 'pie';
        if (lower.includes('line chart') || lower.includes('line graph') || lower.includes('trend')) return 'line';
        if (lower.includes('table') || lower.includes('list') || lower.includes('show me')) return 'table';
        return 'table'; // default
    }

    async processQuery(userQuery) {
        console.log('\n' + '═'.repeat(60));
        console.log('🤖 STRAND AGENT - Processing Your Query');
        console.log('═'.repeat(60));
        console.log(`\n📝 Query: "${userQuery}"\n`);

        const vizType = this.detectVisualizationType(userQuery);
        const config = this.analyzeQuery(userQuery);
        config.visualizationType = vizType;
        
        console.log('🔍 Analysis:');
        console.log(`   Visualization: ${vizType}`);
        console.log(`   Status Filter: ${config.statusFilter}`);
        console.log(`   Metrics: ${config.metrics.join(', ')}\n`);

        try {
            console.log('🔄 Step 1/3: Generating Data...');
            const dataCode = this.generateDataCode();
            await this.saveFile('data/manufacturers.js', dataCode);
            console.log('   ✅ Data generated\n');

            console.log(`🔄 Step 2/3: Generating ${vizType.toUpperCase()} Component...`);
            const componentCode = this.generateVisualizationComponent(config);
            await this.saveFile('components/Visualization.js', componentCode);
            console.log('   ✅ Component generated\n');

            console.log('🔄 Step 3/3: Generating App...');
            const appCode = this.generateAppCode(userQuery);
            await this.saveFile('App.js', appCode);
            console.log('   ✅ App generated\n');

            console.log('═'.repeat(60));
            console.log('✅ UI GENERATED SUCCESSFULLY!');
            console.log('═'.repeat(60));
            console.log('\n📁 Files created:');
            console.log('   • src/data/manufacturers.js');
            console.log('   • src/components/Visualization.js');
            console.log('   • src/App.js\n');

            return { success: true, config };

        } catch (error) {
            console.error('❌ Error:', error.message);
            throw error;
        }
    }

    // Analyze user query to determine configuration
    analyzeQuery(query) {
        const lowerQuery = query.toLowerCase();
        
        let statusFilter = 'all';
        if (lowerQuery.includes('red') && !lowerQuery.includes('green')) {
            statusFilter = 'red';
        } else if (lowerQuery.includes('green') && !lowerQuery.includes('red')) {
            statusFilter = 'green';
        }

        const metrics = [];
        if (lowerQuery.includes('yoy')) metrics.push('YoY');
        if (lowerQuery.includes('mom')) metrics.push('MoM');
        if (lowerQuery.includes('profit')) metrics.push('Profit');
        if (lowerQuery.includes('ctc')) {
            metrics.push('MoM CTC', 'YoY CTC');
        }
        
        // Default: show all metrics
        if (metrics.length === 0) {
            metrics.push('YoY', 'MoM', 'Profit', 'MoM CTC', 'YoY CTC');
        }

        return { statusFilter, metrics };
    }

    async saveFile(relativePath, content) {
        const fullPath = path.join(this.outputDir, relativePath);
        await fs.mkdir(path.dirname(fullPath), { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        console.log(`   💾 Saved: src/${relativePath}`);
    }

    // Generate manufacturer data
    generateDataCode() {
        const names = [
            'Acme Corp', 'TechFlow Inc', 'GlobalMfg Ltd', 'Prime Industries',
            'Atlas Products', 'Nexus Systems', 'Quantum Corp', 'Stellar Mfg',
            'Apex Industries', 'Nova Products', 'Titan Corp', 'Phoenix Mfg',
            'Velocity Inc', 'Summit Industries', 'Horizon Corp', 'Pinnacle Mfg',
            'Vanguard Inc', 'Eclipse Industries', 'Momentum Corp', 'Zenith Mfg'
        ];

        const data = names.map((name, i) => {
            const yoy = Math.round((Math.random() * 60 - 20) * 100) / 100;
            const mom = Math.round((Math.random() * 40 - 15) * 100) / 100;
            return {
                id: i + 1,
                name,
                yoy,
                mom,
                profit: Math.round(Math.random() * 400000 + 50000),
                momCtc: Math.round((Math.random() * 30 - 10) * 100) / 100,
                yoyCtc: Math.round((Math.random() * 40 - 15) * 100) / 100,
                status: (yoy < 0 || mom < 0) ? 'red' : 'green'
            };
        });

        return `// Auto-generated manufacturer data based on user query
// Generated at: ${new Date().toISOString()}

export const manufacturersData = ${JSON.stringify(data, null, 2)};
`;
    }

    generateVisualizationComponent(config) {
        switch(config.visualizationType) {
            case 'bar': return this.generateBarChartCode(config);
            case 'pie': return this.generatePieChartCode(config);
            case 'line': return this.generateLineChartCode(config);
            default: return this.generateTableCode(config);
        }
    }

    generateBarChartCode(config) {
        return `import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { manufacturersData } from '../data/manufacturers';

const Visualization = () => {
    const [statusFilter, setStatusFilter] = useState('${config.statusFilter}');
    const filteredData = manufacturersData.filter(item => 
        statusFilter === 'all' || item.status === statusFilter
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                Manufacturer Performance - Bar Chart
            </Typography>
            <FormControl sx={{ width: 150, mb: 3 }} size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="red">Red</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                </Select>
            </FormControl>
            <Paper sx={{ p: 3 }}>
                <ResponsiveContainer width="100%" height={500}>
                    <BarChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="profit" fill="#1976d2" name="Profit" />
                        <Bar dataKey="yoy" fill="#4caf50" name="YoY %" />
                        <Bar dataKey="mom" fill="#ff9800" name="MoM %" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default Visualization;`;
    }

    generatePieChartCode(config) {
        return `import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { manufacturersData } from '../data/manufacturers';

const Visualization = () => {
    const statusData = [
        { name: 'Red (Underperforming)', value: manufacturersData.filter(m => m.status === 'red').length },
        { name: 'Green (Performing)', value: manufacturersData.filter(m => m.status === 'green').length }
    ];
    const COLORS = ['#f44336', '#4caf50'];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                Manufacturer Status Distribution - Pie Chart
            </Typography>
            <Paper sx={{ p: 3 }}>
                <ResponsiveContainer width="100%" height={500}>
                    <PieChart>
                        <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label outerRadius={150} fill="#8884d8" dataKey="value">
                            {statusData.map((entry, index) => <Cell key={index} fill={COLORS[index]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default Visualization;`;
    }

    generateLineChartCode(config) {
        return `import React, { useState } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { manufacturersData } from '../data/manufacturers';

const Visualization = () => {
    const [statusFilter, setStatusFilter] = useState('${config.statusFilter}');
    const filteredData = manufacturersData.filter(item => 
        statusFilter === 'all' || item.status === statusFilter
    );

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#1976d2' }}>
                Manufacturer Performance Trends - Line Chart
            </Typography>
            <FormControl sx={{ width: 150, mb: 3 }} size="small">
                <InputLabel>Status</InputLabel>
                <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="red">Red</MenuItem>
                    <MenuItem value="green">Green</MenuItem>
                </Select>
            </FormControl>
            <Paper sx={{ p: 3 }}>
                <ResponsiveContainer width="100%" height={500}>
                    <LineChart data={filteredData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="yoy" stroke="#4caf50" name="YoY %" />
                        <Line type="monotone" dataKey="mom" stroke="#ff9800" name="MoM %" />
                    </LineChart>
                </ResponsiveContainer>
            </Paper>
        </Box>
    );
};

export default Visualization;`;
    }

    generateTableCode(config) {
        return `import React, { useState, useMemo } from 'react';
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
    const [statusFilter, setStatusFilter] = useState('${config.statusFilter}');

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
`;
    }

    generateAppCode(userQuery) {
        return `import React from 'react';
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
                        🤖 Generated from query: "${userQuery}"
                    </Typography>
                </Box>
                <Visualization />
            </Container>
        </ThemeProvider>
    );
}

export default App;
`;
    }
}

module.exports = StrandAgent;
