const Discord = require('discord.js');
const botconfig = require("./botconfig.json");
const { Client, RichEmbed } = require('discord.js');
const Test = require('./models/test')
const client = new Discord.Client();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Test');

const Twit = require('twit');

const T = new Twit({
    consumer_key:         botconfig.consumer_key,
    consumer_secret:      botconfig.consumer_key_secret,
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
            client.channels.get("632670676016431132").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
    });

});

module.exports.run = client.on('message', message => {

    if (!message.content.startsWith(botconfig.prefix) || message.author.bot) return;

    const args = message.content.slice(botconfig.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command.length === 0) {
		return message.channel.send(`I ain't gonna fill the command in by myself fam`);
    }

    if (command === 'save'){
        if (!args.length){ 
            return message.channel.send("Which message do you want to be saved?")};
        var usernameTest = message.member.user.tag;
        var messageContentTest = args;
        message.channel.send(`Your message is saved succesfully ${usernameTest}`);
        console.log(usernameTest);
        console.log(messageContentTest);
        
        const test = new Test({
            _id: mongoose.Types.ObjectId(),
            username: usernameTest,
            username_id: message.member.id,
            messageContent: messageContentTest.join(' ')
        })
            
        test.save()
        .then(result => console.log(result))
        .catch(err => console.log(err))
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

});

module.exports.help = {
    name: "testtest"
}


client.login(botconfig.token);
