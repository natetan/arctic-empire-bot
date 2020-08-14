const Discord = require('discord.js');
const _ = require('lodash');

const displayUtils = require('./displayUtils');
const logos = require('../resources/logos.json');

const prefix = process.env.prefix || '?';

function createGeneralHelpEmbed(commands) {
  let desc = '`[param]` = optional\n`<param>` = required\n';
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle('General Commands')
    .setDescription(desc)
    .setThumbnail(logos.main);
  let generalCommands = Object.keys(commands.general);
  generalCommands.forEach((c) => {
    embed.addField(`**${c}** - *${commands.general[c].desc}*`, `\`${prefix}${c} ${commands.general[c].usage}\`\n`);
  });
  return embed;
}

function createSpecializedHelpEmbed(commands) {
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle('Specialized Commands')
    .setThumbnail(logos.main);
  let specializedCommands = Object.keys(commands.specialized);
  specializedCommands.forEach((c) => {
    embed.addField(`${c} - ${commands.specialized[c].desc}`, commands.specialized[c].options);
  });
  return embed;
}

function createMemeEmbed(meme) {
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle(`r/${meme.subreddit}`)
    .setDescription(meme.title)
    .setImage(meme.url)
    .setURL(meme.postLink);
  return embed;
}

function createSongEmbed(song) {
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle(song.name)
    .setThumbnail(song.album.images[0].url)
    .setURL(song.external_urls.spotify);
  let desc = `Artist: ${song.artists[0].name}\n`
    + `Album: ${song.album.name}\n`
    + `Release Date: ${song.album.release_date}\n`
    + `Track ${song.track_number} of ${song.album.total_tracks}\n`
  // embed.setDescription(desc);
  embed.addField('Artist', song.artists[0].name);
  embed.addField('Album', song.album.name);
  embed.addField('Release Date', song.album.release_date);
  embed.addField('Track', `${song.track_number} of ${song.album.total_tracks}`);
  embed.addField('Length', displayUtils.millisToMinutesAndSeconds(song.duration_ms));
  return embed;
}

function createAlbumEmbed(album, tracks) {
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle(album.name)
    .setThumbnail(album.images[0].url)
    .setURL(album.external_urls.spotify);
  let desc = `Artist: ${album.artists[0].name}\n`
    + `Release Date: ${album.release_date}\n`
    + `Tracks: ${album.total_tracks}\n`;
  let tracksDisplay = '';
  tracks.forEach((t) => {
    tracksDisplay += `${t.track_number}:\t`
      + `**${t.name}**\t`
      + `(${displayUtils.millisToMinutesAndSeconds(t.duration_ms)})\n`;
  });
  desc += `\n${tracksDisplay}`
  embed.setDescription(desc);
  return embed;
}

const createSimpleMessageEmbed = (name, message) => {
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle(name)
    .setDescription(message);
  return embed;
}

function createExampleEmbed() {
  let embed = new Discord.MessageEmbed()
    .setColor(logos.color)
    .setTitle('Example Embed - Testing Purposes')
    .setDescription('These are used for debugging and trying things out. !trial')
    .setThumbnail(logos.sap['2']);
  return embed;
}

module.exports = {
  createGeneralHelpEmbed,
  createSpecializedHelpEmbed,
  createMemeEmbed,
  createSongEmbed,
  createAlbumEmbed,
  createSimpleMessageEmbed,
  createExampleEmbed
}