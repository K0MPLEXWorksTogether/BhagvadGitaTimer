const {
  tableData,
  returnRandomVerse,
  getTime,
  formatVerseMessage,
} = require("./util");
const { getVerse, getAudioData, deleteAudioData } = require("./interactor");
const axios = require("axios");
const { config } = require("dotenv");
const FormData = require("form-data");
const fs = require("fs");
config();

const token = process.env.TOKEN;

const url = `https://api.telegram.org/bot${token}/sendMessage`;
const url2 = `https://api.telegram.org/bot${token}/sendAudio`;

async function sendMessage(chatID, message) {
  try {
    const params = {
      chat_id: chatID,
      text: message,
      parse_mode: "",
    };
    const response = await axios.post(url, params);
    console.log("Message sent successfully.");
  } catch (err) {
    console.error("Error In sendMessage: ", err);
  }
}

async function sendAudio(chatID, audioPath) {
  try {
    const form = new FormData();
    form.append("chat_id", chatID);
    form.append("audio", fs.createReadStream(audioPath));

    const response = await axios.post(url2, form, {
      headers: form.getHeaders(),
    });
    console.log("Audio sent successfully");
  } catch (err) {
    console.error("Error in sendAudio:", err);
  }
}

async function sendRandomMessages() {
  try {
    const randomTableData = await tableData("random");
    const currentTime = await getTime();
    for (row of randomTableData) {
      console.log(`${await getTime()}: Trying for user: ${row["username"]}`);
      console.log(
        `Scheduled Time: ${row["time"]} | Current Time: ${currentTime}`
      );
      if (row["time"] === currentTime) {
        const chapterAndVerse = await returnRandomVerse();
        const chapter = chapterAndVerse[0];
        const verse = chapterAndVerse[1];
        const data = await getVerse(chapter, verse);
        const message = formatVerseMessage(data);
        const chatID = row["chatId"];

        await sendMessage(chatID, message);

        const audioPath = await getAudioData(chapter, verse);
        await sendAudio(chatID, audioPath);
        deleteAudioData(chapter, verse);

        console.log(`Message sent for ${row["username"]}.`);
      } else {
        console.log("Not the time.");
      }
    }
  } catch (err) {
    console.error("Error in sendRandomMessages: ", err);
  }
}

async function main() {
  await sendRandomMessages();
}

main();
