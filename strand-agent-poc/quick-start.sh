#!/bin/bash

echo "🚀 Quick Start - Dynamic Graph Generation"
echo "=========================================="
echo ""

# Step 1: Check Ollama
echo "Step 1: Checking Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama is running"
else
    echo "❌ Ollama is NOT running"
    echo "   Start it with: ollama serve"
    exit 1
fi
echo ""

# Step 2: Start Graph API Server
echo "Step 2: Starting Graph API Server..."
node agent/graphServer.js &
GRAPH_PID=$!
sleep 2
echo "✅ Graph API Server started (PID: $GRAPH_PID)"
echo ""

# Step 3: Instructions
echo "Step 3: Start React App"
echo "   Run in another terminal:"
echo "   cd generated-ui && npm start"
echo ""

echo "Step 4: Test Dynamic Graph Generation"
echo "   1. Open http://localhost:3000"
echo "   2. Click any 'Action' button"
echo "   3. Wait 5-10 seconds"
echo "   4. See dynamically generated graph!"
echo ""

echo "Press Ctrl+C to stop Graph API Server"
echo ""

# Keep server running
trap "kill $GRAPH_PID 2>/dev/null; echo ''; echo '👋 Graph API Server stopped'; exit" INT TERM
wait $GRAPH_PID
