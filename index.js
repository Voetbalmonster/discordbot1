const discord = require("discord.js");
const botConfig = require("./botconfig.json");

const fs = require("fs");

const client = new discord.Client();
client.login(botConfig.token);

fs.readdir("./commands/" , (err, files) => {

    if(err) console.log(err)

});

client.on("ready", async () => {

    console.log(`${client.user.username} is online.`);
    client.user.setActivity("Testen", {type: "Playing"});

});




client.on("message", async message =>{

if (message.author.bot) return;

if (message.channel.type == "dm") return;

var prefix = botConfig.prefix;

var messageArray = message.content.split(" ");

var command = messageArray[0];

if(command === `${prefix}hallo`){
    return message.channel.send("Hallo!");
}

if(command === `${prefix}info`){
    
   var botEmbed = new discord.MessageEmbed()
       .setTitle("Dit is alle serverinformatie")
       .setDescription("De server beschrijving wat handig kan zijn")
       .setColor("#0099ff")
       .addFields(
           {name: "Waneer bot aangemaakt", value:"1-1-2021"}
       )
       .addField("Bot naam", client.user.username)
       .setThumbnail("https://cdn-0.autostrada.tv/wp-content/uploads/2015/03/Diesel-autos-1024x576.jpg")
       .setImage("https://cdn-0.autostrada.tv/wp-content/uploads/2015/03/Diesel-autos-1024x576.jpg")
       .setFooter("Dit is de footer tekst", "https://cdn-0.autostrada.tv/wp-content/uploads/2015/03/Diesel-autos-1024x576.jpg")
       .setTimestamp();

   return message.channel.send(botEmbed)
}     


if(command === `${prefix}hallo`){
    return message.channel.send("Hallo!");
}

if(command === `${prefix}serverinfo`){
    
   var botEmbed = new discord.MessageEmbed()
       .setTitle("Dit is alle serverinformatie")
       .setDescription("De server beschrijving wat handig kan zijn")
       .setColor("#0099ff")
       .addFields(
       {name: "Bot naam", value:client.user.username},
       {name: "Je bent de server gejoined op: ", value: message.member.joinedAt},
       {name: "Totaal members", value:message.guild.memberCount}
       );

       

   return message.channel.send(botEmbed)
}

if(command === `${prefix}kick`){
    // !kick @spelerNaam redenen hier

    var args = message.content.slice(prefix.length).split(/ +/);

    if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply("Sorry dat kan jij niet gebruiken")

    if(!message.guild.me.hasPermission("KICK_MEMBERS"))return message.reply("Sorry jij hebt hier geen perms voor");

    if(!args[1]) return message.reply("Geen gebruiker opgegeven");

    if(!args[2]) return message.reply("Geen redenen opgegeven");

    var kickUser = message.guild.member( message.mentions.users.first() || message.guild.members.get(args[1]));

    var reason = args.slice(2).join(" ");

    if(!kickUser) return message.reply("Gebruiker niet gevonden");

    var embedPrompt = new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("Gelieve binnen 30 seconden te reageren")
        .setDescription(`Wil je ${kickUser}kicken?`);

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Gekickt: ** ${kickUser} (${kickUser.id}
            **Gekickt door:** ${message.author}
            **Redenen:** ${reason}`);

        message.channel.send(embedPrompt).then(async msg  =>{

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅"){

                msg.delete();

                kickUser.kick(reason).catch(err =>{
                    if(err) return message.reply("Er is iets fout gelopen");
                });

                message.channel.send(embed);
            
            }else if(emoji === "❌"){

                msg.delete();
                
                return message.reply("Kick geanuleerd").then(m => m.delete(5000));

            }
       
        })
        

}

if(command === `${prefix}ban`){
    // !ban @spelerNaam redenen hier

    var args = message.content.slice(prefix.length).split(/ +/);

    if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Sorry dat kan jij niet gebruiken")

    if(!message.guild.me.hasPermission("BAN_MEMBERS"))return message.reply("Sorry jij hebt hier geen perms voor");

    if(!args[1]) return message.reply("Geen gebruiker opgegeven");

    if(!args[2]) return message.reply("Geen redenen opgegeven");

    var banUser = message.guild.member( message.mentions.users.first() || message.guild.members.get(args[1]));

    var reason = args.slice(2).join(" ");

    if(!banUser) return message.reply("Gebruiker niet gevonden");

    var embedPrompt = new discord.MessageEmbed()
        .setColor("GREEN")
        .setTitle("Gelieve binnen 30 seconden te reageren")
        .setDescription(`Wil je ${banUser}kicken?`);

        var embed = new discord.MessageEmbed()
            .setColor("#ff0000")
            .setFooter(message.member.displayName)
            .setTimestamp()
            .setDescription(`**Verbannen: ** ${banUser} (${banUser.id}
            **Geband door:** ${message.author}
            **Redenen:** ${reason}`);

        message.channel.send(embedPrompt).then(async msg  =>{

            var emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if(emoji === "✅"){

                msg.delete();

                banUser.ban(reason).catch(err =>{
                    if(err) return message.reply("Er is iets fout gelopen");
                });

                message.channel.send(embed);
            
            }else if(emoji === "❌"){

                msg.delete();
                
                return message.reply("ban geanuleerd").then(m => m.delete(5000));

            }
       
        })
        

}


});


    client.on("guildMemberAdd", member => {

        var role = member.guild.roles.cache.get(`803168757596815380`);

        if (!role)
            return console.log("er is iets misgegaan");

        member.roles.add(role);

        var channel = member.guild.channels.cache.get(`803166698696867870`);

        if (!channel) return;

        channel.send(`Welkom bij de server hopelijk heb je veel roleplay plezier ${member}`);

    });


async function promptMessage(message, author, time, reactions){

    time *= 1000;

    for(const reaction of reactions){
        await message.react(reaction);

}

    var filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return message.awaitReactions(filter, {max:1, time: time}).then(collected => collected.first() && collected.first().emoji.name);

}

bot.login(process.env.token);