# GitHub Deployment Script

This script automatically pushes your local Landlite project to the GitHub repository at squidy-main/Landlite.in. The script supports multiple authentication methods.

## Usage

Run the following command from the root of your project:

```bash
npm run deploy-github
```

## Authentication Options

The script supports three authentication methods:

1. **HTTPS with username/password** - Simple but won't work if you have 2FA enabled
2. **HTTPS with personal access token** - Secure and works with 2FA
3. **SSH** - Most secure, requires SSH key setup

## What This Script Does

1. Helps you choose an authentication method
2. Guides you through configuring Git if needed
3. Initializes a Git repository if one doesn't exist
4. Sets the remote origin to the Landlite GitHub repository
5. Adds all files to Git
6. Allows you to enter a custom commit message
7. Lets you specify which branch to push to
8. Pushes to the GitHub repository
9. Provides detailed troubleshooting if something goes wrong

## Prerequisites

- Git must be installed on your system
- You must have a GitHub account
- You need access to the repository

## Authentication Setup

### Option 1: HTTPS with Username/Password

- Works only if you don't have 2FA enabled
- You'll need your GitHub username and password
- Simple but least secure option

### Option 2: HTTPS with Personal Access Token

1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name, set expiration, and select "repo" permissions
4. Generate and copy the token
5. When prompted for password, paste your token instead

### Option 3: SSH Authentication

1. **Check for existing SSH keys**:
   ```bash
   ls -al ~/.ssh
   ```

2. **Generate a new SSH key** (if needed):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

3. **Add your SSH key to GitHub**:
   - Copy your public key to clipboard
   - Go to GitHub → Settings → SSH and GPG keys → New SSH key
   - Paste your key and save

4. **Test your connection**:
   ```bash
   ssh -T git@github.com
   ```

## Troubleshooting

### HTTPS Issues

- Ensure your username is correct
- If using password authentication with 2FA enabled, you must use a personal access token
- Make sure your token has "repo" permissions
- Try clearing cached credentials:
  ```bash
  git config --global --unset credential.helper
  ```

### SSH Issues

- Test your SSH connection: `ssh -T git@github.com`
- Check that your SSH key is added to the agent: 
  ```bash
  eval "$(ssh-agent -s)"
  ssh-add ~/.ssh/id_ed25519
  ```

### Repository Issues

- Ensure the repository exists on GitHub
- Verify you have correct permissions to push
- Try force pushing if you have conflicts: 
  ```bash
  git push -u origin main --force
  ``` 