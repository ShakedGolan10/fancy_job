const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const simpleGit = require('simple-git');
require('dotenv').config();

(async () => {
  try {
    // Configuration
    const githubToken = process.env.GITHUB_TOKEN;
    const remoteRepo = 'https://github.com/ShakedGolan10/fancy_job.git';
    const branch = 'main';
    const filePath = 'counter.txt';
    const gitUserName = 'ShakedGolan10';
    const gitUserEmail = process.env.EMAIL;

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

    // Step 2: Configure Git user name and email
    await repoGit.addConfig('user.name', gitUserName);
    await repoGit.addConfig('user.email', gitUserEmail);
    console.log(`Configured Git creds"`);

    // Step 3: Check if the file exists and read its contents
    const absoluteFilePath = path.join(tempDir, filePath);
    let currentNumber = 0;
    try {
      const content = await fs.readFile(absoluteFilePath, 'utf-8');
      currentNumber = parseInt(content, 10);
    } catch (err) {
      console.log('File not found or invalid content, initializing with 0.');
    }

    // Step 4: Increment the number and write it back to the file
    const newNumber = currentNumber + 1;
    await fs.writeFile(absoluteFilePath, newNumber.toString(), 'utf-8');
    console.log(`Updated ${filePath} with number: ${newNumber}`);

    // Step 5: Commit and push the changes
    await repoGit.add(filePath);
    const commitMsg = `commit - ${new Date().toLocaleDateString('en-GB')}`;
    await repoGit.commit(commitMsg);
    console.log('Committed changes with message:', commitMsg);

    await repoGit.push('origin', branch);
    console.log('Pushed changes to the remote repository.');

    // Step 6: Clean up by removing the temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
    console.log(`Temporary directory cleaned up: ${tempDir}`);
  } catch (error) {
    console.log('Error during commit and push process:', error);
  }
})();
