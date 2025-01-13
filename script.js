const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const { exec } = require('child_process');
const simpleGit = require('simple-git');
require('dotenv').config(); // Load environment variables from .env file

(async () => {
  try {
    // Configuration
    const githubToken = process.env.GITHUB_TOKEN; // GitHub Personal Access Token from .env
    const remoteRepo = 'https://github.com/ShakedGolan10/fancy_job'; // Repository URL
    const branch = 'main'; // Branch to push changes to
    const filePath = 'counter.txt'; // File to update

    // Step 1: Create a temporary directory to clone the repo
    const tempDir = path.join(os.tmpdir(), `repo-${Date.now()}`);
    console.log(`Cloning repository into temporary directory: ${tempDir}`);
    const git = simpleGit();

    const remoteWithToken = remoteRepo.replace(
      'https://',
      `https://${githubToken}@`
    );

    await git.clone(remoteWithToken, tempDir);
    const repoGit = simpleGit(tempDir);

    // Step 2: Check if the file exists and read its contents
    const absoluteFilePath = path.join(tempDir, filePath);
    let currentNumber = 0;
    try {
      const content = await fs.readFile(absoluteFilePath, 'utf-8');
      currentNumber = parseInt(content, 10);
    } catch (err) {
      console.log('File not found or invalid content, initializing with 0.');
    }

    // Step 3: Increment the number and write it back to the file
    const newNumber = currentNumber + 1;
    await fs.writeFile(absoluteFilePath, newNumber.toString(), 'utf-8');
    console.log(`Updated ${filePath} with number: ${newNumber}`);

    // Step 4: Commit and push the changes
    await repoGit.add(filePath);
    const commitMsg = `commit - ${new Date().toLocaleDateString('en-GB')}`;
    await repoGit.commit(commitMsg);
    console.log('Committed changes with message:', commitMsg);

    await repoGit.push('origin', branch);
    console.log('Pushed changes to the remote repository.');

    // Step 5: Clean up by removing the temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  } catch (error) {
    console.error('Error during commit and push process:', error);
  }
})();
