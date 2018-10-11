'use_strict'

const Discord = require('discord.js')
const config = require('./config.json')

const completemsg = `¡Muchas gracias por verificar tu cuenta! Espero que disfrutes mucho en Chill Nation y tengas la oportunidad de conocer a mucha gente.\n`

const shortcode = (n) => {
    const possible = 'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghjklmnopqrstuvwxyz0123456789'
    let text = ''
    for (var i = 0; i < n + 1; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text;
}

const client = new Discord.Client()

client.on('ready', () => {
    client.user.setActivity(config.playing)
    console.log(`[VERIFYBOT] Connected as ${client.user.username}#${client.user.discriminator} ${client.user.id}`)
})

client.on('guildMemberAdd', (member) => {
    if (member.user.bot || member.guild.id !== config.guild) return
    const token = shortcode(8)
    const welcomemsg = `Teclea:    **verificar**`
    console.log(`${member.user.username}#${member.user.discriminator} joined! CODE: "${token}"`)
    member.send(welcomemsg)
    member.user.token = token
})

const verifymsg = 'verificar'

client.on('message', (message) => {
    if (message.author.bot || !message.author.token || message.channel.type !== `dm`) return
    if (message.content !== (verifymsg.replace('{token}', message.author.token))) return
    message.channel.send({
        embed: {
            color: Math.floor(Math.random() * (0xFFFFFF + 1)),
            description: completemsg,
            timestamp: new Date(),
            footer: {
                text: `Verification Success`
            }
        }
    })
    client.guilds.get(config.guild).member(message.author).roles.add(config.role) // ensure this is a string in the config ("")
        .then(console.log(`TOKEN: ${message.author.token} :: Role ${config.role} added to member ${message.author.id}`))
        .catch(console.error)
})

client.on('disconnect', (event) => {
    setTimeout(() => client.destroy().then(() => client.login(config.token)), 10000)
    console.log(`[DISCONNECT] Notice: Disconnected from gateway with code ${event.code} - Attempting reconnect.`)
})

client.on('reconnecting', () => {
    console.log(`[NOTICE] ReconnectAction: Reconnecting to Discord...`)
})

client.on('error', console.error)
client.on('warn', console.warn)

process.on('unhandledRejection', (error) => {
    console.error(`Uncaught Promise Error: \n${error.stack}`)
})

process.on('uncaughtException', (err) => {
    let errmsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}/`, 'g'), './')
    console.error(errmsg)
})

client.login(process.env.B0T_TOKEN);
