const axios = require('axios');

class OllamaClient {
    constructor(model = 'llama3') {
        this.baseUrl = 'http://localhost:11434';
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
}

module.exports = OllamaClient;
