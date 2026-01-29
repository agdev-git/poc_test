# Quick Start Guide - Dynamic Visualization System

## Installation

```bash
# 1. Install main dependencies
npm install

# 2. Install UI dependencies (includes recharts for charts)
cd generated-ui
npm install
cd ..
```

## Running the System

```bash
# Start the agent
node run.js
```

## Example Queries

### Table View
```
"show me a table of manufacturers"
"list all manufacturers"
"show me manufacturers"
```

### Bar Chart
```
"show me a bar chart of manufacturer profits"
"bar chart of performance"
"bar graph of red manufacturers"
```

### Pie Chart
```
"show me a pie chart of status distribution"
"pie chart of manufacturer status"
"show status distribution in pie chart"
```

### Line Chart
```
"show me a line chart of performance trends"
"line graph of trends"
"show trends over time"
```

## How It Works

1. **You type a query** → System analyzes it
2. **Detection happens** → Identifies visualization type (table/bar/pie/line)
3. **Code generation** → Creates React component on-the-fly
4. **Auto-render** → Opens in browser at localhost:3000

## Features

✅ **Zero Hardcoded Components** - Everything generated dynamically
✅ **Natural Language** - Just describe what you want
✅ **Real-time Conversion** - Query → Code → UI in seconds
✅ **Smart Detection** - Automatically picks the right visualization
✅ **Interactive** - All visualizations have filters and interactions

## Testing Different Visualizations

Try these queries one after another to see dynamic generation:

```bash
# Run 1: Table
node run.js
> "show me a table of manufacturers"

# Run 2: Bar Chart
node run.js
> "show me a bar chart of profits"

# Run 3: Pie Chart
node run.js
> "show me a pie chart of status"

# Run 4: Line Chart
node run.js
> "show me trends in a line chart"
```

Each time, the system generates a completely different component!

## What Gets Generated

For each query, the system creates:
- `src/data/manufacturers.js` - Fresh data
- `src/components/Visualization.js` - Dynamic component (table/chart)
- `src/App.js` - App wrapper

No templates. No hardcoded UI. Pure dynamic generation.
