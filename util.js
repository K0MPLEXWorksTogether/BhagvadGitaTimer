const axios = require("axios");
const { config } = require("dotenv");
config();

const USERNAME = process.env.API_USERNAME;
const PASSWORD = process.env.API_PASSWORD;
const URL = "https://bhagvad-gita-db.vercel.app";

const auth = {
  username: USERNAME,
  password: PASSWORD,
};

async function query(username) {
  try {
    const params = { username };
    const response = await axios.get(`${URL}/query`, { params, auth });

    if (response.status === 200) {
      return response.data.usertype || "";
    } else {
      console.log(`Failed: ${response.status} - ${response.statusText}`);
      return "";
    }
  } catch (error) {
    if (error.response) {
      console.log(
        `Request Failed: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.log("Failed To Query: ", error.message);
    }
    return "";
  }
}

async function tableData(usertype) {
  try {
    const params = { usertype };
    const response = await axios.get(`${URL}/table`, { params, auth });

    if (response.status == 200) {
      return response.data.data || [];
    } else {
      console.log(`Failed: ${response.status} - ${response.statusText}`);
      return "";
    }
  } catch (error) {
    if (error.response) {
      console.log(
        `Request Failed: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.log("Failed To Query: ", error.message);
    }
    return "";
  }
}

async function returnRandomVerse() {
  const versesPerChapter = {
    1: 46,
    2: 71,
    3: 42,
    4: 41,
    5: 28,
    6: 46,
    7: 29,
    8: 27,
    9: 33,
    10: 41,
    11: 54,
    12: 19,
    13: 34,
    14: 26,
    15: 19,
    16: 23,
    17: 27,
    18: 77,
  };

  const randomChapter = Math.floor(Math.random() * 18) + 1;
  const versesForChapter = versesPerChapter[randomChapter];
  const randomVerse = Math.floor(Math.random() * versesForChapter) + 1;
  return [randomChapter, randomVerse];
}

async function getTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const time = `${hours}:${minutes}`;
  return time;
}

function formatVerseMessage(verseData) {
  const originalVerse = `**${verseData.originalVerse || ""}**`;
  const transliteration = verseData.transliteration || "";
  const translation = verseData.translation || "";
  const commentary = verseData.commentary || "";
  const wordMeanings = verseData.wordMeanings || "";

  const message =
    `**Original Verse:**\n${originalVerse}\n\n` +
    `**Transliteration:**\n${transliteration}\n\n` +
    `**Translation:**\n${translation}\n\n` +
    `**Commentary:**\n${commentary}\n\n` +
    `**Word Meanings:**\n${wordMeanings}`;

  return message;
}

module.exports = {
  tableData,
  returnRandomVerse,
  getTime,
  formatVerseMessage
};
