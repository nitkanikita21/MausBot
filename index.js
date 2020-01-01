const Discord = require('discord.js')
const client = new Discord.Client()
const fs = require('fs');
const func = require("./MathFunc.js")
const config = require('./config.json')
const request = require('request-promise')
const idPROJECT = 'youtube-bot-262109'
const search = require('./search.js')
const jimp = require('jimp')
const {VM} = require('vm2');
var prefix = config.prefix
let array_emj = [] 
console.clear();
client.on("ready", ()=>{
    console.log("──────────┃Top secret┃──────────")
    client.user.setActivity(config.version)
    client.user.setStatus("idle")
    client.generateInvite(["ADMINISTRATOR"]).then(link =>{ 
        console.log(link);
    });
})
client.on('messageReactionAdd', (react, user)=>{
    if(array_emj[user.id]== undefined || user.bot)return
    if(array_emj[user.id].bool == false){  
        react.message.react(array_emj[user.id].emj).catch(err => console.error(err))
        array_emj[user.id].bool = true
    }
    if(react.emoji == array_emj[user.id].emj){  
        react.remove(client.user).catch(console.log('true'))
        array_emj[user.id] = undefined
    }
})
client.on('message', (message) => {
    if(message.content.startsWith(prefix) === false)return
    var args = message.content.split(' ')
    switch(true){
        case args[0]=== prefix+'эмж'||args[0]=== prefix+'эмоджи':
            if(args[1] === undefined)return message.channel.send('Укажите верное название емоджи!')
            if(args[1].startsWith('<'))return message.channel.send(args[1])
            var emj = message.guild.emojis.find(emoji => emoji.name.substring(0,args[1].length) === args[1])
            if(emj === null)return message.channel.send('Емодзи ненайдено / стандартные смайлы дискорда немогут быть использованы, используйте эмоджи сервера!')
            message.delete()
            message.channel.send('``'+message.author.tag+'``')
            message.channel.send(emj.toString())
        break
        case args[0]=== prefix+'стик'||args[0]=== prefix+'стикер':
            if(args[1] === undefined)return message.channel.send('Укажите верное название емоджи!')
            if(args[1].startsWith('<')){
                var cashe = args[1].split(":")
                args[1] = cashe[1]
            }
            var emj = message.guild.emojis.find(emoji => emoji.name.substring(0,args[1].length) === args[1])
            if(emj === null)return message.channel.send('Емодзи ненайдено / стандартные смайлы дискорда немогут быть использованы, используйте эмоджи сервера!')
            message.delete()
            message.channel.send(new Discord.RichEmbed({
                author:{
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                image:{
                    url: emj.url
                },
                color: 0x29498a,
            }))
        break
        case args[0]=== prefix+'шар':
            if(args[1] === undefined)return message.channel.send('Укажите о чём вы хотите спросить!')
            args.shift()
            args = args.join(" ")
            var variante = ['Возможно, но я не уверен','Я не могу тебе об этом сказать','Да','Когда ты стал такой умный, а?','Странный вопрос, попробуй задать другой','А ты как думаешь?','Погоди, я спрошу у других...','Поищи ответ в себе','Оно так и есть','Да']
            message.channel.send(new Discord.RichEmbed({
                title: args,
                description: func.getRandomElem(variante),
                author:{
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                color: 0x29498a,
            }).setTimestamp());
        break
        case args[0]=== prefix+'реакция'||args[0]===prefix+'р':
            if(args[1] === undefined)return message.channel.send('Укажите верное название емоджи!')
            if(args[1].startsWith('<')){
                var cashe = args[1].split(":")
                args[1] = cashe[1]
            }
            var emj = message.guild.emojis.find(emoji => emoji.name.substring(0,args[1].length) === args[1])
            if(emj === null)return message.channel.send('Емодзи ненайдено / стандартные смайлы дискорда немогут быть использованы, используйте эмоджи сервера!')
            message.author.send(new Discord.RichEmbed({
                author:{
                    name:'Поставьте реакцию под сообщением',
                    icon_url:emj.url
                },
                description:'Через 4 секунды после установления ботом реакции\n он снимет её',
                color: 0x29498a,
            }))
            message.react('📨')
            setTimeout(() => {
                message.delete().catch('Неудалось удалить сообщение!')
            }, 2000);
            array_emj[message.author.id] = {
                emj: emj,
                bool: false
            }
        break
        case args[0] === prefix+'ты' && args[1] === 'кто?':
            message.channel.send('Троль в пальто')
        break
        case args[0] === prefix+'ютуб'||args[0] === prefix+'youtube'||args[0] === prefix+'ют'||args[0] === prefix+'yt':
            message.channel.send(new Discord.RichEmbed({
                title:'Упсс. Сервис недоступен!',
                author:{
                    name:'YouTube',
                    icon_url: 'https://cdn.discordapp.com/emojis/335112740957978625.png?v=1'
                },
                description:'На данный момент команда не доступна!',
                color: 0xff0000
            }));
        break
        case args[0] === prefix+'новость':
            if(message.member.hasPermission('ADMINISTRATOR')===false)return
            var news = message.content.split("$")
            var news_channel = message.guild.channels.find(channel => channel.name.substring(0,news[1].length) == news[1])
            if(news_channel === null)return message.channel.send('Канал ненайден!')
            news_channel.send(new Discord.RichEmbed({
                author:{
                    name: message.author.username + ' - Новость',
                    icon_url: message.author.avatarURL
                },
                color: 0x29498a,
                description: news[2]
            }))
        break
        case args[0] === prefix+'очистить':
            args[1] = parseInt(args[1],10)
            message.channel.bulkDelete(args[1])
            message.channel.send('Очищено ``'+args[1]+'`` сообщений')
        break
        case args[0] === prefix+'run':
            let fakeconsole = {
                buf: "",
                name:'NodeJS',
                setname: (...s)=>{fakeconsole.name = s.join(" ")},
                clear: (...s)=>{fakeconsole.buf = ''},
                info: (...s) => {fakeconsole.buf += '[INFO] '+s.join(" ")+'\n'},
                log: (...s) => {fakeconsole.buf += '[LOG] '+s.join(" ")+'\n'},
                warn: (...s) => {fakeconsole.buf += '[WARN] '+s.join(" ")+'\n'},
                error: (...s) => {fakeconsole.buf += '[ERROR] '+s.join(" ")+'\n'},
                debug: (...s) => {fakeconsole.buf += '[DEBUG] '+s.join(" ")+'\n'}
            }
            fakeconsole.clear()
            const vm = new VM({
                sandbox:{
                  console: fakeconsole
                },
                require:true
            });
            let script = message.content.split('```')
            let return_script = null;
            try {
                return_script = vm.run(script[1])
                if(return_script == undefined)return_script = ''
                return_script = return_script + fakeconsole.buf
                console.log('try')
            } catch(e) {
                return_script = fakeconsole.buf+'\n'
                console.log(e.message)
                return_script = fakeconsole.buf + e.name + ": " + e.message
            };
            if(return_script == undefined)return_script = ''
            let logs = []
            console.log('BUF: '+fakeconsole.buf)
            message.channel.send(new  Discord.RichEmbed({
                title: fakeconsole.name,
                description: '```js\n'+return_script+'```'
            }))
        break
        case args[0] === prefix+'роли':
            var roles= message.member.roles.array()
            roles.shift()
            roles = roles.join('\n')
            message.channel.send(new Discord.RichEmbed({
                title: 'Роли',
                description: roles,
                author:{
                    name: message.author.tag,
                    icon_url: message.author.avatarURL
                },
                color: 0x29498a,
            }).setTimestamp());
        break
        case args[0] === prefix+'помощь':
            message.channel.send(new Discord.RichEmbed({
                author:{
                    name: `${client.user.username} - Помощь`,
                    iconURL: client.user.avatarURL
                },
                color: 0x29498a,
                description:'Мой префикс ``!``,\nа ниже мои команды:\n \n``!помощь`` - помощь по боту\n``!эмж <эмоджи/название эмоджи>`` - отправить эмоджи от имени бота (поддержка гифок)\n``!стик <эмоджи/название эмоджи>`` - отправить стикер с эмоджи от имени бота (поддержка гифок)\n``!шар <вопрос>`` - предсказания шара\n``!ты кто`` - спросить у меня кто я'
            }))
        break
        case args[0] === prefix+'изменить':
            let size = message.content.split(' ')
            let image = message.attachments.array()
            jimp.read(image[0])
                .then(imageR => {
                    size[1] = parseInt(size[1],10)
                    size[2] = parseInt(size[2],10)
                    imageR.resize(size[1], size[2]) // resize
                    imageR.getBuffer(jimp.MIME_PNG, (err , buffer)=>{
                        message.channel.send(new Discord.RichEmbed({
                            author:{
                                name:image[0].filename,
                                icon_url: buffer
                            }
                        }))
                        message.channel.send({
                            files:[
                                buffer
                            ]
                        })
                    });
                })
                .catch(err => {
                  console.error(err);
                });

        break
    }
})                
client.login(config.token);