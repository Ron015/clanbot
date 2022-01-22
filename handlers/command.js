const {
  readdirSync
} = require("fs");
const Enmap = require("enmap");
console.log("Welcome to SERVICE HANDLER /--/ By https://milrato.eu /--/ Discord: Tomato#6966".yellow);
module.exports = (client) => {
  try {
    readdirSync("./commands/").forEach((dir) => {
      const commands = readdirSync(`./commands/${dir}/`).filter((file) => file.endsWith(".js"));
      for (let file of commands) {
        try{
          let pull = require(`../commands/${dir}/${file}`);
          if (pull.name) {
            client.commands.set(pull.name, pull);
            //console.log(`    | ${file} :: Ready`.brightGreen)
          } else {
            console.log(`    | ${file} :: error -> missing a help.name,or help.name is not a string.`.brightRed)
            continue;
          }
          if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach((alias) => client.aliases.set(alias, pull.name));
        }catch(e){
          console.log(String(e.stack).grey.bgRed)
        }
      }
    });
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
  }

  client.backupDB = new Enmap({ name: 'backups', dataDir: "./databases" });
 
  const { GiveawaysManager } = require('discord-giveaways');
  client.giveawayDB = new Enmap({ name: 'giveaways', dataDir: "./databases" });
  const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
    async getAllGiveaways() {
        return client.giveawayDB.fetchEverything().array();
    }
    async saveGiveaway(messageId, giveawayData) {
        client.giveawayDB.set(messageId, giveawayData);
        return true;
    }
    async editGiveaway(messageId, giveawayData) {
        client.giveawayDB.set(messageId, giveawayData);
        return true;
    }
    async deleteGiveaway(messageId) {
        client.giveawayDB.delete(messageId);
        return true;
    }
  };
  
  const manager = new GiveawayManagerWithOwnDatabase(client, {
      default: {
          botsCanWin: false,
          embedColor: require(`${process.cwd()}/botconfig/embed.json`).color,
          embedColorEnd: require(`${process.cwd()}/botconfig/embed.json`).wrongcolor,
          reaction: '🎉'
      }
  });
  // We now have a giveawaysManager property to access the manager everywhere!
  client.giveawaysManager = manager;
  client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
      console.log(`${member.user.tag} entered giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
  });
  client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
      console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageId} (${reaction.emoji?.name})`);
  });
  client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
      console.log(`Giveaway #${giveaway.messageId} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
  });
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
