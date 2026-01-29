#!/bin/bash

echo "🚀 Installing Dynamic Visualization System..."
echo ""

# Install main dependencies
echo "📦 Installing main dependencies..."
npm install

# Install UI dependencies
echo "📦 Installing UI dependencies (including recharts)..."
cd generated-ui
npm install

echo ""
echo "✅ Installation complete!"
echo ""
echo "🎯 Quick Start:"
echo "   node run.js"
echo ""
echo "📚 Documentation:"
echo "   - QUICKSTART.md - Getting started guide"
echo "   - DYNAMIC_VISUALIZATION.md - System overview"
echo "   - IMPLEMENTATION_SUMMARY.md - Technical details"
echo ""
