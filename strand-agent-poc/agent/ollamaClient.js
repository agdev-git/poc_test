const axios = require('axios');

class OllamaClient {
    constructor(model = 'llama3') {
        this.baseUrl = 'http://127.0.0.1:11434';
        this.model = model;
    }

    async generate(prompt, systemPrompt = '') {
        try {
            const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
            
            console.log('   🔄 Calling Ollama...');
            
            const response = await axios.post(`${this.baseUrl}/api/generate`, {
                model: this.model,
                prompt: fullPrompt,
                stream: false,
                options: {
                    temperature: 0.2,
                    num_predict: 4000
                }
            });

            return response.data.response;
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                throw new Error('Ollama is not running! Start it with: ollama serve');
            }
            throw error;
        }
    }

    async isAvailable() {
        try {
            await axios.get(`${this.baseUrl}/api/tags`);
            return true;
        } catch {
            return false;
        }
    }

    async generateGraphComponent(manufacturer) {
        const systemPrompt = `You are a data generator. Return ONLY valid JSON. No markdown, no explanations, no code blocks.

Output format:
{
  "months": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "revenue": [number array - 12 values],
  "yoy": [number array - 12 values],
  "mom": [number array - 12 values],
  "trend": [number array - 12 values]
}`;
        
        const prompt = `Generate 12 months of financial data for ${manufacturer.name}.

Base values:
- Monthly revenue: ${Math.round(manufacturer.profit / 12)} (vary by ±40%)
- YoY: ${manufacturer.yoy}% (vary by ±10%)
- MoM: ${manufacturer.mom}% (vary by ±5%)
- Trend: Start at 15%, increase by 2% each month (vary by ±5%)

Return ONLY the JSON object. No other text.`;

        const response = await this.generate(prompt, systemPrompt);
        return this.cleanGraphData(response);
    }

    async generateRandomManufacturerMD() {
        const systemPrompt = `You are a data generator. Generate a markdown table with random manufacturer analysis data.
Follow this EXACT format. Return ONLY the markdown table, no other text.

Format:
| Manufacturer Code | Manufacturer Name | Overall Summary | Pricing Driver Summary | Component Analysis | Category Analysis | Marketplace Analysis |
|-------------------|-------------------|-----------------|------------------------|--------------------|--------------------|----------------------|

Metrics to include:
- Overall Summary: YoY NetPPM in Wk3 at X%/€XMM (+/-Xbps WoW, +/-Xbps YoY, +/-Xbps CtC)
- Pricing Driver: External Match, Internal Match, Base Pricing with CtC values
- Component Analysis: PPM share impact, VFCC share impact, ASP and ACU values
- Category Analysis: Top 3 categories with codes and CtC values (or N/A)
- Marketplace Analysis: Top marketplaces (DE, FR, IT, UK, NL) with CtC values`;
        
        const prompt = `Generate 4 random manufacturers with realistic names (like Bosch, Siemens, Makita, DeWalt).
Use random but realistic financial metrics.
Return ONLY the markdown table with header row and 4 data rows.`;

        const response = await this.generate(prompt, systemPrompt);
        return this.cleanMarkdownTable(response);
    }

    cleanMarkdownTable(response) {
        let cleaned = response.trim();
        cleaned = cleaned.replace(/```markdown\n?/g, '');
        cleaned = cleaned.replace(/```\n?/g, '');
        
        const lines = cleaned.split('\n');
        const tableStart = lines.findIndex(line => line.trim().startsWith('|'));
        
        if (tableStart !== -1) {
            const tableLines = lines.slice(tableStart).filter(line => line.trim().startsWith('|'));
            return tableLines.join('\n');
        }
        
        return cleaned;
    }

    async parseMDFile(mdContent) {
        const systemPrompt = `You are a markdown parser. Extract manufacturer data from the markdown table.
Return ONLY a valid JSON array with this structure:
[
  {
    "code": "manufacturer code",
    "name": "manufacturer name",
    "overallSummary": "text",
    "pricingDriverSummary": "text",
    "componentAnalysis": "text",
    "categoryAnalysis": "text",
    "marketplaceAnalysis": "text"
  }
]
No markdown, no explanations, just the JSON array.`;
        
        const prompt = `Parse this markdown file and extract the table data into JSON:

${mdContent}

Return ONLY the JSON array of manufacturers.`;

        const response = await this.generate(prompt, systemPrompt);
        return this.cleanTableData(response, []);
    }

    async processManufacturerData(data) {
        const systemPrompt = `You are a data processor using MCP (Model Context Protocol).
Analyze and validate manufacturer data, then return it in structured format.
Return ONLY valid JSON array. No markdown, no explanations.`;
        
        const prompt = `Process this manufacturer data and return it as valid JSON:

${JSON.stringify(data, null, 2)}

Return the EXACT same structure as valid JSON array.`;

        const response = await this.generate(prompt, systemPrompt);
        return this.cleanTableData(response, data);
    }

    async generateTableComponent(data) {
        const systemPrompt = `You are a React component generator using MCP (Model Context Protocol).
Generate a complete React table component as a string that can be executed.

Return ONLY valid JavaScript code for a React functional component.
Use Material-UI components: TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell.

The component should:
1. Accept 'data' prop (array of manufacturer objects)
2. Display all 7 columns: Code, Name, Overall Summary, Pricing Driver, Component Analysis, Category Analysis, Marketplace Analysis
3. Use Material-UI styling with sx prop
4. Include hover effects and alternating row colors
5. Make text readable with appropriate font sizes

Return format:
(props) => {
  const { data } = props;
  return (
    // JSX here
  );
}

IMPORTANT: Return ONLY the function code, no imports, no exports, no markdown.`;
        
        const prompt = `Generate a React table component that displays this manufacturer data:

${JSON.stringify(data, null, 2)}

The component must render all 7 columns in a Material-UI table.
Return ONLY the component function code.`;

        const response = await this.generate(prompt, systemPrompt);
        return this.cleanComponentCode(response);
    }

    cleanComponentCode(response) {
        let cleaned = response.trim();
        // Remove markdown code blocks
        cleaned = cleaned.replace(/```javascript\n?/g, '');
        cleaned = cleaned.replace(/```jsx\n?/g, '');
        cleaned = cleaned.replace(/```\n?/g, '');
        
        // Remove any import statements
        cleaned = cleaned.replace(/import .* from .*;?\n?/g, '');
        
        // Find the function
        const functionMatch = cleaned.match(/\(props\)[\s\S]*=>[\s\S]*\{[\s\S]*\}/m);
        if (functionMatch) {
            return functionMatch[0];
        }
        
        return cleaned;
    }

    cleanGraphData(response) {
        let cleaned = response.trim();
        // Remove markdown code blocks
        cleaned = cleaned.replace(/```json\n?/g, '');
        cleaned = cleaned.replace(/```\n?/g, '');
        
        // Find JSON object
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                return null;
            }
        }
        return null;
    }

    cleanTableData(response, fallbackData) {
        let cleaned = response.trim();
        // Remove markdown code blocks
        cleaned = cleaned.replace(/```json\n?/g, '');
        cleaned = cleaned.replace(/```\n?/g, '');
        
        // Find JSON array
        const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            try {
                return JSON.parse(jsonMatch[0]);
            } catch (e) {
                console.error('Failed to parse table JSON:', e);
                return fallbackData;
            }
        }
        return fallbackData;
    }
}

module.exports = OllamaClient;
