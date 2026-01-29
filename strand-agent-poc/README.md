# Dynamic Visualization System - Strand Agents POC

## Overview
A fully dynamic UI generation system that converts natural language queries into real-time visualizations. No hardcoded components - everything is generated on-the-fly based on user intent.

## 🚀 Quick Start

```bash
# Install dependencies
./install.sh

# Run the system
node run.js
```

## 💡 What Makes This Special

- **Zero Hardcoded UI** - All components generated dynamically
- **Natural Language** - Just describe what you want to see
- **Smart Detection** - Automatically picks the right visualization
- **Real-time Generation** - Query → Code → UI in seconds
- **Multiple Viz Types** - Tables, bar charts, pie charts, line charts

## 📊 Example Queries

```bash
# Table with interactive search and filters
"show me a table of manufacturers"

# Bar chart for comparisons
"show me a bar chart of manufacturer profits"

# Pie chart for distributions
"show me a pie chart of status distribution"

# Line chart for trends
"show me a line chart of performance trends"
```

## 🎯 How It Works

1. **You type** → "show me a bar chart of profits"
2. **System detects** → Bar chart visualization needed
3. **Generates code** → Creates React component with Recharts
4. **Renders UI** → Opens at localhost:3000

All in real-time. No templates. No hardcoding.

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Getting started guide
- **[DYNAMIC_VISUALIZATION.md](DYNAMIC_VISUALIZATION.md)** - System architecture
- **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 🛠️ Tech Stack

- **Backend**: Node.js, Ollama (for future AI enhancements)
- **Frontend**: React, Material-UI, Recharts
- **Generation**: Dynamic code generation based on query analysis

## ✨ Features

✅ Dynamic visualization detection  
✅ Real-time component generation  
✅ Interactive tables with search  
✅ Multiple chart types  
✅ Status filtering  
✅ Responsive design  
✅ No hardcoded templates  

## 🔧 Project Structure

```
strand-agent-poc/
├── agent/
│   ├── index.js          # Core agent with dynamic generation
│   ├── ollamaClient.js   # Ollama integration
│   └── codeGenerator.js  # Legacy (replaced by dynamic system)
├── generated-ui/
│   └── src/
│       ├── components/   # Generated components go here
│       ├── data/         # Generated data goes here
│       └── App.js        # Generated app wrapper
├── run.js                # Main entry point
└── install.sh            # Installation script
```

## 🎨 Supported Visualizations

| Type | Trigger Words | Features |
|------|--------------|----------|
| Table | "table", "list", "show me" | Search, pagination, filters |
| Bar Chart | "bar chart", "bar graph" | Multi-metric comparison |
| Pie Chart | "pie chart", "pie graph" | Status distribution |
| Line Chart | "line chart", "trend" | Trend analysis |

## 🚦 Status

✅ Dynamic visualization detection  
✅ Table generation with search fix  
✅ Bar chart generation  
✅ Pie chart generation  
✅ Line chart generation  
✅ Real-time component creation  
✅ Zero hardcoded components  

## 📝 License

MIT
