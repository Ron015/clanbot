var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const fs = require('fs');
var {
  databasing,
  isValidURL
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
  name: "setup-owner",
  category: "👑 Owner",
  aliases: ["setup-owners", "setupowner", "setupowners"],
  cooldown: 5,
  type: "info",
  usage: "setup-owner  -->  Follow the Steps",
  description: "Change the Bot Owners",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if (!config.ownerIDS.some(r => r.includes(message.author.id)))
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable1"]))
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable2"]))
      ]});
    try {
      
      var timeouterror = false;
      var filter = (reaction, user) => {
        return user.id === message.author.id;
      };
      var temptype = ""
      var tempmsg;

      tempmsg = await message.channel.send({embeds: [new MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable3"]))
        .setColor(es.color)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable4"])).setFooter(es.footertext, es.footericon)
      ]})

      try {
        tempmsg.react("1️⃣")
        tempmsg.react("📑")
      } catch (e) {
        return message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable5"]))
          .setColor(es.wrongcolor)
          .setDescription(`\`\`\` ${e.message ? e.message : e.stack ? String(e.stack).dim.substr(0, 2000) : String(e).dim.substr(0, 2000)}\`\`\``.substr(0, 2000))
          .setFooter(es.footertext, es.footericon)
        ]});
      }
      await tempmsg.awaitReactions({filter, 
          max: 1,
          time: 90000,
          errors: ["time"]
        })
        .then(collected => {
          var reaction = collected.first()
          reaction.users.remove(message.author.id)
          if (reaction.emoji?.name === "1️⃣") temptype = "add"
          else if (reaction.emoji?.name === "📑") temptype = "thesettings"
          else throw "You reacted with a wrong emoji"

        })
        .catch(e => {
          timeouterror = e;
        })
      if (timeouterror)
        return message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable6"]))
          .setColor(es.wrongcolor)
          .setDescription(`\`\`\`${String(JSON.stringify(timeouterror)).substr(0, 2000)}\`\`\``.substr(0, 2000))
          .setFooter(es.footertext, es.footericon)
        ]});

        if (temptype == "add") {

          tempmsg = await tempmsg.edit({embeds: [new Discord.MessageEmbed()
            .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable7"]))
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
            .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable8"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
              max: 1,
              time: 90000,
              errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var user = message.mentions.users.first();
              if (user) {
                if (config.ownerIDS.includes(user.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable9"]))
                  .setColor(es.wrongcolor)
                  .setFooter(es.footertext, es.footericon)
                ]});
                try {
                  let status = config
                  status.ownerIDS.push(user.id);
                  fs.writeFile(`./botconfig/config.json`, JSON.stringify(status, null, 3), (e) => {
                    if (e) {
                      console.log(e.stack ? String(e.stack).dim : String(e).dim);
                      return message.channel.send({embeds: [new MessageEmbed()
                        .setFooter(es.footertext, es.footericon)
                        .setColor(es.wrongcolor)
                        .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable10"]))
                        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable11"]))
                      ]})
                    }
                    return message.channel.send({embeds: [new MessageEmbed()
                      .setFooter(es.footertext, es.footericon)
                      .setColor(es.color)
                      .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable12"]))
                    ]})
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable13"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable14"]))
                    .setFooter(es.footertext, es.footericon)
                  ]});
                }
              } else {
                throw "you didn't ping a valid Role"
              }
            })
            .catch(e => {
              timeouterror = e;
            })
          if (timeouterror)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable15"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
              .setFooter(es.footertext, es.footericon)
            ]});
  
        } else if (temptype == "thesettings") {
          
          var embed = new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable16"]))
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
          .setDescription(`${`<@${config.ownerIDS.join(">, <@")}>`}`.substr(0, 2048))
          .setFooter(es.footertext, es.footericon)
  
          return message.reply({embeds: [embed]});
        } else {
        return message.reply({embeds: [new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable17"]))
          .setColor(es.wrongcolor)
          .setFooter(es.footertext, es.footericon)
        ]});
      }

    } catch (e) {
      console.log(String(e.stack).dim.bgRed)
      return message.channel.send({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["owner"]["setup-owner"]["variable18"]))
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://discord.gg/milrato
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention him / Milrato Development, when using this Code!
 * @INFO
 */