const { CommandClient } = require('eris')

// Stupid ass bot creation
async function init(token) {
    const commands = new CommandClient(`Bot ${token}`, { intents: ['guilds'], maxShards: 'auto',restMode: true })
    // Register the stupid ass command
    commands.on('ready', async () => {
        await commands.bulkEditCommands([{
            name: 'ping',
            description: 'Commande de ping',
            type: 1,
        }])
    })
    // Stupid ass interaction creation event
    commands.on('interactionCreate', async (interaction) => {
        if (interaction?.data?.name === 'ping') {
            console.log(`${interaction.data.name} has been created`)
            await interaction.createMessage({
                content: 'Pong!'
            })
        }
    })
    commands.connect();
}

const tokenFromStupidCommand = process.argv[2]
init(tokenFromStupidCommand);
