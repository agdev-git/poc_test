const OllamaClient = require('./ollamaClient');

class CodeGenerator {
    constructor() {
        this.ollama = new OllamaClient('llama3');
    }

    async generateData(userPrompt) {
        const systemPrompt = `You are a JavaScript code generator. 
OUTPUT ONLY VALID JAVASCRIPT CODE. NO EXPLANATIONS.
Do not include \`\`\`javascript or \`\`\` markers.`;

        const prompt = `Generate a JavaScript ES6 module file with manufacturer data.

Requirements:
- Create array called "manufacturersData" with exactly 20 manufacturers
- Each object has: id, name, yoy, mom, profit, momCtc, yoyCtc, status
- yoy, mom, momCtc, yoyCtc are percentage numbers between -30 and +40
- profit is number between 50000 and 500000
- status is "red" if yoy < 0 OR mom < 0, otherwise "green"
- Use realistic company names
- Export the array

User request: "${userPrompt}"

Output ONLY JavaScript code:`;

        console.log('   📊 Generating data...');
        const response = await this.ollama.generate(prompt, systemPrompt);
        return this.cleanCode(response);
    }

    async generateTableComponent(userPrompt) {
        const systemPrompt = `You are a React code generator.
OUTPUT ONLY VALID REACT JSX CODE. NO EXPLANATIONS.`;

        const prompt = `Generate a React component called ManufacturerTable.

Use these imports:
import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Chip, Box, Typography, TextField, FormControl, InputLabel, Select, MenuItem, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import { manufacturersData } from '../data/manufacturers';

Requirements:
1. Table columns: #, Manufacturer, Status, YoY, MoM, Profit, MoM CTC, YoY CTC
2. Pagination: 10 rows per page
3. Search box for manufacturer name
4. Status filter dropdown: All, Red, Green
5. Red/Green chip for status
6. Trending icons for metrics (green up, red down)
7. Blue header, hover effects

User request: "${userPrompt}"

Output ONLY React code:`;

        console.log('   🎨 Generating table component...');
        const response = await this.ollama.generate(prompt, systemPrompt);
        return this.cleanCode(response);
    }

    async generateAppComponent(userPrompt) {
        const prompt = `Generate simple React App.js with MUI ThemeProvider, import ManufacturerTable from './components/ManufacturerTable'. Blue theme. Output ONLY code:`;

        console.log('   📱 Generating App component...');
        const response = await this.ollama.generate(prompt);
        return this.cleanCode(response);
    }

    cleanCode(response) {
        let code = response.trim();
        code = code.replace(/```javascript\n?/g, '');
        code = code.replace(/```jsx\n?/g, '');
        code = code.replace(/```js\n?/g, '');
        code = code.replace(/```\n?/g, '');
        
        const indices = ['import', '//', 'export', 'const']
            .map(s => code.indexOf(s))
            .filter(i => i >= 0);
        
        if (indices.length > 0) {
            const startIndex = Math.min(...indices);
            if (startIndex > 0) code = code.substring(startIndex);
        }
        
        return code.trim();
    }
}

module.exports = CodeGenerator;
