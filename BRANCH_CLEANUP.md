# Branch Cleanup Instructions

## Objective
Keep only the `main` branch and remove all other branches from the repository.

## Current Branch Status
As of the last check, the following branches exist:
- `main` (to be kept)
- `copilot/fix-vercel-deployment-issues` (to be deleted)
- `copilot/remove-other-branches` (current PR branch, to be deleted after merge)

## Cleanup Steps

### After Merging This PR to Main

1. **Delete the `copilot/fix-vercel-deployment-issues` branch:**
   ```bash
   git push origin --delete copilot/fix-vercel-deployment-issues
   ```

2. **Delete the `copilot/remove-other-branches` branch (this PR's branch):**
   ```bash
   git push origin --delete copilot/remove-other-branches
   ```

### Verification

After deletion, verify that only `main` branch remains:
```bash
git ls-remote --heads origin
```

Expected output should show only:
```
<commit-hash>  refs/heads/main
```

## Automated Cleanup (Optional)

To prevent accumulation of stale branches in the future, consider:
1. Enabling branch protection rules for `main`
2. Setting up automatic branch deletion after PR merge in repository settings
3. Implementing a branch cleanup policy

## Notes
- Ensure all important changes from other branches are merged to `main` before deletion
- Branch deletion is permanent and cannot be undone easily
- Local branches on developer machines will need to be cleaned up separately using `git branch -d <branch-name>`
