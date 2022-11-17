const { CommandClient } = require('eris')

async function init(token) {
  console.log(`[GAUCHOBOT] Bot en fonctionnement`)
  const commands = new CommandClient(`Bot ${token}`, { intents: ['guilds'], maxShards: 'auto', restMode: true })
  commands.on('ready', async () => {
    await commands.bulkEditCommands([{
      name: 'ping',
      description: 'Commande ping',
      type: 1,
    }], [{
      name: 'help',
      description: 'Commande help',
      type: 1,
    }])
  })
  commands.on('interactionCreate', async (interaction) => {
    //commande Ping
    if (interaction?.data?.name === 'ping') {
      console.log(`${interaction.data.name} utilisé`)
      await interaction.createMessage({
        embeds: [{
          title: "🏓 Pong !",
          description: "Commande **/ping** utilisé",
          color: 0x008000,
          fields: [
            {
              name: "Latence.",
              value: `\`${Date.now() - interaction.createdAt}\` ms`,
              inline: true
            }
          ],
          footer: {
            text: "GauchoBot"
          }
        }]
      })
    }
    //commande Ping
    if (interaction?.data?.name === 'help') {
      console.log(`${interaction.data.name} utilisé`)
      await interaction.createMessage({
        embeds: [{
          title: "🏓 Pong !",
          description: "Commande **/ping** utilisé",
          color: 0x008000,
          fields: [
            {
              name: "Latence.",
              value: `\`${Date.now() - interaction.createdAt}\` ms`,
              inline: true
            }
          ],
          footer: {
            text: "GauchoBot"
          }
        }]
      })
    }
  })
  commands.connect();
}

const tokenFromStupidCommand = process.argv[2]
init(tokenFromStupidCommand);
