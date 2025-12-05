#!/bin/bash

# Use provided commit message or fallback to default
COMMIT_MSG="${1:-new commit}"

echo "Adding files..."
git add .

echo "Committing with message: \"$COMMIT_MSG\""
git commit -m "$COMMIT_MSG"

echo "Ensuring branch is main..."
git branch -M main

echo "Adding remote (ignored if it already exists)..."
git remote add origin https://github.com/edensway/tools.git 2>/dev/null

echo "Pushing..."
git push -u origin main

echo "Deploying..."
npm run deploy

echo "Done!"