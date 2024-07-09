const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const fs = require('fs');

// Read the configuration file with error handling
let config;
try {
    config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
} catch (error) {
    console.error('Error reading config.json:', error);
    process.exit(1); // Exit the process with an error code
}

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Updated regex to include symbols in the 16 characters
    const ytRegex = /(https:\/\/(?:www\.youtube\.com\/watch\?v=|youtu\.be\/)\S*?(?:[&?]si=)[^\s&?]{16})/g;
    const matches = message.content.match(ytRegex);

    if (matches) {
        let modifiedMessage = message.content;

        matches.forEach(link => {
            const cleanedLink = link.replace(/([&?]si=)[^\s&?]{16}/, '');
            modifiedMessage = modifiedMessage.replace(link, cleanedLink);
        });

        try {
            // Define the path to your PNG image
            const imagePath = './Explainer.png';
            const attachment = new AttachmentBuilder(imagePath);

            await message.author.send({
                content: `Your modified message: \n\`\`\`\n ${modifiedMessage}\n\`\`\``,
                files: [attachment]
            });
            await message.delete();
        } catch (error) {
            console.error('Error sending DM or deleting message:', error);
        }
    }
});

client.login(config.token);
