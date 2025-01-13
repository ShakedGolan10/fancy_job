const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

// Trigger the Git update script
app.get("/commit_push", (req, res) => {
    exec("node script.js", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${stderr}`);
            return res.status(500).send("Failed to update number.");
        }
        console.log(stdout);
        res.send("Number updated and pushed to GitHub!");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});