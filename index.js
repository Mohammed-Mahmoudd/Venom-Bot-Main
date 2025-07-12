const { create } = require("venom-bot");
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const PORT = 3000;
let venomClient;

create({
  session: "my-session",
  executablePath:
    "C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
  browserArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
})
  .then((client) => {
    venomClient = client;
    console.log("✅ Venom Bot ready");

    client.onMessage(async (message) => {
      if (!message.isGroupMsg) {
        console.log(`📩 Message from ${message.from}: ${message.body}`);

        try {
          await axios.post(
            "https://hook.eu2.make.com/mccl5hqss4nn36xjljm62upb6ehvtw9n",
            {
              from: message.from,
              body: message.body,
            }
          );
          console.log("✅ Message sent to Make.com");
        } catch (err) {
          console.error("❌ Failed to send message to Make:", err.message);
        }
      }
    });
  })
  .catch((err) => console.error("❌ Venom init error:", err));

app.post("/send-reply", async (req, res) => {
  const { to, message } = req.body;

  try {
    await venomClient.sendText(to, message);
    res.status(200).send({ success: true });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
