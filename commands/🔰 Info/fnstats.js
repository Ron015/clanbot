const Discord = require("discord.js");
const Canvas = require("discord-canvas");
const {
  MessageEmbed
} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  GetUser,
  GetGlobalUser,
  handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "fnstats",
  aliases: ["fortnitestats", "fstats"],
  category: "🔰 Info",
  description: "Shows the Fortnite Stats of a User",
  usage: "fnstats <platform> <Epic>",
  type: "games",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      if(!args[0] || !args[1]) return message.reply("Please enter a Epic Games name!\n>Usage: `fnstats <platform> <Epic>`")
      let Epic = args.slice(1).join(" ");
      if(!Epic) return message.reply("Please enter a Epic Games name!\n>Usage: `fnstats <platform> <Epic>`")
      let platform = String(args[0]).toLowerCase() || "PC".toLowerCase();
      if (platform !== "pc" && platform !== "xbl" && platform !== "psn") return message.channel.send("Please enter a valid platform\n> Valid Platforms: `xbl, psn, pc`\n> Usage: `fnstats <platform> <Epic>`")
      
      try{
        let themsg = await message.reply(`<a:Loading:833101350623117342> Getting the Fortnite Stats of ${Epic}`)
        const stats = new Canvas.FortniteStats()
        const image = await stats.setToken("e032828b-886d-4ed6-9aa1-0e2e725592a8")
          .setUser(Epic)
          .setPlatform(platform.toLowerCase())
          .toAttachment();
        if (!image) return message.channel.send("User not found / Epic INvalid")
        let attachment = new Discord.MessageAttachment(image.toBuffer(), "FortniteStats.png");
        themsg.edit({content: `Stats of: \`${Epic}\` on \`${platform}\``, files: [attachment]});
      }catch (e){
        console.log(e.stack ? String(e.stack).grey : String(e).grey)
        message.channel.send("EPIC INVALID")
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(es.footertext, es.footericon)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["avatar"]["variable1"]))
      ]});
    }
  }
}
/*
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */
