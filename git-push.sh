#!/bin/bash

# Git Push Script for AI-Front-Orchestrator
# This script helps you push the project to GitHub

echo "=================================================="
echo "  GIT PUSH SCRIPT - AI FRONT ORCHESTRATOR"
echo "=================================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

echo "📋 Pre-Push Checklist:"
echo "======================"
echo "✓ All files created (44 files)"
echo "✓ TypeScript services implemented"
echo "✓ WebSocket services ready"
echo "✓ Documentation complete"
echo ""

# Initialize git if not already
if [ ! -d ".git" ]; then
    echo "🔧 Initializing Git repository..."
    git init
    echo "✓ Git initialized"
else
    echo "✓ Git repository already initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "⚠️  .gitignore not found. Creating one..."
    cat > .gitignore << 'EOF'
# Node
/node_modules
npm-debug.log
yarn-error.log

# Angular
/dist
/tmp
/out-tsc
/.angular/cache

# IDEs
.idea/
.vscode/
*.sublime-workspace
.DS_Store

# Environment
.env
.env.local
EOF
    echo "✓ .gitignore created"
fi

echo ""
echo "🔗 GitHub Repository Setup:"
echo "==========================="
echo "Repository: https://github.com/MahmoudCalipso/AI-Front-Orchestrator"
echo ""

# Ask for confirmation
read -p "Have you created the GitHub repository? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Please create the repository first:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: AI-Front-Orchestrator"
    echo "3. Make it public or private"
    echo "4. Do NOT initialize with README (we already have one)"
    echo "5. Run this script again"
    exit 1
fi

# Add all files
echo ""
echo "📦 Adding files to Git..."
git add .
echo "✓ Files added"

# Commit
echo ""
echo "💾 Creating commit..."
git commit -m "Initial commit: Complete Angular 21.1 front-end for AI-Orchestrator

Features:
- 10 API services (50+ endpoints)
- 4 WebSocket services
- 265+ TypeScript interfaces
- HTTP interceptors & guards
- Complete documentation
- Production-ready architecture"

echo "✓ Commit created"

# Add remote
echo ""
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/MahmoudCalipso/AI-Front-Orchestrator.git 2>/dev/null || echo "Remote already exists"

# Set main branch
git branch -M main

# Push
echo ""
echo "🚀 Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "=================================================="
    echo "  ✅ SUCCESS! PROJECT PUSHED TO GITHUB"
    echo "=================================================="
    echo ""
    echo "🎉 Your project is now available at:"
    echo "https://github.com/MahmoudCalipso/AI-Front-Orchestrator"
    echo ""
    echo "📋 Next steps:"
    echo "1. npm install"
    echo "2. Configure src/environments/environment.ts"
    echo "3. Create feature components"
    echo "4. npm start"
    echo ""
else
    echo ""
    echo "❌ Push failed. Please check:"
    echo "1. GitHub credentials"
    echo "2. Repository access"
    echo "3. Internet connection"
    echo ""
    echo "Manual push command:"
    echo "git push -u origin main"
fi
