# Dynamic Visualization System

## Overview
This system automatically detects the visualization type from user queries and generates the appropriate React component in real-time.

## How It Works

### 1. Query Detection
The agent analyzes your natural language query to determine:
- **Visualization Type**: table, bar chart, pie chart, or line chart
- **Data Filters**: status (red/green), metrics (YoY, MoM, Profit, etc.)

### 2. Dynamic Generation
Based on detection, the system generates:
- Data structure optimized for the visualization
- React component with appropriate charting library
- Fully functional UI with filters and interactions

### 3. Supported Visualizations

#### Table
**Triggers**: "table", "list", "show me"
**Example**: "show me a table of manufacturers"
**Features**: Search, pagination, status filters, sortable columns

#### Bar Chart
**Triggers**: "bar chart", "bar graph"
**Example**: "show me a bar chart of manufacturer profits"
**Features**: Compare multiple metrics, status filtering, interactive tooltips

#### Pie Chart
**Triggers**: "pie chart", "pie graph"
**Example**: "show me a pie chart of status distribution"
**Features**: Status distribution, percentage breakdown, color-coded segments

#### Line Chart
**Triggers**: "line chart", "line graph", "trend"
**Example**: "show me a line chart of performance trends"
**Features**: Trend analysis, multiple metrics, status filtering

## Usage Examples

```bash
# Run the agent
node run.js

# Example queries:
"show me a table of manufacturers"
"show me a bar chart of profits"
"show me a pie chart of status"
"show me trends in a line chart"
"bar chart of red manufacturers"
```

## Installation

```bash
# Install dependencies
cd generated-ui
npm install

# The system will auto-install recharts for charts
```

## Architecture

```
User Query
    ↓
Query Analyzer (detectVisualizationType)
    ↓
Data Generator (generateDataCode)
    ↓
Component Generator (generateVisualizationComponent)
    ├── generateTableCode
    ├── generateBarChartCode
    ├── generatePieChartCode
    └── generateLineChartCode
    ↓
React App (Auto-rendered)
```

## No Hardcoded Components
- All UI components are generated on-the-fly
- No pre-built templates
- Fully dynamic based on user intent
- Real-time conversion from query to visualization
