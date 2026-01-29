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
}

module.exports = OllamaClient;
