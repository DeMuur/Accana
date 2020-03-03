const Discord = require('discord.js');
const botconfig = require("./botconfig.json");
const { Client, RichEmbed } = require('discord.js');
const twitterFeedsModel = require('./models/twitterFeedsModel');
const client = new Discord.Client();

const mongoose = require('mongoose', {useNewUrlParser: true}, { useUnifiedTopology: true });
mongoose.connect('mongodb://localhost/twitterFeedDatabeses');

const Twit = require('twit');

const T = new Twit({
    consumer_key:         botconfig.consumer_key,
    consumer_secret:      botconfig.consumer_key_secret,
    access_token:         botconfig.access_token,
    access_token_secret:  botconfig.access_token_secret,
});


client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    const stream = T.stream("statuses/filter", { follow: ["5402612", "1652541", "831470472", "26792275", "380648579", "426802833", "144274618", "31696962", "1642135962", "16561457"]});
    const scr_name = ['BBCbreaking', 'Reuters', 'pewglobal', 'ForeignPolicy', 'AFP', 'AP_Politics', 'economics', 'dw_europe', 'BBCNewsAsia', 'RadioFreeAsia']

    stream.on("tweet", function (tweet) {
        if(!scr_name.includes(tweet.user.screen_name)) return;
            client.channels.get("646745474514026506").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
    });

    const secondStream = T.stream("statuses/filter", {follow: "2985479932"});
    const secondScr_name = "BNODesk"

    secondStream.on("tweet", function (tweet){
        console.log(tweet.user.screen_name)
        if(secondScr_name.includes(tweet.user.screen_name)) {
            const tweetContent = tweet.text.split(" ");
            console.log(tweetContent)
            const filteredWords = ['thank', 'Thank', 'you', 'you.', 'you!']
            console.log("It does include Breakin: " + tweetContent.includes("BREAKING:"))
            if(!filteredWords.some(word => tweet.text.includes(word))){
                if(tweetContent.includes("BREAKING:")){
                    console.log("It does include breaking (after if-statement): " + tweetContent.includes("BREAKING:"))
                    client.channels.get("645733080061181965").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                    client.channels.get('645733080061181965').send('I found out this tweet covers important news')
                    } else if(!tweet.text.startsWith("@")){
                        client.channels.get("645733080061181965").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
                        client.channels.get("645733080061181965").send(`Hello <@283206528004259850>, there is a new tweet!`)
                 }
            }
          }
    });
    //GRUNNstream
    const thirdStream = T.stream("statuses/filter", { follow: ["14907733", "22465767", "18549902", "451432440", "97639259", "2343981858"]});
    const thirdScr_name = ['rtvnoord', 'oogtv', 'dvhn_nl', 'P2000Groningen', 'polgroningen', 'Sikkom050']

    thirdStream.on("tweet", function (tweet) {
        if(thirdScr_name.includes(tweet.user.screen_name)) {
            client.channels.get("632705489108729867").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
        }
    });
    // intelstream
    const fourthStream = T.stream("statuses/filter", {follow: ['3331851939', '2407993940', '1140336427550552000', '2790057867', '2315512764', '1517300821', '70529694', '62248461', '146958450', '85904241', '762565517026664400']});
    const fourthScr_name = ['IntelCrab', 'IntelDoge', 'IntelAgencyNGO', 'lummideast', 'bellingcat', 'obretix', 'JanesINTEL', 'BarzanSadiq', 'ragipsoyly', 'leventkemal', 'OmerOzkizilcik']

    fourthStream.on("tweet", function (tweet) {
        if(fourthScr_name.includes(tweet.user.screen_name)) {
            client.channels.get("646745512011235339").send(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);
        }
    });
});


module.exports.run = client.on('message', message => {

    if (!message.content.startsWith(botconfig.prefix) || message.author.bot) return;

    const args = message.content.slice(botconfig.prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    if (command.length === 0) {
		return message.channel.send(`I ain't gonna fill the command in by myself fam`);
    }

    if (command === 'add_twitter_feed'){
        if (!args.length){ 
            return message.channel.send("Please enter a valid value!")};
        var twitterUsername_feed = args;
        T.get('users/show', { screen_name: twitterUsername_feed.join() },  function (err, data, response) {
            console.log(data.id)
        const twitterFeedVar = new twitterFeedsModel({
            _id: mongoose.Types.ObjectId(),
            twitterUsernameAddedToFeed: twitterUsername_feed.join(),
            twitterUsername_idAddedToFeed: data.id,
        })
       
        twitterFeedVar.save()
        .then(result => console.log(result))
        .catch(err => console.log(err))

        twitterFeedVar.find()
        .then(doc => {
        message.channel.send(doc)
        })
    }) 
    }
    /*if (command === `savelist`) {
        Test.find()
        .then(doc => {
        message.channel.send(doc)
        })
    }
    */
    if (command === 'twitter_user_id'){
        if (!args.length){ 
            return message.channel.send("Please enter a valid value!")};
        var twitterUsername_lookup = args;
        console.log(`${message.member.user.tag} requested the ID of the following user: ` + twitterUsername_lookup.join())
        T.get('users/show', { screen_name: twitterUsername_lookup.join() },  function (err, data, response) {
            console.log(data)
        message.channel.send(`This is the ID of ` + twitterUsername_lookup.join() + `: ` + data.id)
            if (!data.id) {
                return message.channel.send(`Twitter user not found.`)
            }
            
        })
        message.delete()
    }

    if (command === `hello`){
        return message.channel.send("Hi there :)")
    }

    if (command === `feedlist`){
        var scr_name2 = ['BBCbreaking', 'Reuters', 'pewglobal', 'ForeignPolicy', 'AFP', 'AP_Politics', 'economics', 'dw_europe', 'BBCNewsAsia', 'RadioFreeAsia']
        return message.channel.send(scr_name2)
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
