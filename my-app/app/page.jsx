import Image from "next/image";
import { useEffect } from "react";
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const simpleGit = require('simple-git');
export default function Home() {
  useEffect(() => {
    (async () => {
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
          currentNumber = parseInt(content, 10);
    
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
      } catch (error) {
        console.log('Error during commit and push process:', error);
      }
    })();
  
  }, [])
  
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.js
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
