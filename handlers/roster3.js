const oldStateMap = new Map();

const {
    edit_msg3, databasing
} = require(`${process.cwd()}/handlers/functions`);

module.exports = (client) => {

/*MOVED TO roster.js
    var CronJob = require('cron').CronJob;
    client.Jobroster3 = new CronJob('0 *10 * * * *', function() {
        client.guilds.cache.map(guild => {
            client.roster3.ensure(guild.id, {
                rosterchannel: "notvalid",
                rosteremoji: "➤",
                rostermessage: "",
                rostertitle: "Roster",
                rosterstyle: "1",
                rosterroles: [],
                inline: false,
            })
            edit_msg3(client, guild)
        });
    }, null, true, 'America/Los_Angeles');
    client.Jobroster3.start();

    client.on("guildMemberUpdate", function (oldMember, newMember) {
        try {
            const oldRoles = [...oldMember.roles.cache.keys()].filter(x => ![...newMember.roles.cache.keys()].includes(x))
            const newRoles = [...newMember.roles.cache.keys()].filter(x => ![...oldMember.roles.cache.keys()].includes(x))
            const rolechanged = (newRoles.length || oldRoles.length)

            if (rolechanged) {
                //array for added roles
                let roleadded = [];
                if (newRoles.length > 0)
                    for (let i = 0; i < newRoles.length; i++) roleadded.push(newRoles[i])
                //array for removed roles
                let roleremoved = [];
                if (oldRoles.length > 0)
                    for (let i = 0; i < oldRoles.length; i++) roleremoved.push(oldRoles[i])
                //if role got ADDED and its one role of the db then update the embed with antispam
                if (roleadded.length > 0) {
                    client.roster3.ensure(newMember.guild.id, {
                        rosterchannel: "notvalid",
                        rostermessage: "",
                        rosterroles: [],
                      })
                    let rosterroles = client.roster3.get(newMember.guild.id, "rosterroles");
                    if (rosterroles.length === 0) return;
                    for (let i = 0; i < rosterroles.length; i++) {
                        let role = newMember.guild.roles.cache.get(rosterroles[i])
                        if(!role || role == null || role == undefined || !role.id || role.id == null) continue;
                        if (roleadded.includes(role.id)) {
                            if (oldStateMap.get("SOMETHING")) {
                                
                            }
                            else {
                                oldStateMap.set("SOMETHING", true);
                                edit_msg3(client, newMember.guild);
                                setTimeout(() => {
                                    oldStateMap.set("SOMETHING", false);
                                }, 5000)
                            }
                        }
                    }
                }
                //if role got removed and its one role of the db then update the embed with antispam
                else if (roleremoved.length > 0) {
                    client.roster3.ensure(newMember.guild.id, {
                        rosterchannel: "notvalid",
                        rosteremoji: "",
                        rostermessage: "",
                        rosterstyle: "1",
                        rosterroles: [],
                      })
                    let rosterroles = client.roster3.get(newMember.guild.id, "rosterroles");
                    if (rosterroles.length === 0) return;
                    for (let i = 0; i < rosterroles.length; i++) {
                        let role = newMember.guild.roles.cache.get(rosterroles[i])
                        if(!role || role == null || role == undefined || !role.id || role.id == null) continue;
                        if (roleremoved.includes(role.id)) {
                            if (oldStateMap.get("SOMETHING2")) {
                                
                            }
                            else {
                                oldStateMap.set("SOMETHING2", true);
                                edit_msg3(client, newMember.guild);
                                setTimeout(() => {
                                    oldStateMap.set("SOMETHING2", false);
                                }, 5000)
                            }
                        }
                    }
                }
            }
        } catch (e) {
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
        }
    });
*/
}
