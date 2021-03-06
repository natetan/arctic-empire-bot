const Discord = require('discord.js');
const { createLogger, format, transports } = require('winston');
const fs = require('fs');

const quotes = require('./resources/quotes.json');
const quoteUtils = require('./utils/quoteUtils');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const prefix = process.env.prefix || '?';

// Read all the js files in /commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // set a new item in the Collection
  // with the key as the command name and the value as the exported module
  client.commands.set(command.name, command);
}

// Configure logger
let date = new Date().toISOString();
const logFormat = format.printf(info => {
  return `${date}-${info.level}: ${JSON.stringify(info.message, null, 2)}`;
});

const logger = createLogger({
  transports: [
    new transports.Console({
      // level: level,
      format: format.combine(format.colorize(), logFormat)
    })
  ]
});

// Logs in with the given token
const token = process.env.token || require('./auth.json')['token'];
client.login(token);

client.on('ready', () => {
  logger.info('Connected');
  logger.info(`Client ID: ${client.user.id}`);
  logger.info(client.user.tag);
  logger.info(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} guilds.`);
  client.user.setActivity(`${prefix}help`);
});

/**
 * This event triggers when the bot joins a guild.
 */
client.on("guildCreate", guild => {
  logger.info(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

/**
 * This event triggers when the bot is removed from a guild.
 */
client.on("guildDelete", guild => {
  logger.info(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

const defaultChannel = process.env.announce_channel_id || require('./auth.json').bot_test_general_channel_id;
client.on('guildMemberAdd', member => {
  let retorts = quotes.retort;
  let randomQuote = quoteUtils.getQuote(retorts);
  let welcome = `Welcome <@${member.user.id}>! ${randomQuote}`;
  console.log(`Member: ${member}`);
  member.guild.channels.cache.get(defaultChannel).send(welcome);
});

client.on('message', async message => {

  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop called 'botception'
  if (message.author.bot) return;

  // If someone @'s the bot, send them a nasty retort.
  if (message.mentions.has(client.user) && !message.mentions.everyone) {
    try {
      await message.channel.send(`Hi ${message.author.username}!`);
    } catch (err) {
      console.log(`ERROR: on bot mention.\n\tMessage: [${message}]\n\tError: [${err}]`);
    }
  }

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  logger.info(`Command: ${command.name}. Message: ${message.content}. Author: ${message.author.username}.`);

  // Whenever we set args to true in one of our command files, 
  // it'll perform this check and supply feedback if necessary.
  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  try {
    command.execute(message, args, client, logger);
  } catch (error) {
    console.error(error);
    message.reply(`there was an error trying to execute that command: ${command.name}`);
  }
});