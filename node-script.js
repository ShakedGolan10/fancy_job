#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const scriptDir = __dirname;

const GIT_REPO = 'https://github.com/ShakedGolan10/fancy_job'; // GitHub Repository URL
const GIT_USERNAME = 'ShakedGolan10'; // Git Username (to access repo)
const GIT_TOKEN = process.env.GIT_TOKEN;     // Git Personal Access Token (for auth)

// Change to the script's directory
process.chdir(scriptDir);

function readNumber() {
    const filePath = path.join(scriptDir, "number.txt");
    return parseInt(fs.readFileSync(filePath, "utf-8").trim(), 10);
}

function writeNumber(num) {
    const filePath = path.join(scriptDir, "number.txt");
    fs.writeFileSync(filePath, num.toString());
}

function gitCommit() {
    try {
        // Stage the changes
        execSync("git add number.txt");

        // Create a commit with the current date
        const date = new Date().toISOString().split("T")[0];
        const commitMessage = `Update number: ${date}`;

        // Using Git credentials
        execSync(`git commit -m "${commitMessage}"`, {
            env: {
                ...process.env,
                GIT_USERNAME,
                GIT_TOKEN
            }
        });
    } catch (error) {
        console.error("Error committing changes:", error.message);
    }
}

function gitPush() {
    try {
        // Push to the GitHub repo
        execSync("git push", {
            env: {
                ...process.env,
                GIT_USERNAME,
                GIT_TOKEN
            }
        });
        console.log("Changes pushed to GitHub successfully.");
    } catch (error) {
        console.error("Error pushing to GitHub:", error.message);
    }
}

function updateCronWithRandomTime() {
    try {
        const randomHour = Math.floor(Math.random() * 24); // 0-23
        const randomMinute = Math.floor(Math.random() * 60); // 0-59

        const cronCommand = `${randomMinute} ${randomHour} * * * cd ${scriptDir} && node ${path.join(
            scriptDir,
            "node-script.js"
        )}\n`;

        // Get the current crontab
        const cronFile = "/tmp/current_cron";
        execSync(`crontab -l > ${cronFile} 2>/dev/null || true`);

        // Read and update the crontab file
        const lines = fs.readFileSync(cronFile, "utf-8").split("\n");
        const updatedLines = lines.filter(
            (line) => !line.includes("node-script.js")
        );
        updatedLines.push(cronCommand);

        fs.writeFileSync(cronFile, updatedLines.join("\n"));
        execSync(`crontab ${cronFile}`);
        fs.unlinkSync(cronFile);

        console.log(
            `Cron job updated to run at ${randomHour}:${randomMinute} tomorrow.`
        );
    } catch (error) {
        console.error("Error updating cron job:", error.message);
    }
}

function main() {
    try {
        const currentNumber = readNumber();
        const newNumber = currentNumber + 1;
        writeNumber(newNumber);
        gitCommit();
        gitPush();
        updateCronWithRandomTime();
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

main();
