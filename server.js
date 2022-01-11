const db = require("quick.db");
const discord = require("discord.js");
const client = new discord.Client({ disableEveryone: true });
client.login(process.env.Token); //go to https://discord.dev and click on run
const fetch = require("node-fetch");
const fs = require("fs");

setInterval(() => {
  var links = db.get("linkler");
  if (!links) return;
  var linkA = links.map(c => c.url);
  linkA.forEach(link => {
    try {
      fetch(link);
    } catch (e) {
      console.log("Error" + e);
    }
  });
}, 60000);

client.on("ready", () => {
  if (!Array.isArray(db.get("linkler"))) {
    db.set("linkler", []);
  }
});

client.on("ready", () => {
  client.user.setActivity(`up-help | Uptimer Tick`);
  console.log(`Conectado al Bot`);
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == "up-uptime") {
    var link = spl[1];
    fetch(link)
      .then(() => {
        if (
          db
            .get("linkler")
            .map(z => z.url)
            .includes(link)
        )
          return message.channel.send(
            "**⛔ Este proyecto fue registrado anteriormente 😥**"
          );

        let yardım = new Discord.RichEmbed()
          .setAuthor(client.user.username, client.user.avatarURL)
          .setColor(0x6a3db8)
          .setDescription("**✅ Este sitio fue registrado correctamente 😉**")
          .setFooter(`© ${client.user.username}`, client.user.avatarURL)
          .setTimestamp();
        message.channel.send(yardım).then(msg => msg.delete(60000)); //Clears the response after 60000/60 seconds
        db.push("linkler", { url: link, owner: message.author.id });
      })
      .catch(e => {
        let yardım = new Discord.RichEmbed()
          .setAuthor(client.user.username, client.user.avatarURL)
          .setColor(0x6a3db8)
          .setDescription("⛔ **Solo se aceptan URLs en mi base de datos 😥**")
          .setFooter(`© ${client.user.username}`, client.user.avatarURL)
          .setTimestamp();
        return message.channel.send(yardım).then(msg => msg.delete(60000)); //Clears the response after 60000/60 seconds
      });
  }
});

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == "up-total") {
    var link = spl[1];
    message.channel.send(`**${db.get("linkler").length} / 1000**`);
  }
});

const Discord = require("discord.js");

client.on("message", message => {
  if (message.author.bot) return;
  var spl = message.content.split(" ");
  if (spl[0] == "up-help") {
    let embed = new Discord.RichEmbed()
      .setColor("#070706")
      .setDescription(
        `**Comandos**

 🪐 **up-help**  | Muestra todos los comandos (Esta página) 🪐
 
 💎 **up-uptime**  | Monitorea tus bots o proyectos 💎
 
 🧿 **up-total** | Muestra la lista de proyectos en monitoreo 🧿
 
`
      )
      .setAuthor(`Uptimer Tick`, client.user.avatarURL)
      .setFooter(
        `Uptimer Tick`,
        client.user.avatarURL
      );
    return message.channel.send(embed);
  }
});

const log = message => {
  console.log(`${message}`);
};
