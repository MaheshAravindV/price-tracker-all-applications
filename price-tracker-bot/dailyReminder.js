if (process.env.NODE_ENV == "development") require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();
client.login(process.env.BOTTOKEN);

const mongoose = require("mongoose");
const User = require("./schema");

const makeEmbed = require("./embedMaker");

mongoose.connect(
  `mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0.c81al.mongodb.net/price-tracker?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log(err);
    else console.log("Connection to DB successful!");
  }
);

function dailyReminder() {
  const today =
    "**" +
    new Date().getDate() +
    "/" +
    (new Date().getMonth() + 1) +
    "/" +
    new Date().getFullYear() +
    "**";
  User.find((err, users) => {
    if (err) console.log(err);
    users.map(async (user) => {
      const currentuser = await client.users.fetch(user._id);
      currentuser.send(today);
      currentuser.send(`**Hello, Let's see how your wishlist is doing today**`);
      user.wishlist.map(async (urlreq) => {
        const { embed, attachment } = await makeEmbed(urlreq);
        currentuser.send(embed);
        currentuser.send(attachment);
      });
    });
  });
}

module.exports = dailyReminder;
