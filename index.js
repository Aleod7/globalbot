const { Client, REST, Routes, GatewayIntentBits, SlashCommandBuilder, ActivityType, WebhookClient } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const rest = new REST({ version: '10' }).setToken(process.argv[2]);
async function init(token) {
  client.on('ready', () => {
    console.log(`Connecté sur discord sous pseudo: ${client.user.tag}!`)
    let i = 0
    setInterval(() => {
      if (i === 0) {
        client.user.setPresence({ activities: [{ name: 'vers la Gauche', type: ActivityType.Watching }], status: 'idle' });
        i = 1
      } else {
        client.user.setPresence({ activities: [{ name: 'rien avec moi même', type: ActivityType.Playing }], status: 'idle' });
        i = 0
      }
    }, 5000);
    });

  //si un message contient bonjour, dire bonjour
  client.on('messageCreate', (message) => {
    const mctl = message.content.toLowerCase()
    if (mctl === "bonjour" || mctl === "salut" || mctl === "hey") {
      message.react("👋")
    }
  });

  client.on('messageCreate', async (message) => {
    const droiteagauche = message.content.toLowerCase()
    const verify = droiteagauche.includes("droite")
    if (verify) {
      message.delete()
      message.channel.createWebhook({
        name: message.member.displayName,
        avatar: message.author.avatarURL(),
      }).then(wb => {
        const webhook = new WebhookClient({ id: wb.id, token: wb.token });
        webhook.send(message.content.toLowerCase().replace(/droite/g, "gauche"))
        webhook.delete()
          .catch(console.error);
      })
        .catch(console.error);
    }
  });

  // créer commande ping
  const ping = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Commande de ping')

  // créer commande help
  const help = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Commande d\'aide')

  // créer commande say
  const say = new SlashCommandBuilder()
    .setName('say')
    .setDescription('Commande de say')
    .addStringOption(option => option.setName('message').setDescription('Message à envoyer').setRequired(true))

  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) {
      return
    }

    const { commandName, options } = interaction

    // finaliser commande ping
    if (commandName === 'ping') {
      interaction.reply({
        embeds: [{
          title: '🏓 Pong!',
          description: `${interaction.member.user} a utilisé•e **/ping**.`,
          color: 0x00ff00,
          fields: [{
            name: 'Latence',
            value: `\`${Date.now() - interaction.createdTimestamp}\`ms`,
            inline: true,
          }, {
            name: 'Latence API',
            value: `\`${Math.round(client.ws.ping)}\`ms`,
            inline: true,
          }]
        }],
        //ephemeral: true,
      })
    }

    //finaliser commande help
    if (commandName === 'help') {
      interaction.reply({
        embeds: [{
          title: '📖 Liste des commandes',
          description: 'Voici la liste des commandes disponibles:',
          color: 0x00ff00,
          fields: commands?.map(command => ({
            name: `**${command.name}**`,
            value: `\`${command.description}\``,
            inline: true,
          })),
        }],
        //ephemeral: true,
      })
    }

    //finaliser commande say
    if (commandName === 'say') {
      const message = options.get('message').value.replace(/droite/g, "gauche");
      console.log(message)

      if (!message) {
        interaction.reply({
          embeds: [{
            title: '🚫 Erreur',
            description: 'Vous devez entrer un message.',
            color: 0xff0000,
          }],
          ephemeral: true,
        })
      } else {
        interaction.reply({
          content: message,
          //ephemeral: true,
        })
      }
    }

  })

  const commands = [ping.toJSON(), help.toJSON(), say.toJSON()]
  try {
    console.log(`[${new Date().toLocaleString()}] Chargement des commandes...`)
    await rest.put(Routes.applicationCommands("1041946620004139058"), {
      body: commands,
    });
    console.log(`[${new Date().toLocaleString()}] Commandes chargées avec succès.`)
    client.login(token);
  } catch (err) {
    console.log(err);
  }
}

init(process.argv[2]);
