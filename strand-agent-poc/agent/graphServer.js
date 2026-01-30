const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const OllamaClient = require('./ollamaClient');

const app = express();
const ollama = new OllamaClient();

app.use(cors());
app.use(express.json());

app.post('/api/generate-graph', async (req, res) => {
    try {
        const { manufacturer } = req.body;
        
        console.log(`\n🎨 Generating graph data for: ${manufacturer.name}`);
        console.log('⏱️  This will take 5-10 seconds...\n');
        
        const graphData = await ollama.generateGraphComponent(manufacturer);
        
        if (!graphData) {
            throw new Error('Failed to generate valid JSON from Ollama');
        }
        
        console.log('✅ Graph data generated successfully!\n');
        
        res.json({ 
            success: true, 
            data: graphData,
            manufacturer: manufacturer.name
        });
    } catch (error) {
        console.error('❌ Error generating graph:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.post('/api/generate-table', async (req, res) => {
    try {
        console.log('\n🎲 Generating random MD data...');
        const randomMD = generateRandomMD();
        
        console.log('🧠 MCP parsing generated MD...');
        const parsedData = await ollama.parseMDFile(randomMD);
        console.log('Parsed data count:', parsedData ? parsedData.length : 0);
        
        if (!parsedData || parsedData.length === 0) {
            throw new Error('MCP failed to parse MD');
        }
        
        console.log('✅ Random data generated & parsed!\n');
        
        res.json({ 
            success: true, 
            data: parsedData
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

function generateRandomMD() {
    const manufacturers = ['Bosch', 'Siemens', 'Makita', 'DeWalt'];
    const codes = ['BO3D2', 'SIE45', 'MAK78', 'DEW12'];
    const marketplaces = ['DE', 'FR', 'IT', 'UK', 'NL'];
    
    let md = '| Manufacturer Code | Manufacturer Name | Overall Summary | Pricing Driver Summary | Component Analysis | Category Analysis | Marketplace Analysis |\n';
    md += '|-------------------|-------------------|-----------------|------------------------|--------------------|--------------------|----------------------|\n';
    
    for (let i = 0; i < 4; i++) {
        const netPPM = (Math.random() * 60 - 30).toFixed(1);
        const revenue = (Math.random() * 10 + 0.1).toFixed(1);
        const wowBps = Math.floor(Math.random() * 200 - 100);
        const yoyBps = Math.floor(Math.random() * 800 - 400);
        const ctcBps = Math.floor(Math.random() * 100 - 50);
        
        const overallSummary = `YoY NetPPM in Wk3 is at ${netPPM}%/€${revenue}MM (${wowBps >= 0 ? '+' : ''}${wowBps}bps WoW, ${yoyBps >= 0 ? '+' : ''}${yoyBps}bps YoY, ${ctcBps >= 0 ? '+' : ''}${ctcBps}bps CtC)`;
        const pricingDriver = `YoY Pan EU ${codes[i]} NetPPM ${netPPM > 0 ? 'increase' : 'decrease'} is mainly driven by External Match (${Math.floor(Math.random() * 500 - 250)}bps CtC)`;
        const componentAnalysis = `PPM share impact (${Math.floor(Math.random() * 600 - 300)}bps CtC), VFCC share impact (${Math.floor(Math.random() * 200 - 100)}bps CtC)`;
        const categoryAnalysis = Math.random() > 0.3 ? `Power Tools (${Math.floor(Math.random() * 300 - 150)}bps CtC)` : 'N/A';
        const marketplaceAnalysis = marketplaces.slice(0, 3).map(m => `${m} (${Math.floor(Math.random() * 400 - 200)}bps CtC)`).join(', ');
        
        md += `| ${codes[i]} | ${manufacturers[i]} | ${overallSummary} | ${pricingDriver} | ${componentAnalysis} | ${categoryAnalysis} | ${marketplaceAnalysis} |\n`;
    }
    
    return md;
}

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 MCP Agent Server running on http://localhost:${PORT}`);
    console.log('📡 Endpoints:');
    console.log('   - POST /api/generate-graph');
    console.log('   - POST /api/generate-table\n');
});
