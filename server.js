const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/api/download", async (req, res) => {
  const { url, format } = req.body;
  if (!url || !format) return res.status(400).json({ error: "Missing data" });

  const output = `video_${Date.now()}.${format}`;
  const filePath = path.join(__dirname, output);

  const audioCmd = `yt-dlp -f "bestaudio[ext=m4a]/best" --extract-audio --audio-format ${format} -o ${output} ${url}`;
  const videoCmd = `yt-dlp -f bestvideo+bestaudio --merge-output-format ${format} -o ${output} ${url}`;

  const finalCmd = format === "mp3" || format === "m4a" ? audioCmd : videoCmd;

  exec(finalCmd, { cwd: __dirname }, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: "Download failed" });

    res.download(filePath, output, (err) => {
      if (err) console.error("Send error:", err);
      fs.unlink(filePath, () => {});
    });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));