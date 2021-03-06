const Discord = require("discord.js");
const client = new Discord.Client();

const dailyReminder = require("./dailyReminder");
const Cronjob = require("cron").CronJob;
new Cronjob("0 30 3 * * *", dailyReminder).start();

const makeEmbed = require("./embedMaker");

const mongoose = require("mongoose");
if (process.env.NODE_ENV === "development") require("dotenv").config();
const User = require("./schema");

mongoose.connect(
  `mongodb+srv://${process.env.UNAME}:${process.env.PASS}@cluster0.c81al.mongodb.net/price-tracker?retryWrites=true&w=majority`,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (err) console.log(err);
    else console.log("Connection to DB successful!");
  }
);

const withHttp = (url) =>
  url.replace(/^(?:(.*:)?\/\/)?(.*)/i, (match, schemma, nonSchemmaUrl) =>
    schemma ? match : `http://${nonSchemmaUrl}`
  );

client.login(process.env.BOTTOKEN);

client.on("message", async (msg) => {
  if (msg.author.bot) return;
  let currentUser = await User.findById(msg.author.id);
  if (currentUser == null) {
    currentUser = new User({
      _id: msg.author.id,
      wishlist: [],
    });
    await currentUser.save();
    msg.reply(
      "Hello, glad to see you here! To get started use the help command!"
    );
  }
  command = msg.content.split(" ");
  if (command[0] === "ping") msg.reply("pong");
  else if (command[0] === "help" || command[0] === "h") {
    //Do documentation later
  } else if (command[0] === "add") {
    url = command[1];
    if (url) {
      if (currentUser.wishlist.includes(url)) {
        msg.reply("Item already exists in your wishlist");
      } else {
        if (
          ["www.flipkart.com", "www.amazon.com"].includes(
            new URL(withHttp(url)).host
          )
        ) {
          currentUser.wishlist.push(url);
          msg.reply("Added to your wishlist");
        } else
          msg.reply("Sorry, only flipkart and amazon supported at the moment.");
      }
    } else msg.reply("URL is a required argument");
    currentUser.save();
  } else if (command[0] === "wishlist") {
    wishlist = currentUser.wishlist;
    if (!wishlist.length)
      msg.reply(
        "You havent added any items to your wishlist yet. Add items using the add command!"
      );
    wishlist.forEach(async (item) => {
      const { embed, attachment } = await makeEmbed(item);
      msg.reply(embed);
      msg.reply(attachment);
    });
  } else if (command[0] === "remove") {
    wishlist = currentUser.wishlist;
    wishlist;
  }
});
