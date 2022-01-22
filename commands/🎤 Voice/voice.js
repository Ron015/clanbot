const { MessageEmbed, Permissions } = require("discord.js");
const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = {
    name: "voice",
    category: "🎤 Voice",
    aliases: [""],
    cooldown: 5,
    extracustomdesc: "`voice add`, `voice ban`, `voice bitrate`, `voice invite`, `voice kick`, `voice limit`, `voice lock`, `voice promote`, `voice trust`, `voice trust`, `voice unban`, `voice unlock`, `voice untrust`",
    usage: "`voice <CMD_TYPE> [Options]`\n\nValid CMD_TYPES: `lock`, `invite`, `add`, `kick`, `unlock`, `ban`, `unban`, `trust`, `untrust`, `limit`, `bitrate`, `promote`",
    description: "The Voice Commands are there for the JOIN TO CREATE COMMANDS, use them to adjust your hosted channel!",
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "VOICE")){
          return message.reply({embeds : [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          ]});
        }
    try{
      
      let newargs = message.content.slice(prefix.length).split(/ +/).slice(1);
      let args = newargs;
      let cmd = args.shift()
      if(cmd && cmd.length > 0) cmd = cmd.toLowerCase();
      if (cmd === "lock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable1"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
    
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable2"]))
              .setFooter(es.footertext, es.footericon)
            ]})
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.set([{
              id: message.guild.id,
              allow: ['VIEW_CHANNEL'],
              deny: ['CONNECT'],
            }])
            .then(lol => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author.id, {
                MANAGE_CHANNELS: true,
                VIEW_CHANNEL: true,
                MANAGE_ROLES: true,
                CONNECT: true
              })
              return message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable3"]))
                .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable4"]))
                .setFooter(es.footertext, es.footericon)
              ]})
            })
    
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable5"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "unlock") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable6"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds :[new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable7"]))
              .setFooter(es.footertext, es.footericon)
            ]})
            
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(message.guild.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable8"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable9"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable10"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "kick") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable11"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable12"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable13"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable14"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable15"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable16"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          if (!member.voice.channel)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable17"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (member.voice.channel.id != channel.id)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable18"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          try {
            member.voice.disconnect();
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable19"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          } catch (e) {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable20"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable21"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          }
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable22"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (["invite", "add"].includes(cmd)) {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable23"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable24"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable25"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable26"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable27"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable28"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let txt = args.slice(1).join(" ");
          try {
            
            if(!channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.CREATE_INSTANT_INVITE)){
              return message.reply(`:x: **I am missing the CREATE_INSTANT_INVITE PERMISSION for \`${channel.name}\`**`)
            }
            channel.createInvite().then(invite => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(member.user.id, {
                VIEW_CHANNEL: true,
                CONNECT: true
              }).then(lol => {
                if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                  return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
                }
                vc.permissionOverwrites.edit(message.author.id, {
                  MANAGE_CHANNELS: true,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: true,
                  CONNECT: true
                })
                member.user.send({embeds : [new Discord.MessageEmbed()
                  .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                  .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable29"]))
                  .setDescription(`[Click here](${invite.url}) to join **${channel.name}**\n\n${txt ? txt : ""}`.substr(0, 2000))
                  .setFooter(es.footertext, es.footericon)
                ]}).catch(e => {
                  return message.reply({embeds : [new Discord.MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable30"]))
                    .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable31"]))
                    .setFooter(es.footertext, es.footericon)
                  ]})
                })
              })
              return message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable32"]))
                .setFooter(es.footertext, es.footericon)
              ]})
            })
    
          } catch (e) {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable33"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable34"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          }
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable35"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "ban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable36"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable37"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable38"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable39"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable40"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable41"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          if (member.voice.channel && member.voice.channel.id == channel.id)
            try {
              member.voice.disconnect();
              message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable42"]))
                .setFooter(es.footertext, es.footericon)
              ]})
            } catch (e) {
              message.reply({embeds : [new Discord.MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable43"]))
                .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable44"]))
                .setFooter(es.footertext, es.footericon)
              ]})
            }
            
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable45"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
    
    
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable46"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "unban") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable47"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable48"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable49"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable50"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable51"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable52"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable53"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable54"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable55"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "trust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable56"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable57"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable58"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable59"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable60"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable61"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: true
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable62"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable63"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable64"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "untrust") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds: [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable65"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable66"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable67"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable68"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable69"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable70"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
            return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
          }
          vc.permissionOverwrites.edit(member.user.id, {
            VIEW_CHANNEL: true,
            CONNECT: false
          }).then(lol => {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(message.author.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            })
            message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable71"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable72"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable73"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "limit") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds :[new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable74"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable75"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable76"]))
            ]});
          if (isNaN(args[0])) return message.reply(
            {embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable77"]))
            ]});
          let userlimit = Number(args[0]);
          if (userlimit > 99 || userlimit < 0) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable78"]))
            ]});
          channel.setUserLimit(userlimit).then(vc => {
            return message.reply({embeds :[new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable79"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable80"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "bitrate") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable81"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable82"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply(
            {embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable83"]))
            ]});
          if (isNaN(args[0])) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable84"]))
            ]});
          let maxbitrate = 96000;
          let boosts = message.guild.premiumSubscriptionCount;
          if (boosts >= 2) maxbitrate = 128000;
          if (boosts >= 15) maxbitrate = 256000;
          if (boosts >= 30) maxbitrate = 384000;
          let userlimit = Number(args[0]);
          if (userlimit > maxbitrate || userlimit < 8000) return message.reply(
            {embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(es.footertext, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable85"]))
            ]});
          channel.setBitrate(userlimit).then(vc => {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable86"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          })
        } else {
          return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable87"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else if (cmd === "promote") {
        let {
          channel
        } = message.member.voice;
        if (!channel) return message.reply({embeds : [new Discord.MessageEmbed()
          .setColor(es.wrongcolor)
          .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable88"]))
          .setFooter(es.footertext, es.footericon)
        ]})
        client.jointocreatemap.ensure(`tempvoicechannel_${message.guild.id}_${channel.id}`, false)
        client.jointocreatemap.ensure(`owner_${message.guild.id}_${channel.id}`, false);
        if (client.jointocreatemap.get(`tempvoicechannel_${message.guild.id}_${channel.id}`)) {
          var vc = channel
          let perms = vc.permissionOverwrites.cache.map(c => c)
          let owner = false;
          for (let i = 0; i < perms.length; i++) {
            if (perms[i].id === message.author.id && perms[i].allow.toArray().includes("MANAGE_CHANNELS")) owner = true;
          }
          if (client.jointocreatemap.get(`owner_${message.guild.id}_${channel.id}`) === message.author.id) owner = true;
          if (!owner)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable89"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (!args[0]) return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable90"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable91"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          let member = message.mentions.members.filter(member=>member.guild.id==message.guild.id).first() || message.guild.members.cache.get(args[0]);
          if (!member || member == null || member == undefined) return message.reply({embeds :[new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable92"]))
            .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable93"]))
            .setFooter(es.footertext, es.footericon)
          ]})
          if (!member.voice.channel)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable94"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          if (member.voice.channel.id != channel.id)
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable95"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          try {
            if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
              return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
            }
            vc.permissionOverwrites.edit(member.user.id, {
              MANAGE_CHANNELS: true,
              VIEW_CHANNEL: true,
              MANAGE_ROLES: true,
              CONNECT: true
            }).then(l => {
              if(!vc.permissionsFor(vc.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                return message.reply(`:x: **I am missing the MANAGE_CHANNEL PERMISSION for \`${vc.name}\`**`)
              }
              vc.permissionOverwrites.edit(message.author.id, {
                  MANAGE_CHANNELS: false,
                  VIEW_CHANNEL: true,
                  MANAGE_ROLES: false,
                  CONNECT: true
                })
                .then(lol => {
                  client.jointocreatemap.set(`owner_${vc.guild.id}_${vc.id}`, member.user.id);
                  return message.reply({embeds : [new Discord.MessageEmbed()
                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                    .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable96"]))
                    .setFooter(es.footertext, es.footericon)
                  ]})
                })
            })
          } catch (e) {
            return message.reply({embeds : [new Discord.MessageEmbed()
              .setColor(es.wrongcolor)
              .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable97"]))
              .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable98"]))
              .setFooter(es.footertext, es.footericon)
            ]})
          }
        } else {
          return message.reply({embeds : [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable99"]))
            .setFooter(es.footertext, es.footericon)
          ]})
        }
      } else{
        return message.reply({embeds : [new Discord.MessageEmbed()
        .setTitle(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable100"]))
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
        .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable101"]))
        .setFooter(es.footertext, es.footericon)
        ]});
      }
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds : [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(es.footertext, es.footericon)
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["voice"]["voice"]["variable102"]))
        ]});
    }
  }
}
/**
  * @INFO
  * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/Discord-Js-Handler-Template
  * @INFO
  * Work for Milrato Development | https://milrato.eu
  * @INFO
  * Please mention him / Milrato Development, when using this Code!
  * @INFO
*/
