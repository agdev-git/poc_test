# 🚀 Quick Start - Dynamic Graph Generation

## What This Does

When you click the **Action** button:
1. Modal opens with loading spinner (5-10 sec)
2. **Ollama + MCP UI generates graph** dynamically
3. Fresh random data every click
4. Actual rendered graph (not JSON)

## Start Everything (One Command)

```bash
./start-all.sh
```

This starts:
- Graph API Server (port 3001) - Bridge to Ollama
- React UI (port 3000) - Your table

## Manual Start (Two Terminals)

### Terminal 1: Graph Server
```bash
npm run graph-server
```

### Terminal 2: React UI
```bash
cd generated-ui
npm start
```

## Test It

1. Open http://localhost:3000
2. Click any **Action** button
3. Wait 5-10 seconds (Ollama generating)
4. See the graph!

## Why API Server?

**React (browser) CANNOT directly call Ollama** due to security.

The API server is a tiny bridge:
```
React → API Server → Ollama → MCP UI → Generated Graph
```

It runs locally, no external calls.

## Troubleshooting

### "Failed to generate graph"
- Ensure Graph Server is running: `npm run graph-server`
- Check Ollama: `curl http://localhost:11434/api/tags`

### Port 3001 in use
```bash
lsof -ti :3001 | xargs kill -9
```

## What's Dynamic

✅ Graph generated on-demand (not pre-built)
✅ Ollama + MCP UI creates it
✅ Random data every click
✅ Takes 5-10 seconds
✅ Fresh every time

**The API is necessary - browsers can't call Ollama directly!**
