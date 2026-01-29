#!/bin/bash

echo "🧪 Testing Dynamic Visualization System"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Dependencies not installed. Run ./install.sh first"
    exit 1
fi

if [ ! -d "generated-ui/node_modules" ]; then
    echo "❌ UI dependencies not installed. Run ./install.sh first"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Check if recharts is installed
if grep -q "recharts" generated-ui/package.json; then
    echo "✅ Recharts library configured"
else
    echo "❌ Recharts not found in package.json"
    exit 1
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "🎯 Ready to test. Try these commands:"
echo ""
echo "   node run.js"
echo "   > show me a table of manufacturers"
echo ""
echo "   node run.js"
echo "   > show me a bar chart of profits"
echo ""
echo "   node run.js"
echo "   > show me a pie chart of status"
echo ""
echo "   node run.js"
echo "   > show me a line chart of trends"
echo ""
