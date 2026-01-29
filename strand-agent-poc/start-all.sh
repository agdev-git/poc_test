#!/bin/bash

echo "🚀 Starting Dynamic Graph System"
echo ""

# Check Ollama
if ! curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    echo "❌ Ollama not running! Start with: ollama serve"
    exit 1
fi
echo "✅ Ollama running"

# Kill old servers
lsof -ti :3001 | xargs kill -9 2>/dev/null
echo "✅ Ports cleared"

# Start Graph Server
echo "🔧 Starting Graph API Server..."
node agent/graphServer.js > /tmp/graph-server.log 2>&1 &
GRAPH_PID=$!
sleep 2

# Start React
echo "🎨 Starting React UI..."
cd generated-ui
npm start &
REACT_PID=$!

echo ""
echo "✅ System running!"
echo "   Graph Server: http://localhost:3001"
echo "   React UI: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop"

# Cleanup on exit
trap "kill $GRAPH_PID $REACT_PID 2>/dev/null; exit" INT TERM
wait
