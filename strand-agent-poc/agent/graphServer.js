const express = require('express');
const cors = require('cors');
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`\n🚀 Graph API Server running on http://localhost:${PORT}`);
    console.log('📡 Endpoint: POST /api/generate-graph\n');
});
