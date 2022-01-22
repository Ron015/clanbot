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
  name: "setup-antispam",
  category: "💪 Setup",
  aliases: ["setupantispam", "setup-spam", "setupspam", "antispam-setup", "antispamsetup"],
  cooldown: 5,
  usage: "setup-antispam  -->  Follow the Steps",
  description: "Enable + Change the Maximum Amount of Messages to be allowed to send in under 10 Seconds",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
///////////////////////////////////////
      ///////////////////////////////////////
      ///////////////////////////////////////
      
      
      //function to handle true/false
      const d2p = (bool) => bool ? "`✔️ Enabled`" : "`❌ Disabled`"; 
      //call the first layer
      first_layer()

      //function to handle the FIRST LAYER of the SELECTION
      async function first_layer(){
        let menuoptions = [
          {
            value: `Enable & Set Anti Spam`,
            description: "Enable and limit the allowed Messages / 10 Seconds",
            emoji: "833101995723194437"
          },
          {
            value: `Disable Anti Spam`,
            description: "Don't prevent Spamming",
            emoji: "833101993668771842"
          },
          {
            value: "Settings",
            description: `Show the Current Settings of the Anti-Spam System`,
            emoji: "📑"
          },
          {
            value: "Cancel",
            description: `Cancel and stop the Anti-Spam-Setup!`,
            emoji: "862306766338523166"
          }
        ]
        let Selection = new MessageSelectMenu()
          .setPlaceholder('Click me to setup the Anti Spam System!').setCustomId('MenuSelection') 
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
          .setAuthor("Anti-Spam System Setup", 
          "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/twitter/282/a-button-blood-type_1f170-fe0f.png",
          "https://discord.gg/milrato")
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable1"]))
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
            let menuoptiondata = menuoptions.find(v=>v.value == menu?.values[0])
            let menuoptiondataIndex = menuoptions.findIndex(v=>v.value == menu?.values[0])
            if(menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(" ")[0]
            handle_the_picks(menuoptiondataIndex, SetupNumber, menuoptiondata)
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
              let tempmsg = await message.reply({embeds: [new Discord.MessageEmbed()
                .setTitle("**How many Messages** is someone allowed to send in **under 10 Seconds**")
                .setColor(es.color)
                .setDescription(`The Current limit is: \`${client.settings.get(message.guild.id, "antispam.limit")} Messages / 10 Seconds\`\n\nOur Suggestion is to keep it between 5 and 20\n\nPlease just send the NUMBER`)
                .setFooter(es.footertext, es.footericon)]
              });
              await tempmsg.channel.awaitMessages({filter: m => m.author.id === message.author.id,
                  max: 1,
                  time: 90000,
                  errors: ["time"]
                }) .then(collected => {
                  var message = collected.first();
                  if (message.content) {
                    var limit = Number(message.content);
                    if(!limit || limit == null || limit > 30 || limit <= 0) 
                      return message.reply({embeds: [new Discord.MessageEmbed()
                          .setTitle("The Limit must be between 1 and 30")
                          .setColor(es.wrongcolor)
                          .setDescription("Users can't send more messages then 30 in under 10 Seconds...")
                          .setFooter(es.footertext, es.footericon)]
                        }); 
                    try {
                      client.settings.set(message.guild.id, limit, "antispam.limit");
                      client.settings.set(message.guild.id, true, "antispam.enabled");
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle("Successfully Enabled the Anti-Spam System")
                        .setColor(es.color)
                        .setDescription(`If a non Admin User types more Messages in under 10 Seconds then ${limit} his message(s) will be deleted + he will be "warned" (no warn system warn but yeah)\n\nIf he continues to do that, he will get Muted`.substr(0, 2048))
                        .setFooter(es.footertext, es.footericon)]
                      });
                    } catch (e) {
                      console.log(e.stack ? String(e.stack).grey : String(e).grey)
                      return message.reply({embeds: [new Discord.MessageEmbed()
                        .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable8"]))
                        .setColor(es.wrongcolor)
                        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable9"]))
                        .setFooter(es.footertext, es.footericon)]
                      });
                    }
                  } else {
                    message.reply( "you didn't ping a valid Channel")
                  }
                }) .catch(e => {
                  console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  return message.reply({embeds: [new Discord.MessageEmbed()
                    .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable10"]))
                    .setColor(es.wrongcolor)
                    .setDescription(`Cancelled the Operation!`.substr(0, 2000))
                    .setFooter(es.footertext, es.footericon)]
                  });
                })

          }break;
          case 1: {
            client.settings.set(message.guild.id, false, "antispam.enabled");
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("Successfully disabled the ANti Spam System")
              .setColor(es.color)
              .setDescription(`To enabled it type \`${prefix}setup-antispam\``.substr(0, 2048))
              .setFooter(es.footertext, es.footericon)]
            });
          }break;
          case 2: {
            let thesettings = client.settings.get(message.guild.id, `antispam`)
            return message.reply({embeds: [new Discord.MessageEmbed()
              .setTitle("The Settings of the Anti Spam System")
              .setColor(es.color)
              .setDescription(`**Enabled:** ${thesettings.enabled ? "<a:yes:833101995723194437>" : "<:no:833101993668771842>"}\n\n**Allowed Messages / 10 Seconds:** \`${thesettings.limit} Messages\``.substr(0, 2048))
              .setFooter(es.footertext, es.footericon)]}
            );
          }
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
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-anticaps"]["variable13"]))]
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
