#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Default GitHub repository URL (HTTPS)
let GITHUB_REPO = 'https://github.com/squidy-main/Landlite.in.git';

// Create interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to execute shell commands
function runCommand(command) {
    try {
        console.log(`Executing: ${command}`);
        execSync(command, { stdio: 'inherit' });
        return true;
    } catch (error) {
        console.error(`Error executing: ${command}`);
        console.error(error.message);
        return false;
    }
}

// Function to prompt user for input
function prompt(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// The main function that deploys the app to GitHub
async function deploy() {
    try {
        console.log('\n======== GitHub Deployment Script ========\n');
        
        // Let user choose the authentication method
        console.log('Authentication options:');
        console.log('1. HTTPS (username/password)');
        console.log('2. HTTPS (personal access token)');
        console.log('3. SSH (requires SSH keys)');
        
        const authChoice = await prompt('\nChoose authentication method (1-3): ');
        
        if (authChoice === '3') {
            GITHUB_REPO = 'git@github.com:squidy-main/Landlite.in.git';
            console.log('\nUsing SSH authentication with URL: ' + GITHUB_REPO);
        } else {
            GITHUB_REPO = 'https://github.com/squidy-main/Landlite.in.git';
            
            if (authChoice === '1') {
                console.log('\nUsing regular HTTPS authentication with username/password');
                console.log('Note: If you have 2FA enabled on GitHub, password authentication will not work.');
            } else {
                console.log('\nUsing HTTPS authentication with personal access token');
                console.log('You will need to use your token instead of password when prompted.');
            }
        }
        
        console.log('\nBefore continuing, please make sure:');
        console.log('1. You have a GitHub account');
        console.log('2. You have access to the repository');
        console.log('3. You have Git installed on your computer');

        const proceed = await prompt('\nDo you want to continue? (y/n): ');
        if (proceed.toLowerCase() !== 'y') {
            console.log('Deployment cancelled.');
            rl.close();
            return;
        }

        // Configure Git if needed
        console.log('\n--- Configuring Git ---');
        let userName;
        let userEmail;
        
        try {
            userName = execSync('git config user.name').toString().trim();
            console.log(`Current Git username: ${userName}`);
        } catch (e) {
            console.log('Git username not configured.');
            userName = await prompt('Enter your GitHub username: ');
            runCommand(`git config --global user.name "${userName}"`);
        }
        
        try {
            userEmail = execSync('git config user.email').toString().trim();
            console.log(`Current Git email: ${userEmail}`);
        } catch (e) {
            console.log('Git email not configured.');
            userEmail = await prompt('Enter your GitHub email: ');
            runCommand(`git config --global user.email "${userEmail}"`);
        }

        // If using HTTPS, configure credential helper to cache credentials
        if (authChoice === '1' || authChoice === '2') {
            console.log('\n--- Setting up credential helper ---');
            runCommand('git config --global credential.helper cache');
            console.log('Credentials will be cached for 15 minutes by default');
        }

        // Check if .git directory exists
        const gitDir = path.join(process.cwd(), '.git');
        const isGitRepository = fs.existsSync(gitDir);

        if (!isGitRepository) {
            console.log('\n--- Initializing Git Repository ---');
            runCommand('git init');
            runCommand(`git remote add origin ${GITHUB_REPO}`);
        } else {
            // Check if the remote is already set up correctly
            let hasRemote = false;
            
            try {
                const remote = execSync('git remote -v').toString();
                hasRemote = remote.includes('origin');
                
                if (hasRemote) {
                    console.log('\n--- Updating Remote URL ---');
                    runCommand(`git remote set-url origin ${GITHUB_REPO}`);
                }
            } catch (e) {
                console.log('Error checking remotes: ' + e.message);
            }
            
            if (!hasRemote) {
                console.log('\n--- Setting Up Remote ---');
                runCommand(`git remote add origin ${GITHUB_REPO}`);
            }
        }

        // Add all files
        console.log('\n--- Adding Files to Git ---');
        runCommand('git add .');

        // Commit changes
        console.log('\n--- Committing Changes ---');
        const commitMessage = await prompt('Enter a commit message (or press Enter for default): ');
        runCommand(`git commit -m "${commitMessage || 'Automatic deployment from script'}"`);

        // Push to GitHub
        console.log('\n--- Pushing to GitHub ---');
        
        if (authChoice === '1') {
            console.log('You will be prompted for your GitHub username and password.');
        } else if (authChoice === '2') {
            console.log('You will be prompted for your GitHub username and personal access token.');
            console.log('Use your token instead of password when prompted.');
        } else {
            console.log('Using SSH authentication to connect to GitHub.');
        }
        
        const branch = await prompt('Enter branch name to push to (default: main): ');
        const branchName = branch || 'main';
        
        const pushResult = runCommand(`git push -u origin ${branchName}`);
        
        if (!pushResult) {
            console.log('\n===== TROUBLESHOOTING =====');
            
            if (authChoice === '1' || authChoice === '2') {
                console.log('1. For HTTPS authentication issues:');
                console.log('   - Make sure your username is correct');
                console.log('   - If using password and have 2FA enabled, you must use a personal access token');
                console.log('   - Generate a token at: https://github.com/settings/tokens');
                console.log('   - Ensure token has "repo" permissions');
                
                // Try to clear any cached credentials
                console.log('\n--- Clearing cached credentials ---');
                runCommand('git config --global --unset credential.helper');
            } else {
                console.log('1. For SSH authentication issues:');
                console.log('   - Verify your SSH key is set up correctly');
                console.log('   - Test with: ssh -T git@github.com');
            }
            
            console.log('\n2. Repository issues:');
            console.log('   - Ensure the repository exists on GitHub');
            console.log('   - Verify you have correct permissions to push to the repository');
            
            const tryForce = await prompt('\nWould you like to try pushing again with the --force flag? (y/n): ');
            if (tryForce.toLowerCase() === 'y') {
                console.log('\n--- Trying force push ---');
                runCommand(`git push -u origin ${branchName} --force`);
            }
            
            const switchAuth = await prompt('\nWould you like to try with a different authentication method? (y/n): ');
            if (switchAuth.toLowerCase() === 'y') {
                // Close and restart the script
                console.log('\nPlease run the script again and select a different authentication method.');
            }
        } else {
            console.log('\nSuccessfully pushed to GitHub repository!');
        }

    } catch (error) {
        console.error('\nDeployment failed:');
        console.error(error.message);
    } finally {
        rl.close();
    }
}

// Run the deployment
deploy(); 