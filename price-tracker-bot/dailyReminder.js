function dailyRemainder() {}
if (process.env.NODE_ENV === "development") require("dotenv").config();

const http = require("http");

const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN);

const mongoose = require("mongoose");
const User = require("./schema");

const createImage = require("./createImage");

mongoose.connect(
  `mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0.c81al.mongodb.net/price-tracker?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log(err);
    else console.log("Connection to DB successful!");
  }
);

client.on("ready", () => {
  User.find((err, users) => {
    if (err) console.log(err);
    users.map(async (user) => {
      const currentuser = await client.users.fetch(user._id);
      user.wishlist.map((urlreq) => {
        const postData = JSON.stringify({ url: urlreq });

        const options = {
          baseUrl: "http://localhost",
          port: 5000,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(postData),
          },
        };

        const req = http.request(options, (res) => {
          var data = "";
          res.setEncoding("utf8");

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.once("end", async () => {
            itemRes = JSON.parse(data);
            const stream = await createImage(itemRes);
            const attachment = new Discord.MessageAttachment(
              stream,
              "image.jpeg"
            );
            currentuser.send(attachment);
          });
        });
        req.write(postData);
      });
    });
  });
});
