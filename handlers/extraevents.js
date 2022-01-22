const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const { simple_databasing } = require(`${process.cwd()}/handlers/functions`);
module.exports = client => {
    
  process.on('unhandledRejection', (reason, p) => {
    console.log('\n\n\n\n\n=== unhandled Rejection ==='.toUpperCase().yellow.dim);
    console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
    console.log('=== unhandled Rejection ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  });
  process.on("uncaughtException", (err, origin) => {
    console.log('\n\n\n\n\n\n=== uncaught Exception ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', err.stack ? err.stack : err)
    console.log('=== uncaught Exception ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  })
  process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('=== uncaught Exception Monitor ==='.toUpperCase().yellow.dim);
  });
  process.on('beforeExit', (code) => {
    console.log('\n\n\n\n\n=== before Exit ==='.toUpperCase().yellow.dim);
    console.log('Code: ', code);
    console.log('=== before Exit ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  });
  process.on('exit', (code) => {
    console.log('\n\n\n\n\n=== exit ==='.toUpperCase().yellow.dim);
    console.log('Code: ', code);
    console.log('=== exit ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  });
  process.on('multipleResolves', (type, promise, reason) => {
    console.log('\n\n\n\n\n=== multiple Resolves ==='.toUpperCase().yellow.dim);
    console.log(type, promise, reason);
    console.log('=== multiple Resolves ===\n\n\n\n\n'.toUpperCase().yellow.dim);
  });
  
  client.on("messageCreate", (message) => {
    if(!message.guild || message.guild.available === false) return
    if(message.guild && message.author.id == client.user.id){
      if(message.channel.type == "GUILD_NEWS"){
        setTimeout(() => {
          if(message.crosspostable){
            message.crosspost().then(msg => console.log("Message got Crossposted".green)).catch(e=>console.log(e.stack ? String(e.stack).grey : String(e).grey))
          }
        }, client.ws.ping)
      }
    }
  })
  //ALWAYS SERVER DEAF THE BOT WHEN JOING
  client.on("voiceStateUpdate", (oldState, newState) => {
      try{
        //skip if not the bot
        if(client.user.id != newState.id) return;
        if (
            (!oldState.streaming && newState.streaming)   ||
            (oldState.streaming && !newState.streaming)   ||
            (!oldState.serverDeaf && newState.serverDeaf) ||
            (oldState.serverDeaf && !newState.serverDeaf) ||
            (!oldState.serverMute && newState.serverMute) ||
            (oldState.serverMute && !newState.serverMute) || 
            (!oldState.selfDeaf && newState.selfDeaf)     ||
            (oldState.selfDeaf && !newState.selfDeaf)     ||
            (!oldState.selfMute && newState.selfMute)     ||
            (oldState.selfMute && !newState.selfMute)     ||
            (!oldState.selfVideo && newState.selfVideo)   ||
            (oldState.selfVideo && !newState.selfVideo) 
         )
        if ((!oldState.channelId && newState.channelId) || (oldState.channelId && newState.channelId)) {
            try{ newState.setDeaf(true);  }catch{ }
            return;
        }
      }catch{

      }
    
  });
  //ANTI UNMUTE THING
  client.on("voiceStateUpdate", async (oldState, newState) => {
    if(newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false){
      try{
        newState.setDeaf(true).catch(() => {});
      } catch (e){
        //console.log(e)
      }
    }
  });

  client.on("guildCreate", async guild => {
    if(!guild || guild.available === false) return
    let theowner = "NO OWNER DATA! ID: ";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => {})
    simple_databasing(client, guild.id)
    let ls = client.settings.get(guild.id, "language")
    let embed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(`<a:Join_vc:863876115584385074> Joined a New Server`)
      .addField("Guild Info", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField("Member Count", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servers Bot is in", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .addField("Leave Server:", `>>> \`\`\`${config.prefix}leaveserver ${guild.id}\`\`\``)
      .setThumbnail(guild.iconURL({dynamic: true}));
    for(const owner of config.ownerIDS){
      //If the Owner is Tomato, and the Bot is in not a Milrato Development, Public Bot, then dont send information!
      if(owner == "442355791412854784"){
        let milratoGuild = client.guilds.cache.get("773668217163218944");
        if(!milratoGuild){
          continue;
        }
        if(!milratoGuild.me.roles.cache.has("779021235790807050")){
          continue; 
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => {})
      }).catch(() => {});
    }
  });

  client.on("guildDelete", async guild => {
    if(!guild || guild.available === false) return
    let theowner = "NO OWNER DATA! ID: ";
    await guild.fetchOwner().then(({ user }) => {
      theowner = user;
    }).catch(() => {})
    let ls = "en"
    let embed = new MessageEmbed()
      .setColor("RED")
      .setTitle(`<:leaves:866356598356049930> Left a Server`)
      .addField("Guild Info", `>>> \`\`\`${guild.name} (${guild.id})\`\`\``)
      .addField("Owner Info", `>>> \`\`\`${theowner ? `${theowner.tag} (${theowner.id})` : `${theowner} (${guild.ownerId})`}\`\`\``)
      .addField("Member Count", `>>> \`\`\`${guild.memberCount}\`\`\``)
      .addField("Servers Bot is in", `>>> \`\`\`${client.guilds.cache.size}\`\`\``)
      .addField("Leave Server:", `>>> \`\`\`${config.prefix}leaveserver ${guild.id}\`\`\``)
      .setThumbnail(guild.iconURL({dynamic: true}));
    for(const owner of config.ownerIDS){
      //If the Owner is Tomato, and the Bot is in not a Milrato Development, Public Bot, then dont send information!
      if(owner == "442355791412854784"){
        let milratoGuild = client.guilds.cache.get("773668217163218944");
        if(!milratoGuild){
          continue;
        }
        if(!milratoGuild.me.roles.cache.has("779021235790807050")){
          continue; 
        }
      }
      client.users.fetch(owner).then(user => {
        user.send({ embeds: [embed] }).catch(() => {})
      }).catch(() => {});
    }
  });

 
}