#!/bin/bash

echo "🚀 Starting Strand Agent with Dynamic Graph Generation"
echo ""

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "❌ Ollama is not running!"
    echo "   Start it with: ollama serve"
    exit 1
fi

echo "✅ Ollama is running"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

echo "🔧 Starting Graph API Server (port 3001)..."
node agent/graphServer.js &
GRAPH_SERVER_PID=$!

echo "⏳ Waiting for Graph API Server to start..."
sleep 2

echo ""
echo "✅ Graph API Server running on http://localhost:3001"
echo ""
echo "📋 Next steps:"
echo "   1. Generate UI: node run.js"
echo "   2. Start React: cd generated-ui && npm start"
echo "   3. Click 'Action' button to see dynamic graph generation!"
echo ""
echo "Press Ctrl+C to stop the Graph API Server"
echo ""

# Wait for Ctrl+C
trap "kill $GRAPH_SERVER_PID; exit" INT
wait $GRAPH_SERVER_PID
