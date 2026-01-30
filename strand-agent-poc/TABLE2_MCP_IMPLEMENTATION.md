# Table2 MCP Implementation

## Overview
Table2 now uses MCP (Model Context Protocol) to dynamically generate table UI from manufacturer analysis data.

## Architecture Flow

```
User clicks "Link 2" 
    ↓
Table2.js loads
    ↓
Calls POST /api/generate-table with manufacturer data
    ↓
Backend Agent (Llama via Ollama)
    ↓
MCP processes and validates data structure
    ↓
Returns structured table data
    ↓
Table2.js renders the table
```

## Files Created/Modified

### 1. **Data File**
- `generated-ui/src/data/manufacturerAnalysis.js`
- Contains 3 manufacturers: EINI5 (Einhell), BO3D2 (Bosch), DJIAU
- All columns from MD file included

### 2. **Table2 Component**
- `generated-ui/src/components/Table2.js`
- Calls MCP agent on mount
- Shows loading state during generation
- Fallback to static table if MCP fails

### 3. **Backend Agent**
- `agent/graphServer.js` - Added `/api/generate-table` endpoint
- `agent/ollamaClient.js` - Added `generateTableComponent()` method

## How It Works

1. **Table2 loads** → Automatically calls MCP agent
2. **Loading state** → Shows spinner with "Generating via Ollama + MCP"
3. **MCP generates** → Llama validates and structures the data
4. **Renders table** → Displays manufacturer analysis in table format
5. **Fallback** → If MCP fails, shows static table with same data

## Running the System

```bash
# Terminal 1: Start backend agent
cd agent
node graphServer.js

# Terminal 2: Start frontend
cd generated-ui
npm start
```

## Testing

1. Navigate to main dashboard (localhost:3000)
2. Click "Deep Dive" button
3. Click "Link 2" in any row
4. Watch MCP generate the table (5-10 seconds)
5. See manufacturer analysis table

## Key Features

✅ MCP-powered dynamic generation
✅ Llama agent orchestrates everything
✅ Loading states with progress indicators
✅ Automatic fallback if MCP unavailable
✅ Clean separation from Table1 (teammate's work)
✅ All MD file data preserved

## Data Structure

Each manufacturer has:
- Code (e.g., "EINI5")
- Name (e.g., "Einhell")
- Overall Summary
- Pricing Driver Summary
- Component Analysis
- Category Analysis
- Marketplace Analysis
