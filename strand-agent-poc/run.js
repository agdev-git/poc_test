const StrandAgent = require('./agent');
const { spawn } = require('child_process');
const path = require('path');
const readline = require('readline');

const agent = new StrandAgent();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise(resolve => rl.question(question, resolve));
}

async function startReactApp() {
    const uiPath = path.join(__dirname, 'generated-ui');
    
    console.log('\n🚀 Starting React app...');
    console.log('📍 Opening: http://localhost:3000\n');
    
    spawn('npm', ['start'], {
        cwd: uiPath,
        stdio: 'inherit',
        shell: true
    });
}

async function main() {
    console.log('\n' + '═'.repeat(60));
    console.log('   🤖 STRAND AGENT POC');
    console.log('   📊 Dynamic Table UI Generator');
    console.log('═'.repeat(60));
    
    console.log('\n📌 Example queries:');
    console.log('   • "show me a table of manufacturers"');
    console.log('   • "show me a bar chart of manufacturer profits"');
    console.log('   • "show me a pie chart of status distribution"');
    console.log('   • "show me a line chart of performance trends"\n');

    const defaultQuery = "show me a table of manufacturers";
    
    let query = await askQuestion('📝 Enter your query (or press Enter for default):\n> ');
    
    if (!query.trim()) {
        query = defaultQuery;
        console.log(`\n   Using default: "${query}"`);
    }

    console.log('');

    try {
        const result = await agent.processQuery(query);

        if (result.success) {
            const start = await askQuestion('🚀 Start React app now? (yes/no): ');
            
            if (start.toLowerCase() === 'yes' || start.toLowerCase() === 'y') {
                await startReactApp();
            } else {
                console.log('\n📋 To start manually:');
                console.log('   cd generated-ui && npm start\n');
                rl.close();
            }
        }
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        rl.close();
    }
}

main();
