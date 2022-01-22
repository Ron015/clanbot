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
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-menuticket",
  category: "💪 Setup",
  aliases: ["setupmenuticket", "menuticket-setup", "menuticketsetup", "menuticketsystem"],
  cooldown: 5,
  usage: "setup-menuticket --> Follow Steps",
  description: "Manage up to 25 different Ticket Systems in a form of a DISCORD-MENU",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      //setup-menuticket
      client.menuticket.ensure(message.guild.id, {
        messageId: "",
        channelId: "",
        data: [
          /*
          	{
          		value: "",
          		description: "",
          		category: null,
          		replyMsg: "{user} Welcome to the Support!"
          	}
          */
        ]
      });
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer() {
        let menuoptions = [{
            value: "Send the Config	Message",
            description: `(Re) Send the Open a Ticket Message (with MENU)`,
            emoji: "👍"
          },
          {
            value: "Add Ticket Option",
            description: `Add up to 25 different open-Ticket-Option`,
            emoji: "📤"
          },
          {
            value: "Edit Ticket Option",
            description: `Edit one of your Ticket Options Data`,
            emoji: "✒️"
          },
          {
            value: "Remove Ticket Option",
            description: `Remove a open-Ticket-Option`,
            emoji: "🗑"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Click me to setup the Menu-Ticket System!')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Menu Ticket Setup', 'https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/envelope_2709-fe0f.png', 'https://discord.gg/milrato')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
          
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://youtu.be/QGESDc31d4U").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata)
          } else menu?.reply({
            content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `<a:yes:833101995723194437> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**`
          })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype) {
          case "Send the Config	Message": {
            let data = client.menuticket.get(message.guild.id, "data");
            let settings = client.menuticket.get(message.guild.id);
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **You need to add at least 1 Open-Ticket-Option**")
            }
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setTitle("What should be the Text to display in the Embed?")
                .setDescription(`For Example:\n> \`\`\`To Open a Ticket, select the Topic you need in the Selection down below!\`\`\``)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("In where should I send the Open a New Ticket Message?")
                  .setDescription(`Please Ping the Channel now!\n> Just type: \`#channel\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Before it was: <#${settings.channelId}>` : settings.channelId ? `| Before it was: ${settings.channelId} (Channel got deleted)` : ""}\n\nYou can edit the Title etc. afterwards by using the \`${prefix}editembed\` Command`)
                ]
              });

              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().mentions.channels.size > 0) {
                let data = client.menuticket.get(message.guild.id, "data");
                let channel = collected2.first().mentions.channels.first();
                let msgContent = collected.first().content;
                let embed = new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(es.thumb ? es.footericon : null)
                  .setFooter(es.footertext, es.footericon)
                  .setDescription(msgContent)
                  .setTitle("📨 Open a Ticket")
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder('Click me to Access the Menu-Ticket System!')
                  .addOptions(
                    data.map((option, index) => {
                      let Obj = {
                        label: option.value.substr(0, 50),
                        value: option.value.substr(0, 50),
                        description: option.description.substr(0, 50),
                        emoji: NumberEmojiIds[index + 1]
                      }
                      return Obj;
                    }))
                channel.send({
                  embeds: [embed],
                  components: [new MessageActionRow().addComponents([Selection])]
                }).catch(() => {}).then(msg => {
                  client.menuticket.set(message.guild.id, msg.id, "messageId");
                  client.menuticket.set(message.guild.id, channel.id, "channelId");
                  message.reply(`Successfully Setupped the Menu-Ticket in <#${channel.id}>`)
                });
              } else {
                return message.reply("<:no:833101993668771842> **You did not ping a valid Channel!**")
              }
            } else {
              return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
          break;
          case "Add Ticket Option": {
            let data = client.menuticket.get(message.guild.id, "data");
            if (data.length >= 25) {
              return message.reply("<:no:833101993668771842> **You reached the limit of 25 different Options!** Remove another Option first!")
            }
            //ask for value and description
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                .setDescription(`**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`General Support++Get Help for anything you want!\`\`\``)
              ]
            });
            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              if (!collected.first().content.includes("++")) return message.reply("<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**")
              let value = collected.first().content.split("++")[0].trim().substr(0, 25);
              let index = data.findIndex(v => v.value == value);
              if(index >= 0) {
                  return message.reply("<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
              }
              let description = collected.first().content.split("++")[1].trim().substr(0, 50);
              //ask for category
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("In Which Category should the new Tickets of this Option open?")
                  .setDescription(`**This is suggested to fill it in, because there are settings for SYNCING to that Category!**\nJust send the ID of it, send \`no\` for no category!\nFor Example:\n> \`840332704494518292\``)
                ]
              });
              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().content) {
                let categoryId = collected2.first().content;
                let category = message.guild.channels.cache.get(categoryId) || null;
                if(category && category.id) category = category.id;
                else category = null;
                //ask for reply message
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("What should be the Reply Message when someone Opens a Ticket?")
                    .setDescription(`For Example:\n> \`\`\`{user} Welcome to the Support! Tell us what you need help with!\`\`\``)
                  ]
                });
                let collected3 = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected3 && collected3.first().content) {
                  let replyMsg = collected3.first().content;
                  client.menuticket.push(message.guild.id, {
                    value,
                    description,
                    category,
                    replyMsg
                  }, "data");
                  message.reply({
                    embeds: [
                      new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Successfully added the New Data to the List!")
                      .setDescription(`Make sure to re-send the Message, so that it's also updating it!\n> \`${prefix}setup-menuticket\` --> Send Config Message`)
                    ]
                  });
                } else {
                  return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                }
              } else {
                return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
              }
            } else {
              return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
          break;
          case "Edit Ticket Option": {
            let data = client.menuticket.get(message.guild.id, "data");
            if (!data || data.length < 1) {
              return message.reply("<:no:833101993668771842> **There are no Open-Ticket-Options to remove**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon : null)
              .setFooter(es.footertext, es.footericon)
              .setDescription("Just pick the Options you want to edit!")
              .setTitle("Which Option do you want to edit?")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Menu-Ticket System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substr(0, 50),
                    value: option.value.substr(0, 50),
                    description: option.description.substr(0, 50),
                    emoji: NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            //send the menu msg
            let menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                let index = data.findIndex(v => v.value == menu?.values[0]);

                //ask for value and description
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                    .setDescription(`**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`General Support++Get Help for anything you want!\`\`\``)
                  ]
                });
                let collected = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected && collected.first().content) {
                  if (!collected.first().content.includes("++")) return message.reply("<:no:833101993668771842> **Invalid Usage! Please mind the Usage and check the Example**")
                  let value = collected.first().content.split("++")[0].trim().substr(0, 25);
                  let index2 = data.findIndex(v => v.value == value);
                  if(index2 >= 0 && index != index2) {
                      return message.reply("<:no:833101993668771842> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
                  }
                  let description = collected.first().content.split("++")[1].trim().substr(0, 50);
                  //ask for category
                  let tempmsg = await message.reply({
                    embeds: [
                      new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("In Which Category should the new Tickets of this Option open?")
                      .setDescription(`**This is suggested to fill it in, because there are settings for SYNCING to that Category!**\n\nJust send the ID of it, send \`no\` for no category!\nFor Example:\n> \`840332704494518292\``)
                    ]
                  });
                  let collected2 = await tempmsg.channel.awaitMessages({
                    filter: (m) => m.author.id == cmduser.id,
                    max: 1,
                    time: 90000, errors: ["time"]
                  });
                  if (collected2 && collected2.first().content) {
                    let categoryId = collected2.first().content;
                    let category = message.guild.channels.cache.get(categoryId) || null;
                    if(category && category.id) category = category.id;
                    else category = null;
                    //ask for reply message
                    let tempmsg = await message.reply({
                      embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("What should be the Reply Message when someone Opens a Ticket?")
                        .setDescription(`For Example:\n> \`\`\`{user} Welcome to the Support! Tell us what you need help with!\`\`\``)
                      ]
                    });
                    let collected3 = await tempmsg.channel.awaitMessages({
                      filter: (m) => m.author.id == cmduser.id,
                      max: 1,
                      time: 90000, errors: ["time"]
                    });
                    if (collected3 && collected3.first().content) {
                      let replyMsg = collected3.first().content;
                      data[index] = {
                        value,
                        description,
                        category,
                        replyMsg
                      };
                      client.menuticket.set(message.guild.id, data, "data");
                      message.reply(`**Successfully edited:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Ticket Config-Message!`)
                    } else {
                      return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                    }
                  } else {
                    return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                  }
                } else {
                  return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
                }
              } else menu?.reply({
                content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
                ephemeral: true
              });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({
                embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                components: [],
                content: `<a:yes:833101995723194437> **Selected: \`${collected.first().values[0]}\`**`
              })
            });
          }
          break;
          case "Remove Ticket Option": {
          let data = client.menuticket.get(message.guild.id, "data");
          if (!data || data.length < 1) {
            return message.reply("<:no:833101993668771842> **There are no Open-Ticket-Options to remove**")
          }
          let embed = new MessageEmbed()
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon : null)
            .setFooter(es.footertext, es.footericon)
            .setDescription("Just pick the Options you want to remove!")
            .setTitle("Which Option Do you want to remove?")
          //define the selection
          let Selection = new MessageSelectMenu()
            .setCustomId('MenuSelection')
            .setMaxValues(data.length)
            .setMinValues(1)
            .setPlaceholder('Click me to setup the Menu-Ticket System!')
            .addOptions(
              data.map((option, index) => {
                let Obj = {
                  label: option.value.substr(0, 50),
                  value: option.value.substr(0, 50),
                  description: option.description.substr(0, 50),
                  emoji: NumberEmojiIds[index + 1]
                }
                return Obj;
              }))
          //send the menu msg
          let menumsg = await message.reply({
            embeds: [embed],
            components: [new MessageActionRow().addComponents([Selection])]
          })
          //Create the collector
          const collector = menumsg.createMessageComponentCollector({
            filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
            time: 90000, errors: ["time"]
          })
          //Menu Collections
          collector.on('collect', async menu => {
            if (menu?.user.id === cmduser.id) {
              collector.stop();
              for (const value of menu?.values) {
                let index = data.findIndex(v => v.value == value);
                data.splice(index, 1)
              }
              client.menuticket.set(message.guild.id, data, "data");
              message.reply(`**Successfully removed:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Ticket Config-Message!`)
            } else menu?.reply({
              content: `<:no:833101993668771842> You are not allowed to do that! Only: <@${cmduser.id}>`,
              ephemeral: true
            });
          });
          //Once the Collections ended edit the menu message
          collector.on('end', collected => {
            menumsg.edit({
              embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
              components: [],
              content: `<a:yes:833101995723194437> **Selected: \`${collected.first().values[0]}\`**`
            })
          });
        }
        break;
        }
      }

      /*
      		let tempmsg = await message.reply({
      			embeds: [
      			new MessageEmbed()
      				.setColor(es.color)
      				.setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
      				.setDescription(`For Example:\n> \`\`\`General Support++Get Help for anything you want!\`\`\``)			
      			]
      		});
      		
      		let collected = await tempmsg.channel.awaitMessages({filter: (m) => m.author.id == cmduser.id, max: 1, time: 90000, errors: ["time"]});
      		if(collected && collected.first().content) {
      			
      		} else {
      			return message.reply("<:no:833101993668771842> **You did not enter a Valid Message in Time! CANCELLED!**")
      		}
      */
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(es.footertext, es.footericon)
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"]))
        ]
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

function getNumberEmojis() {
  return [
    "<:Number_0:843943149915078696>",
    "<:Number_1:843943149902626846>",
    "<:Number_2:843943149868023808>",
    "<:Number_3:843943149914554388>",
    "<:Number_4:843943149919535154>",
    "<:Number_5:843943149759889439>",
    "<:Number_6:843943150468857876>",
    "<:Number_7:843943150179713024>",
    "<:Number_8:843943150360068137>",
    "<:Number_9:843943150443036672>",
    "<:Number_10:843943150594031626>",
    "<:Number_11:893173642022748230>",
    "<:Number_12:893173642165383218>",
    "<:Number_13:893173642274410496>",
    "<:Number_14:893173642198921296>",
    "<:Number_15:893173642182139914>",
    "<:Number_16:893173642530271342>",
    "<:Number_17:893173642538647612>",
    "<:Number_18:893173642307977258>",
    "<:Number_19:893173642588991488>",
    "<:Number_20:893173642307977266>",
    "<:Number_21:893173642274430977>",
    "<:Number_22:893173642702250045>",
    "<:Number_23:893173642454773782>",
    "<:Number_24:893173642744201226>",
    "<:Number_25:893173642727424020>"
  ]
}