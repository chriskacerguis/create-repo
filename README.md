# Create GitHub Repo and Assign Team

A GitHub Action to create a repository and assign a team with write access.

## Inputs

### `repo`

**Required** The name of the repository to create.

### `team`

**Required** The slug of the team to add with write access.

## Outputs

No outputs.

## Example Usage

```yaml
name: Create GitHub Repo and Assign Team

on:
  workflow_dispatch:
    inputs:
      repo:
        description: 'Repository name'
        required: true
        type: string
        default: 'my-new-repo'
      team:
        description: 'Team slug'
        required: true
        type: string
        default: 'my-team'

jobs:
  create-repo:
    runs-on: ubuntu-latest
    steps:
      - name: Use Create Repo Action
        uses: your-username/your-repo@v1
        with:
          repo: ${{ github.event.inputs.repo }}
          team: ${{ github.event.inputs.team }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          ORG_NAME: ${{ secrets.ORG_NAME }}
