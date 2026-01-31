#!/bin/bash

echo "Cleaning up for deployment..."

# Clear large folders that shouldn't be in production
rm -rf backups/* 2>/dev/null
rm -rf logs/* 2>/dev/null
echo "Cleared backups and logs folders"

# Remove dev dependencies (safer approach)
npm prune --production 2>/dev/null || true

# Safe cleanup: only remove documentation files (not .ts which may be needed at runtime)
find node_modules -type f -name "*.md" -delete 2>/dev/null
find node_modules -type f -name "*.markdown" -delete 2>/dev/null
find node_modules -type f -name "LICENSE*" -delete 2>/dev/null
find node_modules -type f -name "CHANGELOG*" -delete 2>/dev/null
find node_modules -type f -name "README*" -delete 2>/dev/null

# Remove test directories only
find node_modules -type d -name "__tests__" -exec rm -rf {} + 2>/dev/null
find node_modules -type d -name ".github" -exec rm -rf {} + 2>/dev/null

# Remove unused platform-specific binaries from sharp (keep linux-x64 for production)
find node_modules/@img -type d ! -name "sharp-linux-x64" ! -name "@img" -exec rm -rf {} + 2>/dev/null

echo "Cleanup complete!"
du -sh node_modules/ 2>/dev/null || echo "node_modules size check skipped"
