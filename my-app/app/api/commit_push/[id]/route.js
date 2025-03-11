import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import simpleGit from 'simple-git';


export async function GET(req) {
  try {
    const githubToken = process.env.GITHUB_TOKEN;
    const remoteRepo = 'https://github.com/ShakedGolan10/fancy_job.git';
    const branch = 'main';
    const filePath = 'counter.txt';
    const gitUserName = 'ShakedGolan10';
    const gitUserEmail = process.env.EMAIL;

    const tempDir = path.join(os.tmpdir(), `repo-${Date.now()}`);
    console.log(`Cloning repository into temporary directory: ${tempDir}`);
    const git = simpleGit();

    const remoteWithToken = remoteRepo.replace(
      'https://',
      `https://${githubToken}@`
    );

    await git.clone(remoteWithToken, tempDir);
    const repoGit = simpleGit(tempDir);

    await repoGit.addConfig('user.name', gitUserName);
    await repoGit.addConfig('user.email', gitUserEmail);
    console.log(`Configured Git creds`);

    const absoluteFilePath = path.join(tempDir, filePath);
    let currentNumber = 0;
    const content = Math.random() * 1000
    currentNumber = parseInt(content.toString(), 10);

    const newNumber = currentNumber + 1;
    await fs.writeFile(absoluteFilePath, newNumber.toString(), 'utf-8');
    console.log(`Updated ${filePath} with number: ${newNumber}`);

    await repoGit.add(filePath);
    const commitMsg = `commit - ${new Date().toLocaleDateString('en-GB')}`;
    await repoGit.commit(commitMsg);
    console.log('Committed changes with message:', commitMsg);

    await repoGit.push('origin', branch);
    console.log('Pushed changes to the remote repository.');

    await fs.rm(tempDir, { recursive: true, force: true });
    console.log(`Temporary directory cleaned up: ${tempDir}`);
    return NextResponse.json('Sucess!', { status: 200 })

  } catch (error) {
    console.log('Error during commit and push process:', error);
    return new NextResponse(`${error}`, { status: 200 })
  }
}





