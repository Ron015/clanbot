// ************* IMPORT MODULES *************  //
const CronJob = require('cron').CronJob;
// ************ IMPORT FILE DATA ************* //
const TikTokScraper = require('tiktok-scraper');
const { databasing, delay } = require('../handlers/functions');
module.exports = client => {

    client.Jobtiktok = new CronJob('0 */7 * * * *', async function(){
        await delay(2 * 60 * 1000)
        check(client);
     }, null, true, 'America/Los_Angeles');
     
    client.on("ready", () => {
        client.Jobtiktok.start(); //start the JOB
    });

    async function check(client){
        console.log(" [TIKTOK] :: Checking Accounts...".italic.brightMagenta)
        client.guilds.cache.map(guild => guild.id).forEach(guildid => {
            try{
                client.social_log.ensure(guildid, {
                    tiktok: {
                        channels: [],
                        dc_channel: ""
                    },
                })
                for(const tt of client.social_log.get(guildid, "tiktok.channels")){
                    client.tiktok.ensure(tt, {
                        oldvid: "",
                        message: "**{videoAuthorName}** uploaded \`{videoTitle}\`!\n**Watch it:** {videoURL}"
                    })
                }
                client.social_log.get(guildid, "tiktok.channels").forEach(async (tiktoker) => {
                    console.log(` [TIKTOK] :: [${tiktoker}] | Start checking...`.italic.brightMagenta);
                    try {
                        const posts = await TikTokScraper.user(tiktoker, {
                            number: 5,
                        });
                        if(!posts.collector[0]) return console.log(" [TIKTOK] :: NOT FOUND / No Posts!".italic.brightMagenta) 
                        author = posts.collector[0].authorMeta;
                        var allposts = posts.collector.map(p => {
                            const Obj = {};
                            Obj.id = p.id;
                            Obj.url = p.webVideoUrl;
                            Obj.mentions = p.mentions;
                            Obj.hashtags = p.hashtags;
                            let title = p.text;
                            for(const tag of p.hashtags) title = String(title).toLowerCase().replace(String(tag.name).toLowerCase(), "")
                            for(const mention of p.mentions) title = String(title).toLowerCase().replace(String(mention), "")
                            Obj.title = title.split("#").join("");
                            if(title.length <= 1) Obj.title = p.id;
                            return Obj;
                        })
                        var video = allposts[0];
                        if(client.tiktok.get(tiktoker, "oldvid") == video.id) return console.log(` [TIKTOK] :: [${tiktoker}] | Last video is the same as the last saved`.italic.brightMagenta);
                        var channel = await client.channels.fetch(client.social_log.get(guildid, "tiktok.dc_channel")).catch(() => {});
                        channel.send({content: 
                            client.tiktok.get(tiktoker, "message")
                            .replace("{videoURL}", video.url)
                            .replace("{videoAuthorName}", author.name)
                            .replace("{videoTitle}", video.title)
                            .replace("{url}", video.url)
                            .replace("{author}", author.name)
                            .replace("{title}", video.title)
                        }).catch(() => {});;
                        client.tiktok.set(tiktoker, video.id, "oldvid")
                        console.log(" [TIKTOK] :: Notification sent !".italic.brightMagenta);
                    } catch (error) {
                        console.log(" [TIKTOK] :: ".magenta, String(error).grey);
                    }
                });        
            }catch (e){
                console.log(" [TIKTOK] :: ".magenta, String(e).grey.grey)
            }
        })
    }
}
