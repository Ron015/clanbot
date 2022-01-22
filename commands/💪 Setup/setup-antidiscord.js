var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-antidiscord",
  category: "💪 Setup",
  aliases: ["setupantidiscord", "setup-mod", "setupmod", "antidiscord-setup", "antidiscordsetup"],
  cooldown: 5,
  usage: "setup-antidiscord  -->  Follow the Steps",
  description: "Enable/Disable anti Discord Link advertisements | Manage the Settings, you can add Whitelisted Links / Channels",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      let tempmsg;
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Enabled`" : "`❌ Disabled`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `${client.settings.get(message.guild.id, `antidiscord.enabled`) ? "Disable" : "Enable"} Anti Discord`,
            description: `${client.settings.get(message.guild.id, `antidiscord.enabled`) ? "Don't delete other Discord Links" : "Delete other Discord Links"}`,
            emoji: `${client.settings.get(message.guild.id, `antidiscord.enabled`) ? "833101993668771842" : "833101995723194437"}`
          },
          {
            value: "Settings",
            description: `Show the current Settings of the Anti-Discord System`,
            emoji: "📑"
          },
          {
            value: "Add Whitelist-CHANNEL",
            description: `Allow Channels where DC-Links are allowed`,
            emoji: "💯"
          },
          {
            value: "Remove Whitelist-CHANNEL",
            description: `Remove allowed Channels`,
            emoji: "💢"
          },
          {
            value: "Add Whitelist-LINK",
            description: `Allow Links of specific Server(s)`,
            emoji: "🔗"
          },
          {
            value: "Remove Whitelist-LINK",
            description: `Remove allowed Links`,
            emoji: "💢"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Ticket-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Click me to setup the Anti-Discord-Links System!').setCustomId('MenuSelection') 
          .setMaxValues(1).setMinValues(1) 
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
           }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor("Anti-Discord-Links System Setup", 
          "https://cdn.discordapp.com/emojis/858405056238714930.gif?v=1",
          "https://discord.gg/milrato")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable1"]))
        let used1 = false;
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({ 
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply({content: eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable2"])})
            menu?.deferUpdate(); used1 = true;
            handle_the_picks(menuoptionindex, menuoptiondata)
          }
          else menu?.reply({content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)], components: [], content: `${collected && collected.first() && collected.first().values ? `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**` : "❌ **NOTHING SELECTED - CANCELLED**" }`})
        });
      }

      //THE FUNCTION TO HANDLE THE SELECTION PICS
      async function handle_the_picks(menuoptionindex, menuoptiondata) {
        switch(menuoptionindex){
          case 0: {
            client.settings.set(message.guild.id, !client.settings.get(message.guild.id, `antidiscord.enabled`), `antidiscord.enabled`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable3"]))
              .setColor(es.color)
              .setFooter(es.footertext, es.footericon)
            ]});
          }
          break;
          case 1: {
           let thesettings = client.settings.get(message.guild.id, `antidiscord`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable4"]))
              .setColor(es.color)
              .setDescription(`**Enabled:** ${thesettings.enabled ? "<a:yes:833101995723194437>" : "<:no:833101993668771842>"}\n\n**Witelisted Channels:** ${thesettings.whitelistedchannels.length > 0 ? `<#${thesettings.whitelistedchannels.join("> | <#")}>` : "No Channels Whitelisted!"}\n\n**Information:** *Anti Discord are not enabled in Tickets from THIS BOT*`.substr(0, 2048))
              .addField("**Whitelisted Links**", `${thesettings.whitelistedlinks.lenght > 0 ? thesettings.whitelistedlinks.join("\n").substr(0, 1024): "No Links allowed!"}`)
              .setFooter(es.footertext, es.footericon)
            ]});
          }
          break;
          case 2: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable5"]))
              .setColor(es.color)
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable6"]))
              .setFooter(es.footertext, es.footericon)]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
              if (channel) {
                let antisettings = client.settings.get(message.guild.id, "antidiscord.whitelistedchannels")
                if (antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable7"]))
                  .setColor(es.wrongcolor)
                  .setFooter(es.footertext, es.footericon)]
                });
                try {
                  client.settings.push(message.guild.id, channel.id, "antidiscord.whitelistedchannels");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable8"]))
                    .setColor(es.color)
                    .setDescription(`Every single Channel:\n<#${client.settings.get(message.guild.id, "antidiscord.whitelistedchannels").join(">\n<#")}>\nis not a checked by the Anti Discord Links System`.substr(0, 2048))
                    .setFooter(es.footertext, es.footericon)]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable10"]))
                    .setFooter(es.footertext, es.footericon)]
                  });
                }
              } else {
                message.reply("you didn't ping a valid Channel")
              }
            })
            .catch(e => {
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(es.footertext, es.footericon)]
              });
            })
          }
          break;
          case 3: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable12"]))
          .setColor(es.color)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable13"]))
          .setFooter(es.footertext, es.footericon)]
        })
        await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
            max: 1,
            time: 90000,
            errors: ["time"]
          })
          .then(collected => {
            var message = collected.first();
            var channel = message.mentions.channels.filter(ch=>ch.guild.id==message.guild.id).first() || message.guild.channels.cache.get(message.content.trim().split(" ")[0]);
            if (channel) {
              let antisettings = client.settings.get(message.guild.id, "antidiscord.whitelistedchannels")
              if (!antisettings.includes(channel.id)) return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable14"]))
                .setColor(es.wrongcolor)
                .setFooter(es.footertext, es.footericon)]
              });
              try {
                client.settings.remove(message.guild.id, channel.id, "antidiscord.whitelistedchannels");
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable15"]))
                  .setColor(es.color)
                  .setDescription(`Every single Channel:\n> <#${client.settings.get(message.guild.id, "antidiscord.whitelistedchannels").join(">\n> <#")}>\nis not checked by the Anti Discord Links System`.substr(0, 2048))
                  .setFooter(es.footertext, es.footericon)]
                });
              } catch (e) {
                return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable16"]))
                  .setColor(es.wrongcolor)
                  .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable17"]))
                  .setFooter(es.footertext, es.footericon)]
                });
              }
            } else {
              message.reply("you didn't ping a valid Channel")
            }
          })
          .catch(e => {
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable18"]))
              .setColor(es.wrongcolor)
              .setDescription(`Cancelled the Operation!`.substr(0, 2000))
              .setFooter(es.footertext, es.footericon)]
            });
          })
          }
          break;
          case 4: {
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Which Link do you want to enable?")
              .setColor(es.color)
              .setDescription(`Just send it in!\n**NOTE:**\n> It is suggest to remove the \`https\`, because it just checks, **if the Link contains what you send**\n\n**Example:**\n> If you want to allow \`https://discord.gg/Cool-Guys\` then make sure to send: \`discord.gg/Cool-Guys\``)
              .setFooter(es.footertext, es.footericon)]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var { content } = message;
              if (content) {
                let antisettings = client.settings.get(message.guild.id, "antidiscord.whitelistedlinks")
                if (antisettings.includes(content)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("This Link is already Allowed! you can remove it if you want!")
                  .setColor(es.wrongcolor)
                  .setFooter(es.footertext, es.footericon)]
                });
                try {
                  client.settings.push(message.guild.id, content, "antidiscord.whitelistedlinks");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Added the Link ${content} to the allowed links!`)
                    .setColor(es.color)
                    .setDescription(`Every single allowed Link:\n> ${client.settings.get(message.guild.id, "antidiscord.whitelistedlinks").join("\n> ")}\nIs not a checked by the Anti Discord Links System`.substr(0, 2048))
                    .setFooter(es.footertext, es.footericon)]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable10"]))
                    .setFooter(es.footertext, es.footericon)]
                  });
                }
              } else {
                message.reply( "you didn't send a valid Link")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(es.footertext, es.footericon)]
              });
            })
          }
          break;
          case 5: {
            let antisettings = client.settings.get(message.guild.id, "antidiscord.whitelistedlinks")
            if(antisettings.length < 1) return message.reply(":x: There are no links whitelisted...")
            tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Which Link do you want to disable again?\nSend the Link in the Chat")
              .setColor(es.color)
              .setDescription(`${antisettings.map(i => `\`${i}\``).join("\n")}`)
              .setFooter(es.footertext, es.footericon)]
            })
            await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                max: 1,
                time: 90000,
                errors: ["time"]
            })
            .then(collected => {
              var message = collected.first();
              var { content } = message;
              if (content) {
                if (!antisettings.includes(content)) return message.reply({embeds: [new Discord.MessageEmbed()
                  .setTitle("This Link is already not whitelisted!")
                  .setColor(es.wrongcolor)
                  .setFooter(es.footertext, es.footericon)]
                });
                try {
                  client.settings.remove(message.guild.id, content, "antidiscord.whitelistedlinks");
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(`Removed the Link ${content} from the allowed links!`)
                    .setColor(es.color)
                    .setDescription(`Every single allowed Link:\n> ${client.settings.get(message.guild.id, "antidiscord.whitelistedlinks").join("\n> ")}\nIs not a checked by the Anti Discord Links System`.substr(0, 2048))
                    .setFooter(es.footertext, es.footericon)]
                  });
                } catch (e) {
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable9"]))
                    .setColor(es.wrongcolor)
                    .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable10"]))
                    .setFooter(es.footertext, es.footericon)]
                  });
                }
              } else {
                message.reply( "you didn't send a valid Link")
              }
            })
            .catch(e => {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
              return message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable11"]))
                .setColor(es.wrongcolor)
                .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                .setFooter(es.footertext, es.footericon)]
              });
            })
          }
          break;
        
        }

      }

      ///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-antidiscord"]["variable19"]))]
      });
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
