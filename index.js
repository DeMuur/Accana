const Discord = require('discord.js');
const client = new Discord.Client();
const { Client, RichEmbed } = require('discord.js');
const botconfig = require("./botconfig.json");

const Twit = require('twit');

const T = new Twit({
    consumer_key:         botconfig.consumer_key,
    consumer_secret:      botconfig.consumer_secret,
    access_token:         botconfig.access_token,
    access_token_secret:  botconfig.access_token_secret,
});


    
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    var stream = T.stream("statuses/filter", { follow: ["14907733", "18549902", "1140336427550552065", "97639259"]});
    
    var scr_name = ['IntelAgencyNGO', 'dvhn_nl', 'rtvnoord', 'polgroningen']

    stream.on("tweet", function (tweet) {
        console.log(tweet.user.screen_name)
        if(!scr_name.includes(tweet.user.screen_name)) return;
            client.channels.get("632705489108729867").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
    });
});
client.on("message", async message => {

    if (!message.content.startsWith(botconfig.prefix) || message.author.bot) return;

    const args = message.content.slice(botconfig.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command.length === 0) {
		return message.channel.send(`I ain't gonna fill the command in by myself fam`);
    }

    if (command === `hello`){
        return message.channel.send("Hi there :)")
    }


    if (command === `reload`) {
        message.channel.send(`Reloading...`)
        console.clear();
           client.destroy()
           client.login(botconfig.token);
         message.channel.send(`Bot reloaded succesfully!`);
     return;
    }

    if (!message.content.command) {
        return message.channel.send(`that's not a valid command`);
    }

});


client.login(botconfig.token);
