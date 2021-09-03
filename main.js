// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed } = require('discord.js');
const { token, guildId } = require('./config.json');
const { senior, junior, sophomore, freshman, announcements, channelId } = require('./roles.json');
// Create a new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'CHANNEL', 'GUILD_MEMBER', 'USER'],
});

client.on('ready', () => {
	console.log("Permy is ready to go!");

	let sendMessage = false;
	//Create the embed on the server
	let introEmbed = new MessageEmbed()
		.setTitle("React to get server roles!")
		.setDescription("React below to get server roles based on the current year that you are in school along with a few other roles as well!")
		.addFields(
			{ name: "School Year Roles", value: "🟩 - @Senior\n🟦 - @Junior\n🟪 - @Sophomore\n🟥 - @Freshman"},
			{ name: "Server Based Roles", value: "📢 - @Announcements"}
		)

	if (sendMessage == true) {
		let channelToSend = client.channels.cache.get(channelId);
		channelToSend.send({embeds: [introEmbed]});
	}
});

client.on('messageReactionAdd', async (reaction, user) => {

	// When a reaction is received, check if the structure is partial. This will then make the reaction become impartial
	if (reaction.partial) {
		//This checks to make sure that the reaction is partial and the image is cached as well
		try {
			await reaction.fetch();
			console.log("Reaction Fetched");
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
	//Once this has checked for the first reaction to see if it is impartial, it will then add the role to the user
	if (!reaction.partial) {
		if (reaction.message.channelId == channelId.toString()) {
			console.log("The channel is the right channel");
		}
		else {
			return;
		}
		//variables needed to add the role
		let messageString = reaction.emoji.toString()
		console.log(messageString)
		let role = null;
		let guildMember = null;
		let serverGuild = null;
		let pickedRole = null;

		//Get the current guild and guild member.
		serverGuild = client.guilds.cache.get(guildId);
		guildMember = serverGuild.members.cache.get(user.id);

		//Switch case to determine the role of the user
		switch (messageString) {
			case "🟩":
				removeSchoolYearRoles(guildMember, serverGuild);
				pickedRole = senior;
				console.log("Got the senior role")
				break;
			case "🟦":
				removeSchoolYearRoles(guildMember, serverGuild);
				pickedRole = junior;
				console.log("Got the junior role")
				break;
			case "🟪":
				removeSchoolYearRoles(guildMember, serverGuild);
				pickedRole = sophomore;
				console.log("Got the sophomore role")
				break;
			case "🟥":
				removeSchoolYearRoles(guildMember, serverGuild);
				pickedRole = freshman;
				console.log("Got the freshman role")
				break;
			case "📢":
				pickedRole = announcements;
				console.log("Got the announcement role")
				break;
			default:
				break;
		}
		//Check to remove any other school year roles based on the one selected
		if (pickedRole != null) {
			let roleToAdd = getRole(serverGuild, pickedRole);
			guildMember.roles.add(roleToAdd);
			console.log("Added role " + roleToAdd.name + " to " + guildMember.displayName)
		}
	}	
});

//This function helps to remove the school year roles as needed
function removeSchoolYearRoles(guildMember, serverGuild) {
	seniorRole = serverGuild.roles.cache.find((role) => role.id === senior);
	juniorRole = serverGuild.roles.cache.find((role) => role.id === junior);
	sophomoreRole = serverGuild.roles.cache.find((role) => role.id === sophomore);
	freshmanRole = serverGuild.roles.cache.find((role) => role.id === freshman);

	guildMember.roles.remove(seniorRole);
	guildMember.roles.remove(juniorRole);
	guildMember.roles.remove(sophomoreRole);
	guildMember.roles.remove(freshmanRole);

}

//This gets the desired role based on the parameters.
function getRole(serverGuild, requiredRole) {
	let role = serverGuild.roles.cache.find((role) => role.id === requiredRole)
	return role;
}

client.login(token);