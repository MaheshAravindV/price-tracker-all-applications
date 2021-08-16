if (process.env.NODE_ENV == "development") require("dotenv").config();

const http = require("http");

const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.BOTTOKEN);

const createImage = require("./createImage");
const { resolve } = require("path");

async function makeEmbed(urlreq) {
  const postData = JSON.stringify({ url: urlreq });
  const options = {
    host: process.env.APIURL,
    port: 5000,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      var data = "";
      res.setEncoding("utf8");

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.once("end", async () => {
        itemRes = JSON.parse(data);
        const stream = await createImage(itemRes);
        const itemtitle = urlreq.split("/")[3];
        const attachment = new Discord.MessageAttachment(stream, "image.jpg");
        const embed = new Discord.MessageEmbed({
          title: itemtitle,
          url: urlreq,
        });
        resolve({ attachment, embed });
      });
    });
    req.write(postData);
  });
}

module.exports = makeEmbed;
