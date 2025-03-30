const axios = require("axios");
const fs = require("fs");
const path = require("path");
const os = require("os");

const URL = "https://bhagvad-gita-api.vercel.app";
const PROJECT_ROOT = __dirname;

async function getVerse(chapter, verse) {
  try {
    const params = { chapter, verse };
    const response = await axios.get(`${URL}/verse`, { params });
    return response.data;
  } catch (err) {
    console.error("Error occurred while getting verse data: ", err);
  }
}

async function getAudioData(chapter, verse) {
  try {
    const params = { chapter, verse };
    const response = await axios.get(`${URL}/audio`, {
      params,
      responseType: "arraybuffer", // To handle binary data
    });

    if (response.status === 200) {
      const tempDir = path.join(PROJECT_ROOT, "temp_audio_files");

      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const filePath = path.join(tempDir, `${chapter}-${verse}.mp3`);
      fs.writeFileSync(filePath, Buffer.from(response.data));

      console.log(`Audio saved to ${filePath}`);
      return tempDir;
    } else {
      console.log("Failed to Retrieve Audio.");
      return "";
    }
  } catch (error) {
    console.error("Failed to Retrieve Audio:", error);
  }
}

function deleteAudioData(chapter, verse) {
  try {
    const tempDir = path.join(PROJECT_ROOT, "temp_audio_files");
    const filePath = path.join(tempDir, `${chapter}-${verse}.mp3`);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Audio file ${filePath} deleted.`);
    } else {
      console.log(
        `No audio file found for Chapter ${chapter}, Verse ${verse}.`
      );
    }
  } catch (error) {
    console.error(
      `Error deleting audio file for Chapter ${chapter}, Verse ${verse}:`,
      error
    );
  }
}

module.exports = {
  getVerse,
  getAudioData,
  deleteAudioData,
};
