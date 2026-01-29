# Dynamic Graph Generation via Ollama + MCP UI

## 🎯 Overview

The Action button now generates graphs **dynamically on-demand** using Ollama + MCP UI, instead of using pre-generated hardcoded graphs.

## 🔄 How It Works

### User Flow
```
1. User clicks "Action" button on any manufacturer row
2. Modal opens with loading spinner
3. React calls Graph API Server (localhost:3001)
4. Server calls Ollama with graph generation prompt
5. Ollama uses MCP UI to generate graph component + data
6. Generated code returned to React (5-10 seconds)
7. Graph displayed in modal
```

### Architecture
```
┌─────────────┐
│  React UI   │ ← User clicks Action
│ (port 3000) │
└──────┬──────┘
       │ HTTP POST
       ↓
┌─────────────┐
│  Graph API  │ ← Express server
│ (port 3001) │
└──────┬──────┘
       │ Ollama API
       ↓
┌─────────────┐
│   Ollama    │ ← Calls MCP UI
│ (port 11434)│
└──────┬──────┘
       │ MCP UI
       ↓
┌─────────────┐
│  Generated  │ ← Fresh graph code
│    Graph    │    + random data
└─────────────┘
```

## 🚀 Setup & Installation

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `express` - API server
- `cors` - Cross-origin requests
- `axios` - HTTP client

### 2. Start Ollama
```bash
ollama serve
```

Make sure Ollama is running on `http://localhost:11434`

### 3. Start Graph API Server
```bash
# Option 1: Use startup script
./start-graph-server.sh

# Option 2: Manual start
npm run graph-server

# Option 3: Direct node
node agent/graphServer.js
```

Server runs on `http://localhost:3001`

### 4. Generate UI
```bash
node run.js
> "show me a table of manufacturers"
```

### 5. Start React App
```bash
cd generated-ui
npm start
```

Opens on `http://localhost:3000`

## 🎨 Testing Dynamic Graph Generation

1. Open React app in browser
2. Click any **"Action"** button in the table
3. Modal opens with loading spinner
4. Wait 5-10 seconds
5. Generated graph code appears
6. Each click generates fresh code!

## 📁 New Files Created

```
strand-agent-poc/
├── agent/
│   └── graphServer.js          # Express API server
├── start-graph-server.sh       # Startup script
└── DYNAMIC_GRAPH_GENERATION.md # This file
```

## 🔧 Modified Files

### `agent/ollamaClient.js`
- Added `generateGraphComponent()` method
- Added `cleanGraphCode()` helper

### `agent/index.js`
- Updated `generateTableCode()` to call API
- Added loading state management
- Removed hardcoded graph generation

### `package.json`
- Added `express` and `cors` dependencies
- Added `graph-server` script

## 🎯 API Endpoint

### POST `/api/generate-graph`

**Request:**
```json
{
  "manufacturer": {
    "id": 1,
    "name": "Acme Corp",
    "profit": 400889,
    "yoy": -18.58,
    "mom": 24.6
  }
}
```

**Response:**
```json
{
  "success": true,
  "graphCode": "import React from 'react';\n...",
  "manufacturer": "Acme Corp"
}
```

## 🔑 Key Features

✅ **On-Demand Generation** - Graph only generated when Action clicked
✅ **Fresh Every Time** - Each click = new generation
✅ **Random Data** - MCP UI generates random monthly data
✅ **Loading State** - Shows spinner during 5-10 sec generation
✅ **No Hardcoding** - No pre-generated graph code
✅ **Ollama + MCP UI** - Uses AI to generate graph structure

## 🐛 Troubleshooting

### Graph API Server not starting
```bash
# Check if port 3001 is available
lsof -i :3001

# Kill existing process
kill -9 <PID>
```

### Ollama not responding
```bash
# Check Ollama status
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

### React can't connect to API
- Ensure Graph API Server is running on port 3001
- Check browser console for CORS errors
- Verify `http://localhost:3001/api/generate-graph` is accessible

## 📊 What Gets Generated

Ollama + MCP UI generates:
- React component with Recharts
- 12 months of data (Jan-Dec)
- Random revenue based on manufacturer profit
- YoY/MoM variations
- Trend line data
- Complete chart configuration

## 🎉 Benefits

1. **Dynamic** - No hardcoded graphs
2. **Fresh** - New data every click
3. **AI-Powered** - Ollama decides structure
4. **Flexible** - Can generate different chart types
5. **Real-time** - Generated on-demand

## 📝 Notes

- Graph generation takes 5-10 seconds (Ollama processing time)
- Currently displays generated code (can be enhanced to render actual component)
- Each manufacturer gets unique graph based on their metrics
- MCP UI ensures consistent graph structure
