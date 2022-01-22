var { MessageEmbed } = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var radios = require(`../../botconfig/radiostations.json`);
var playermanager = require(`../../handlers/playermanager`);
var { stations, databasing } = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
    name: "setup-radio",
    category: "💪 Setup",
    aliases: ["setupradio", "setup-waitingroom", "setupwaitingroom", "radio-setup", "radiosetup", "waitingroom-setup", "waitingroomsetup"],
    cooldown: 10,
    usage: "setup-radio <RadioStation Num.>   -->    while beeing in a radio station",
    description: "Manage the Waitingroom System / 24/7 Radio System",
    memberpermissions: ["ADMINISTRATOR"],
    type: "fun",
    run: async (client, message, args, cmduser, text, prefix) => {
    
      let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
      try{
        var adminroles = client.settings.get(message.guild.id, "adminroles")
        var { guild } = message;
        //get the channel instance from the Member
        var { channel } = message.member.voice;
        //if the member is not in a channel, return
        if (!channel)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable1"]))
          ]});
        //get the player instance
        var player = client.manager.players.get(message.guild.id);
        //if there is a player and they are not in the same channel, return Error
        if (player && player.state === "CONNECTED") await player.destroy();
        //if no args send all stations
        if (!args[0]) return stations(client, config.prefix, message);
        //if not a number error
        if (isNaN(args[0])) {
            return message.reply({embeds: [new MessageEmbed()
              .setColor(es.wrongcolor)
              .setFooter(client.user.username, es.footericon)
              .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable2"]))
              .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable3"]))
            ]});
        }
        //if the volume number is not valid
        if (Number(args[1]) > 150 || Number(args[1]) < 1)
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable4"]))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable5"]))
          ]});
        //define the volume
        var volume;
        //if its not a number for volume, set it to 50
        if (isNaN(args[1])) {
            volume = 50;
        }
        //otherwise set it to the args
        else {
            volume = args[1];
        }
        //define args 2 of each single input
        var args2;
        if (Number([args[0]]) > 0 && Number(args[0]) <= 10)         args2 = radios.EU.United_Kingdom[Number(args[0]) - 1].split(` `);
        else if (Number([args[0]]) > 10 && Number(args[0]) <= 20)   args2 = radios.EU.Austria[Number(args[0]) - 10 - 1].split(` `);
        else if (Number([args[0]]) > 20 && Number(args[0]) <= 30)   args2 = radios.EU.Belgium[Number(args[0]) - 20 - 1].split(` `);
        else if (Number([args[0]]) > 30 && Number(args[0]) <= 40)   args2 = radios.EU.Bosnia[Number(args[0]) - 30 - 1].split(` `);
        else if (Number([args[0]]) > 40 && Number(args[0]) <= 50)   args2 = radios.EU.Czech[Number(args[0]) - 40 - 1].split(` `);
        else if (Number([args[0]]) > 50 && Number(args[0]) <= 60)   args2 = radios.EU.Denmark[Number(args[0]) - 50 - 1].split(` `);
        else if (Number([args[0]]) > 60 && Number(args[0]) <= 70)   args2 = radios.EU.Germany[Number(args[0]) - 60 - 1].split(` `);
        else if (Number([args[0]]) > 70 && Number(args[0]) <= 80)   args2 = radios.EU.Hungary[Number(args[0]) - 70 - 1].split(` `);
        else if (Number([args[0]]) > 80 && Number(args[0]) <= 90)   args2 = radios.EU.Ireland[Number(args[0]) - 80 - 1].split(` `);
        else if (Number([args[0]]) > 90 && Number(args[0]) <= 100)  args2 = radios.EU.Italy[Number(args[0]) - 90 - 1].split(` `);
        else if (Number([args[0]]) > 100 && Number(args[0]) <= 110) args2 = radios.EU.Luxembourg[Number(args[0]) - 100 - 1].split(` `);
        else if (Number([args[0]]) > 110 && Number(args[0]) <= 120) args2 = radios.EU.Romania[Number(args[0]) - 110 - 1].split(` `);
        else if (Number([args[0]]) > 120 && Number(args[0]) <= 130) args2 = radios.EU.Serbia[Number(args[0]) - 120 - 1].split(` `);
        else if (Number([args[0]]) > 130 && Number(args[0]) <= 140) args2 = radios.EU.Spain[Number(args[0]) - 130 - 1].split(` `);
        else if (Number([args[0]]) > 140 && Number(args[0]) <= 150) args2 = radios.EU.Sweden[Number(args[0]) - 140 - 1].split(` `);
        else if (Number([args[0]]) > 150 && Number(args[0]) <= 160) args2 = radios.EU.Ukraine[Number(args[0]) - 150 - 1].split(` `);
        else if (Number([args[0]]) > 160 && Number(args[0]) <= 183) args2 = radios.OTHERS.request[Number(args[0]) - 160 - 1].split(` `);
        //if not found send an error
        else
          return message.reply({embeds: [new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.user.username, es.footericon)
            .setTitle(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable6"]))
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable7"]))
          ]});
        //get song information of it
        var song = { title: args2[0].replace(`-`, ` `), url: args2[1] };
        //define an embed
        var embed = new MessageEmbed()
          .setColor(es.color)
          .setFooter(es.footertext, es.footericon)
          .setTitle(`Searching: ${emoji?.msg.search}` + song.title)
          try{embed.setURL(song.url)}catch{}
        //send the message of the searching <a:Playing_Audio:859459305152708630> <a:Playing_Audio:859459305152708630> 
        message.reply(
            new Discord.MessageEmbed()
                .setTitle("<a:Playing_Audio:859459305152708630> Setup Complete for Radio Station:  " + song.title)
                .setColor("#7fafe3")
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable8"]))
                .setURL(song.url)
                .setFooter(client.user.username, es.footericon)
            )

        client.settings.set(message.guild.id, channel.id, `channel`);
        client.settings.set(message.guild.id, song.url, `song`);
        client.settings.set(message.guild.id, volume, `volume`);
        //play the radio but make the URL to an array ;) like that: [ `urlhere` ]
        playermanager(client, message, Array(client.settings.get(message.guild.id, `song`)), `song:radioraw`, channel, message.guild);
        } catch (e) {
            console.log(String(e.stack).grey.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
    						.setFooter(es.footertext, es.footericon)
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-radio"]["variable9"]))
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
