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
config();

const token = process.env.TOKEN;

const url = `https://api.telegram.org/bot${token}/sendMessage`;
const url2 = `https://api.telegram.org/bot${token}/sendAudio`;

async function sendMessage(chatID, message) {
  try {
    const params = {
      chat_id: chatID,
      text: message,
    };
    const response = await axios.post(URL, params);
    console.log("Message sent successfully:", response.data);
  } catch (err) {
    console.error("Error In sendMessage: ", err);
  }
}

async function sendAudio(chatID, audioPath) {
  try {
    const form = new FormData();
    form.append("chat_id", chatID);
    form.append("audio", fs.createReadStream(audioFilePath));

    const response = await axios.post(url, form, {
      headers: form.getHeaders(),
    });
    console.log("Audio sent successfully:", response.data);
  } catch (err) {
    console.error("Error in sendAudio:", err);
  }
}

async function sendRandomMessages() {
  try {
    const randomTableData = await tableData("random");
    for (row of randomTableData) {
      console.log(`Trying for user: ${row["username"]}`);
      if (row["time"] === getTime()) {
        const { chapter, verse } = await returnRandomVerse();
        const data = await getVerse(chapter, verse);
        const message = formatVerseMessage(data);
        const chatID = row["chatId"];

        await sendMessage(chatID, message);

        const audioPath = getAudioData(chapter, verse);
        sendAudio(chatID, audioPath);
        deleteAudioData(chapter, verse);

        console.log(`Message sent for ${row["username"]}.`);
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
