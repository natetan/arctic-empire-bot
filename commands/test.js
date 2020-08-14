module.exports = {
  name: 'test',
  desc: 'Testing shit goes here.',
  commandType: 'private',
  async execute(message, args, client) {
    try {
      client.emit('guildMemberAdd', message.member);
    } catch (err) {
      console.log(err);
    }
  }
}