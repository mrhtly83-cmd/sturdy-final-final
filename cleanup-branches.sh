#!/bin/bash

# Branch Cleanup Script
# This script removes all branches except 'main' from the remote repository
# Run this script after merging all necessary changes to main

set -e

echo "==================================="
echo "Branch Cleanup Script"
echo "==================================="
echo ""

# Fetch all branches
echo "Fetching all remote branches..."
git fetch --all --prune

echo ""
echo "Current remote branches:"
git branch -r | grep -v '\->' | sed 's/origin\///'
echo ""

# List branches to be deleted (all except main)
# Using mapfile to properly handle branch names with spaces
mapfile -t BRANCHES_TO_DELETE < <(git branch -r | grep -v '\->' | grep -v 'origin/main' | sed 's/origin\///' | sed 's/^[[:space:]]*//')

if [ ${#BRANCHES_TO_DELETE[@]} -eq 0 ]; then
    echo "No branches to delete. Only 'main' branch exists."
    exit 0
fi

echo "The following branches will be deleted:"
for branch in "${BRANCHES_TO_DELETE[@]}"; do
    echo "  - $branch"
done
echo ""

# Ask for confirmation
read -p "Do you want to proceed with deletion? (yes/no): " confirmation

if [ "$confirmation" != "yes" ]; then
    echo "Deletion cancelled."
    exit 0
fi

echo ""
echo "Deleting branches..."

# Delete each branch
for branch in "${BRANCHES_TO_DELETE[@]}"; do
    echo "Deleting branch: $branch"
    git push origin --delete "$branch" || echo "Failed to delete $branch (it may already be deleted)"
done

echo ""
echo "==================================="
echo "Cleanup complete!"
echo "==================================="
echo ""
echo "Remaining branches:"
git ls-remote --heads origin
