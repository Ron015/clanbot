const {
    MessageEmbed
} = require(`discord.js`);
const config = require(`${process.cwd()}/botconfig/config.json`);
//const {
//    KSoftClient
//} = require(`@ksoft/api`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
//const lyricsFinder = require(`lyrics-finder`);
const {
    format,
    delay,
    swap_pages,
    handlemsg
} = require(`${process.cwd()}/handlers/functions`);
module.exports = {
    name: `lyrics`,
    category: `🎶 Music`,
    aliases: [`songlyrics`, `ly`, `tracklyrics`],
    description: `Shows The Lyrics of the current track`,
    usage: `lyrics [Songtitle]`,
    cooldown: 15,
    parameters: {
        "type": "music",
        "activeplayer": true,
        "previoussong": false
    },
    type: "song",
    run: async (client, message, args, cmduser, text, prefix, player) => {
        
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if (!client.settings.get(message.guild.id, "MUSIC")) {
            return message.reply({embeds : [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setFooter(es.footertext, es.footericon)
                .setTitle(client.la[ls].common.disabled.title)
                .setDescription(handlemsg(client.la[ls].common.disabled.description, {
                    prefix: prefix
                }))
            ]});
        }
        try {
            return message.reply("**Due to legal Reasons, Lyrics are disabled and won't work for an unknown amount of time!** :cry:")
            //get the Song Title
            let title = player.queue.current.title;
            //get the song Creator Author
            let author = player.queue.current.author;
            //if there are search terms, search for the lyrics
            if (args[0]) {
                //get the new title
                title = args.join(` `);
                //sending the Embed and deleting it afterwards
                message.reply({embeds :[new MessageEmbed()
                    .setColor(es.color)
                    .setTitle(handlemsg(client.la[ls].cmds.music.lyrics.searching, {title: title}).substr(0, 256))
                ]})
            }
            //set the lyrics temp. to null
            let lyrics = null;
            //if there is the use of lyrics_finder
            if (config.lyricssettings.lyrics_finder) {
                //if there is the use of ksoft api which is way better
                if (config.lyricssettings.ksoft_api?.use_this_instead) {
                    //create a new Ksoft Client
                    const ksoft = new KSoftClient(config.lyricssettings.ksoft_api?.api_key);
                    //get the lyrics
                    await ksoft.lyrics.get(title).then(async (track) => {
                        //send error if no lyrics
                        if (!track.lyrics)
                            return message.reply({embeds : [new MessageEmbed()
                                .setColor(es.wrongcolor)
                                .setTitle(client.la[ls].cmds.music.lyrics.nolyrics)
                            ]});
                        //safe the lyrics on the temp. variable
                        lyrics = track.lyrics;
                    });
                    //if no ksoft api use the worse lyrics_finder scraper
                } else {
                    try {
                        //get the lyrics
                        lyrics = await lyricsFinder(title, author ? author : ``);
                        //if no lyrics send and error
                        if (!lyrics)
                            return message.reply({embeds :[new MessageEmbed()
                                .setColor(es.wrongcolor)
                                .setTitle(client.la[ls].cmds.music.lyrics.nolyrics)
                            ]});
                        //catch any errors
                    } catch (e) {
                        //log the Error
                        return message.reply({embeds :[new MessageEmbed()
                            .setColor(es.wrongcolor)
                            .setTitle(client.la[ls].cmds.music.lyrics.nolyrics)
                        ]});
                    }
                }
            }
            //return susccess message
            return swap_pages(client, message, lyrics, handlemsg(client.la[ls].cmds.music.lyrics.found, {title: title}).substr(0, 256))
            /* DIFFERENT METHOD (sending all embeds at once)
              //create the lyrics Embed
              let lyricsEmbed = new MessageEmbed()
                  .setTitle(`Lyrics for: ${emoji?.msg.lyrics} \`${title}\``.substr(0, 256))
                  .setDescription(lyrics)
                  .setColor(es.color)
                  ;
              //safe the description on a temp. variable
              let k = lyricsEmbed.description
              //loop for the length
              for (let i = 0; i < k.length; i += 2048)
                //send an embed for each embed which is too big
                message.reply(i >= 2048 ? lyricsEmbed.setDescription(k.substr(i,  i + 2048)).setTitle(eval(client.la[ls]["cmds"]["music"]["lyrics"]["variable1"])): lyricsEmbed.setDescription(k.substr(i,  i + 2048)))
            */
        } catch (e) {
            console.log(String(e.stack).dim.bgRed)
            return message.reply({embeds: [new MessageEmbed()
                .setColor(es.wrongcolor)
                .setTitle(client.la[ls].common.erroroccur)
                .setDescription(eval(client.la[ls]["cmds"]["music"]["lyrics"]["variable2"]))
            ]});
        }
    }
};
/**
 * @INFO
 * Bot Coded by Tomato#6966 | https://github?.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Work for Milrato Development | https://milrato.eu
 * @INFO
 * Please mention Him / Milrato Development, when using this Code!
 * @INFO
 */
