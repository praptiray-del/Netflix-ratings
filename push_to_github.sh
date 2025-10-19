#!/bin/bash

echo "🚀 Pushing Netflix IMDb Finder to GitHub..."
echo ""
echo "Repository: https://github.com/praptiray-del/Netflix-ratings"
echo ""
echo "You will be prompted for your GitHub credentials:"
echo "  Username: praptiray-del"
echo "  Password: Use your GitHub Personal Access Token (NOT your password)"
echo ""
echo "Don't have a token? Get one here: https://github.com/settings/tokens/new"
echo "  - Select scope: 'repo' (Full control of private repositories)"
echo ""
read -p "Press Enter to continue..."

git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Success! Your code has been pushed to GitHub!"
    echo ""
    echo "View your repository: https://github.com/praptiray-del/Netflix-ratings"
    echo ""
    echo "Next step: Deploy to Render"
    echo "See RENDER_DEPLOYMENT.md for instructions"
else
    echo ""
    echo "❌ Push failed. Common solutions:"
    echo "  1. Make sure you're using a Personal Access Token, not your password"
    echo "  2. Token must have 'repo' scope enabled"
    echo "  3. Verify repository exists: https://github.com/praptiray-del/Netflix-ratings"
fi
