const fs = require('fs').promises;
const path = require('path');
const CodeGenerator = require('./codeGenerator');
const OllamaClient = require('./ollamaClient');

class StrandAgent {
    constructor() {
        this.codeGenerator = new CodeGenerator();
        this.ollama = new OllamaClient();
        this.outputDir = path.join(__dirname, '..', 'generated-ui', 'src');
    }

    async checkOllama() {
        const available = await this.ollama.isAvailable();
        if (!available) {
            console.error('\n❌ Ollama is not running!');
            console.log('\n📋 Start Ollama:');
            console.log('   1. Open new terminal');
            console.log('   2. Run: ollama serve');
            console.log('   3. Run: ollama pull llama3');
            console.log('   4. Try again\n');
            return false;
        }
        return true;
    }

    async processQuery(userQuery) {
        console.log('\n' + '═'.repeat(60));
        console.log('🤖 STRAND AGENT - Powered by Ollama');
        console.log('═'.repeat(60));
        console.log(`\n📝 User Query: "${userQuery}"\n`);

        // Check Ollama
        if (!(await this.checkOllama())) {
            throw new Error('Ollama not available');
        }

        try {
            // Step 1: Generate Data
            console.log('🔄 Step 1/3: Generating Manufacturer Data...');
            let dataCode;
            try {
                dataCode = await this.codeGenerator.generateData(userQuery);
            } catch (e) {
                console.log('   ⚠️ Using fallback data...');
                dataCode = this.getFallbackData();
            }
            await this.saveFile('data/manufacturers.js', dataCode);
            console.log('   ✅ Data generated\n');

            // Step 2: Generate Table Component
            console.log('🔄 Step 2/3: Generating Table Component...');
            let tableCode;
            try {
                tableCode = await this.codeGenerator.generateTableComponent(userQuery);
            } catch (e) {
                console.log('   ⚠️ Using fallback component...');
                tableCode = this.getFallbackTableComponent();
            }
            await this.saveFile('components/ManufacturerTable.js', tableCode);
            console.log('   ✅ Table component generated\n');

            // Step 3: Generate App Component
            console.log('🔄 Step 3/3: Generating App Component...');
            let appCode;
            try {
                appCode = await this.codeGenerator.generateAppComponent(userQuery);
            } catch (e) {
                console.log('   ⚠️ Using fallback App...');
                appCode = this.getFallbackAppComponent();
            }
            await this.saveFile('App.js', appCode);
            console.log('   ✅ App component generated\n');

            console.log('═'.repeat(60));
            console.log('✅ UI GENERATED SUCCESSFULLY!');
            console.log('═'.repeat(60));

            console.log('\n📁 Generated Files:');
            console.log('   • src/data/manufacturers.js');
            console.log('   • src/components/ManufacturerTable.js');
            console.log('   • src/App.js\n');

            return { success: true };

        } catch (error) {
            console.error('❌ Error:', error.message);
            throw error;
        }
    }

    async saveFile(relativePath, content) {
        const fullPath = path.join(this.outputDir, relativePath);
        const dir = path.dirname(fullPath);
        
        await fs.mkdir(dir, { recursive: true });
        await fs.writeFile(fullPath, content, 'utf8');
        
        console.log(`   💾 Saved: src/${relativePath}`);
    }

    // Fallback data if Ollama fails
    getFallbackData() {
        const manufacturers = [];
        const names = [
            'Acme Corp', 'TechFlow Inc', 'GlobalMfg Ltd', 'Prime Industries',
            'Atlas Products', 'Nexus Systems', 'Quantum Corp', 'Stellar Mfg',
            'Apex Industries', 'Nova Products', 'Titan Corp', 'Phoenix Mfg',
            'Velocity Inc', 'Summit Industries', 'Horizon Corp', 'Pinnacle Mfg',
            'Vanguard Inc', 'Eclipse Industries', 'Momentum Corp', 'Zenith Mfg'
        ];

        for (let i = 0; i < 20; i++) {
            const yoy = Math.round((Math.random() * 60 - 20) * 100) / 100;
            const mom = Math.round((Math.random() * 40 - 15) * 100) / 100;
            manufacturers.push({
                id: i + 1,
                name: names[i],
                yoy,
                mom,
                profit: Math.round(Math.random() * 400000 + 50000),
                momCtc: Math.round((Math.random() * 30 - 10) * 100) / 100,
                yoyCtc: Math.round((Math.random() * 40 - 15) * 100) / 100,
                status: (yoy < 0 || mom < 0) ? 'red' : 'green'
            });
        }

        return `// Auto-generated manufacturer data
export const manufacturersData = ${JSON.stringify(manufacturers, null, 2)};
`;
    }

    // Fallback table component
    getFallbackTableComponent() {
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

const MetricCell = ({ value }) => {
    const isPositive = value >= 0;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {isPositive ? (
                <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 18 }} />
            ) : (
                <TrendingDownIcon sx={{ color: '#f44336', fontSize: 18 }} />
            )}
            <Typography sx={{ color: isPositive ? '#4caf50' : '#f44336', fontWeight: 500, fontSize: 14 }}>
                {value > 0 ? '+' : ''}{value}%
            </Typography>
        </Box>
    );
};

const ManufacturerTable = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const filteredData = useMemo(() => {
        return manufacturersData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
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
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
                Manufacturer Performance Dashboard
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    placeholder="Search manufacturer..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ width: 300 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
                <FormControl sx={{ width: 150 }}>
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
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>YoY</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>MoM</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>Profit</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>MoM CTC</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 600 }}>YoY CTC</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => (
                                <TableRow 
                                    key={row.id}
                                    sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
                                        '&:hover': { backgroundColor: '#e3f2fd' }
                                    }}
                                >
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
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
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10]}
                    onPageChange={(e, newPage) => setPage(newPage)}
                />
            </TableContainer>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="error">{manufacturersData.filter(m => m.status === 'red').length}</Typography>
                    <Typography variant="body2">Red (Underperforming)</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="success.main">{manufacturersData.filter(m => m.status === 'green').length}</Typography>
                    <Typography variant="body2">Green (Performing)</Typography>
                </Paper>
                <Paper sx={{ p: 2, flex: 1, textAlign: 'center' }}>
                    <Typography variant="h5" color="primary">{manufacturersData.length}</Typography>
                    <Typography variant="body2">Total</Typography>
                </Paper>
            </Box>
        </Box>
    );
};

export default ManufacturerTable;
`;
    }

    // Fallback App component
    getFallbackAppComponent() {
        return `import React from 'react';
import { ThemeProvider, createTheme, CssBaseline, Container } from '@mui/material';
import ManufacturerTable from './components/ManufacturerTable';

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
            <Container maxWidth="xl">
                <ManufacturerTable />
            </Container>
        </ThemeProvider>
    );
}

export default App;
`;
    }
}

module.exports = StrandAgent;