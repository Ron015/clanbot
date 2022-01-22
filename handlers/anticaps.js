//import the config.json file
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
    MessageEmbed, Permissions
} = require(`discord.js`);
const { databasing, delay } = require(`${process.cwd()}/handlers/functions`)
const countermap = new Map()
module.exports = client => {
  
    client.on("messageUpdate", (oldMessage, newMessage) => {
        checkAntiCaps(newMessage)
    })
    client.on("messageCreate", message => {
        checkAntiCaps(message)
    })
    async function checkAntiCaps(message){
        try{
            if (!message.guild || message.guild.available === false || !message.channel || message.author.bot) return;
            let ls = client.settings.get(message.guild.id, "language")
            client.settings.ensure(message.guild.id, {
                adminroles: [],
            });
            var adminroles = client.settings.get(message.guild.id, "adminroles")
            if ( ((adminroles && adminroles.length > 0) && [...message.member.roles.cache.values()].length > 0 && message.member.roles.cache.some(r => adminroles.includes(r ? r.id : r))) || Array(message.guild.ownerId, config.ownerid).includes(message.author.id) || message.member.permissions.has("ADMINISTRATOR") )
                return;
            client.settings.ensure(message.guild.id, {
                anticaps: {
                    enabled: true,
                    percent: 75
                },
            });
            client.settings.ensure(message.guild.id,{
                autowarn: {
                    antispam: false,
                    antimention: false,
                    antilinks: false,
                    antidiscord: false,
                    anticaps: false,
                    blacklist: false,
                    ghost_ping_detector: false,
                }
            })
            let autowarn = client.settings.get(message.guild.id, "autowarn");
            let anticaps = client.settings.get(message.guild.id, "anticaps")
            if(!anticaps.enabled) return;
            let es = client.settings.get(message.guild.id, "embed");
            let member = message.member
            if(!message.content) return;
            if(message.content.split(" ").join("").length < 8) return;
            try {
                var uppercaselength = message.content.replace(/[^A-Z]/g, "").length;
                var wholelength = message.content.length;
                var percent = Math.ceil(uppercaselength/wholelength * 100);
                if(percent >= anticaps.percent){
                    if(autowarn.anticaps){
                        client.userProfiles.ensure(message.author.id, {
                            id: message.author.id,
                            guild: message.guild.id,
                            totalActions: 0,
                            warnings: [],
                            kicks: []
                            });
                            const newActionId = client.modActions.autonum;
                            client.modActions.set(newActionId, {
                                user: message.author.id,
                                guild: message.guild.id,
                                type: 'warning',
                                moderator: message.author.id,
                                reason: "AntiCaps Autowarn",
                                when: new Date().toLocaleString(`de`),
                                oldhighesrole: message.member.roles ? message.member.roles.highest : `Had No Roles`,
                                oldthumburl: message.author.displayAvatarURL({
                                    dynamic: true
                                })
                            });
                            // Push the action to the user's warnings
                            client.userProfiles.push(message.author.id, newActionId, 'warnings');
                            client.userProfiles.inc(message.author.id, 'totalActions');
                            client.stats.push(message.guild.id+message.author.id, new Date().getTime(), "warn"); 
                            const warnIDs = client.userProfiles.get(message.author.id, 'warnings')
                            const warnData = warnIDs.map(id => client.modActions.get(id));
                            let warnings = warnData.filter(v => v.guild == message.guild.id);
                            message.channel.send({
                                embeds: [
                                    new MessageEmbed().setAuthor(message.author.tag, message.member.displayAvatarURL({dynamic: true}))
                                    .setColor("ORANGE").setFooter("ID: "+ message.author.id, message.author.displayAvatarURL({dynamic:true}))
                                    .setDescription(`> <@${message.author.id}> **received an autogenerated Warn - \`anticaps\`**!\n\n> **He now has \`${warnings.length} Warnings\`**`)
                                ]
                            });
                            let warnsettings = client.settings.get(message.guild.id, "warnsettings")
                            if(warnsettings.kick && warnsettings.kick == warnings.length){
                            if (!message.member.kickable)
                                message.channel.send({embeds :[new MessageEmbed()
                                .setColor(es.wrongcolor)
                                .setFooter(es.footertext, es.footericon)
                                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable8"]))
                                ]});
                            else {
                                try{
                                message.member.send({embeds : [new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable9"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable10"]))
                                ]});
                                } catch{
                                return message.channel.send({embeds :[new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable11"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable12"]))
                                ]});
                                }
                                try {
                                message.member.kick({
                                    reason: `Reached ${warnings.length} Warnings`
                                }).then(() => {
                                    message.channel.send({embeds :[new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable13"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable14"]))
                                    ]});
                                });
                                } catch (e) {
                                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                message.channel.send({embeds : [new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(client.la[ls].common.erroroccur)
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable15"]))
                                ]});
                                }
                            }
                                
                            }
                            if(warnsettings.ban && warnsettings.ban == warnings.length){
                            if (!message.member.bannable)
                                message.channel.send({embeds : [new MessageEmbed()
                                .setColor(es.wrongcolor)
                                .setFooter(es.footertext, es.footericon)
                                .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable16"]))
                                ]});
                                else {
                                try{
                                message.member.send({embeds :[new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable17"]))
                                ]});
                                } catch {
                                message.channel.send({embeds :[new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable18"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable19"]))
                                ]});
                                }
                                try {
                                message.member.ban({
                                    reason: `Reached ${warnings.length} Warnings`
                                }).then(() => {
                                    message.channel.send({embeds :[new MessageEmbed()
                                    .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable20"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable21"]))
                                    ]});
                                });
                                } catch (e) {
                                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                                message.channel.send({embeds :[new MessageEmbed()
                                    .setColor(es.wrongcolor)
                                    .setFooter(es.footertext, es.footericon)
                                    .setTitle(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable22"]))
                                    .setDescription(eval(client.la[ls]["cmds"]["administration"]["warn"]["variable23"]))
                                ]});
                                }}
                            }
                            for(const role of warnsettings.roles){
                                if(role.warncount == warnings.length){
                                    if(!message.member.roles.cache.has(role.roleid)){
                                    message.member.roles.add(role.roleid).catch((O)=>{})
                                    }
                                }
                            }
                    }
                    if(message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_MESSAGES)){
                        message.delete().catch(() => {})
                    } else {
                        message.reply(":x: **I am missing the MANAGE_MESSAGES Permission!**").then(m => {
                            setTimeout(()=>{m.delete().catch(()=>{})}, 3500)
                        })
                    }

                    if (!countermap.get(message.author.id)) countermap.set(message.author.id, 1)
                    setTimeout(() => {
                        countermap.set(message.author.id, Number(countermap.get(message.author.id)) - 1)
                        if (Number(countermap.get(message.author.id)) < 0) countermap.set(message.author.id, 1)
                    }, 15000)
                    countermap.set(message.author.id, Number(countermap.get(message.author.id)) + 1)

                    if (Number(countermap.get(message.author.id)) > 5) {
                        let time = 10 * 60 * 1000;
                        let reason = "Sending too many Links in a Short Time";
                        let allguildroles = [...message.guild.roles.cache.values()];
                        let mutedrole = false;
                        for (let i = 0; i < allguildroles.length; i++) {
                            if (allguildroles[i].name.toLowerCase().includes(`muted`)) {
                                mutedrole = allguildroles[i];
                                break;
                            }
                        }
                        if (!mutedrole) {
                            let highestrolepos = message.guild.me.roles.highest.position;
                            if(!message.channel.permissionsFor(message.channel.guild.me).has(Permissions.FLAGS.MANAGE_ROLES)){
                                return message.reply(":x: **I am missing the MANAGE_ROLES Permission!**\nNow I cant mute him...").then(m => {
                                    setTimeout(()=>{m.delete().catch(()=>{})}, 5000)
                                })
                            }
                            mutedrole = await message.guild.roles.create({
                                    name: `muted`,
                                    color: `#222222`,
                                    hoist: true,
                                    position: Number(highestrolepos) - 1,
                                reason: `This role got created, to mute Members!`
                            }).catch((e) => {
                                return console.log(e.stack ? String(e.stack).grey : String(e).grey);
                            });
                        }
                        await message.guild.channels.cache.filter(c => 
                            !c.permissionOverwrites.cache.has(mutedrole.id) || 
                           (c.permissionOverwrites.cache.has(mutedrole.id) && !c.permissionOverwrites.cache.get(mutedrole.id).deny.toArray().includes("SEND_MESSAGES")) ||
                           (c.permissionOverwrites.cache.has(mutedrole.id) && !c.permissionOverwrites.cache.get(mutedrole.id).deny.toArray().includes("ADD_REACTIONS")) ).forEach(async (ch) => {
                            try {
                                if(ch.permissionsFor(ch.guild.me).has(Permissions.FLAGS.MANAGE_CHANNELS)){
                                  await ch.permissionOverwrites.edit(mutedrole, {
                                    SEND_MESSAGES: false,
                                    ADD_REACTIONS: false,
                                    CONNECT: false,
                                    SPEAK: false
                                  }).catch(() => {})
                                  await delay(1500);
                                }
                            } catch (e) {
                                console.log(e.stack ? String(e.stack).grey : String(e).grey);
                            }
                        });
                        try {
                            member.roles.add(mutedrole).catch(() => {});
                        } catch (e) {
                            console.log(e.stack ? String(e.stack).grey : String(e).grey)
                        }
                        message.reply({embeds: [new MessageEmbed()
                            .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                            .setFooter(es.footertext, es.footericon)
                            .setTitle(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable1"]))
                            .setDescription(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable2"]))
                        ]}).catch(() => {});
                        countermap.set(message.author.id, 1)
                        setTimeout(() => {
                            try {
                              message.reply({embeds: [new MessageEmbed()
                                .setColor(es.color).setThumbnail(es.thumb ? es.footericon : null)
                                .setFooter(es.footertext, es.footericon)
                                .setTitle(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable3"]))
                                .setDescription(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable4"]))
                              ]}).catch(() => {});
                              member.roles.remove(mutedrole).catch(() => {});
                            } catch (e) {
                                console.log(e.stack ? String(e.stack).grey : String(e).grey)
                            }
                          }, time);
                    }
                    else {
                        return message.reply({embeds: [new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setFooter(es.footertext, es.footericon)
                            .setTitle(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable5"]))
                            .setDescription(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable6"]))
                        ]}).then(msg => setTimeout(()=>{msg.delete().catch(() => {})}, 3000)).catch(() => {});
                    }
                } else {
                    // Do nothing ;)
                }
            } catch (e) {
                console.log(String(e.stack).grey.bgRed)
                return message.reply({embeds: [new MessageEmbed()
                    .setColor(es.wrongcolor)
                    .setFooter(es.footertext, es.footericon)
                    .setTitle(client.la[ls].common.erroroccur)
                    .setDescription(eval(client.la[ls]["handlers"]["anticapsjs"]["anticaps"]["variable7"]))
                ]}).catch(() => {});
            }
        }catch(e){console.log(String(e).grey)}
    }
}