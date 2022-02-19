const { Client,Collection,MessageActionRow,MessageSelectMenu, Intents } = require('discord.js');
const fs = require('fs');
const Twit = require('twit');


const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS);


const client = new Client({ intents: myIntents });
client.commands = new Collection();
const {token, consumer_keyU, consumer_secretU, access_tokenU, access_token_secretU} = require('./config.json');
//Loads Command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//Loads event files
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));


client.once('ready', () => {
	console.log('Ready!');
});

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

var T = new Twit({
    consumer_key:         consumer_keyU,
    consumer_secret:      consumer_secretU,
    access_token:         access_tokenU,
    access_token_secret:  access_token_secretU,
  })

const accounts = ['3145201245','1229537512709902342','1239957572985270272','1437808525208600581','1239960381201801219','1299120319605747713','1441155149670404100','724480381840445440','1494178414416306180']
var stream = T.stream('statuses/filter', { follow: accounts})
twitCommand = require(`./specialFunctions/tweetPost.js`);

stream.on('tweet', function (tweet) {
	console.log("please fucking work")
    twitCommand.execute(tweet, client);
	console.log("It worked?")
  })




RoleMgm = require(`./specialFunctions/RoleManager.js`);
client.on('interactionCreate', async interaction => {
    console.log(interaction)
    if (!interaction.isCommand() && !interaction.isSelectMenu() && !interaction.isButton()) return;


	if(interaction.isButton()){
		//console.log(interaction)
		if(interaction.customId == 'primary'){
			//Remove after testing write results here and rebuild a special command for this. SO YOU CAN SEND A SELECTION ROW AFTER BUTTON PRESS
		await interaction.reply({content: "Testing Stuff" , components: [row]})
		setTimeout(()=> {interaction.deleteReply()},60000)
		//await interaction.reply({ content: 'Pong!', components: [row] });
		}
	}

	if(interaction.customId === 'role'){
		RoleMgm.execute(interaction, interaction.customId)
	}

	//console.log(interaction);

	if (!client.commands.has(interaction.commandName)) return;

	try {
		await client.commands.get(interaction.commandName).execute(interaction, client);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


/* client.on('guildMemberUpdate', async (oldMember,newMember) => {
	if(newMember.roles.cache.some(role => role.name === 'ERROR')){
		for(rolex of newMember.roles.cache){
			if(rolex[1].name === '@everyone'){console.log("Nope")}
			if(rolex[1].name === 'ERROR'){console.log("Nope")}
			newMember.roles.remove(rolex[1])
		}
	}
})

 */


client.on('guildMemberRemove', async member => {
	console.log("fdgd")
	if(member.guild.id == "145107585178140673"){
		for(x of client.guilds.cache){
			try{
				if(!(x[0] === member.guild.id)){
				const memberx = x[1].members.cache.find(user => user.id === member.id)
				if(typeof memberx === "undefined"){continue}
				//might need to test for a user not being in a specific server like in OW but not LoL. I think about line takes care of that
				//YOU CANNOT REMOVE @EVERYONE. ALSO WHEN PULLING STRAIGHT FROM CACHE REMEMBER [SNOWFLAKE ID, ROLE OBJECT] YOU SPENT AN HOUR HITTING UR HEAD AGAINST THE WALL FOR WHAT?
				//nothing.
				for(roleu of memberx.roles.cache){
					console.log('////')
					if(!(roleu[1].name === '@everyone')){
						memberx.roles.remove(roleu[1])
					}
				}
				const TestRole = x[1].roles.cache.find(role => role.name == "ERROR")
				console.log(x[1].name)
				console.log(TestRole.name)
				memberx.roles.add(TestRole);
				console.log("We good")
				}
			}
			catch(error){
				console.log("error")
			}
		}
	}
})

client.login(token); //Set this to token when done
