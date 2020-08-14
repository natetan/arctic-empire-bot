const eu = require('../utils/embedUtils');

module.exports = {
  name: 'help',
  desc: 'List all of my commands or info about a specific command.',
  async execute(message, args, client) {
    const generalObj = {};
    const specialObj = {};

    const { commands } = message.client;

    const generalCommands = commands.filter((command) => {
      return command.commandType === 'general';
    });

    generalObj[this.name] = {
      desc: this.desc,
      usage: this.usage ? this.usage : ''
    };
    generalCommands.forEach((c) => {
      let obj = {};
      obj.desc = c.desc;
      obj.usage = c.usage || '';
      generalObj[c.name] = obj;
    });

    let specialCommands = commands.filter((command) => {
      return command.commandType === 'special';
    });

    let imgenCommands = [];
    let quoteCommands = [];
    let trialCommands = [];
    const specialCommandMap = {
      'imgen': imgenCommands,
      'quotes': quoteCommands
    };
    specialCommands.forEach((c) => {
      specialCommandMap[c.category].push(c.name);
    });

    specialObj['imgen'] = {
      desc: 'Image manipulation for the memes.',
      options: imgenCommands.join(', ')
    }

    specialObj['quotes'] = {
      desc: 'Quotes from ESO and other places.',
      options: quoteCommands.join(', ')
    }

    const mainObj = {
      general: generalObj,
      specialized: specialObj
    };

    const generalEmbed = eu.createGeneralHelpEmbed(mainObj);
    const specialEmbed = eu.createSpecializedHelpEmbed(mainObj);

    const channel = message.channel;
    
    try {
      await channel.send(generalEmbed);
      return channel.send(specialEmbed);
    } catch (err) {
      console.log(`ERROR: Command <halp> failed.\n\tMessage: [${message}]\n\tError: [${err}]`);
      message.channel.send('There was an error.');
    }
  }
};