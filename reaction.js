            var q = message.content.split(" ")
            q.shift
            var view_q = q
            var results = 6
            view_q.shift()
            view_q = view_q.join(" ")
            q = q.join(' ')
            q = encodeURI(q)
            const options = {
                method: 'GET',
                url: 'https://www.googleapis.com/youtube/v3/search/?q='+q+'&part=snippet&key=AIzaSyAajgWfNyXiUSynHbzgm5sTHf8AdYXYgFg&maxResults='+results,
            }
            request(options)
                .then(function (response) {
                    var fileData = response
                    fs.writeFileSync('./log.log',fs.readFileSync('./log.log')+'\n'+fileData);
                    console.log(response)
                    var res = JSON.parse(response)
                    console.log(res)
                    var i = 0;
                    var list = [];
                    var numb = 1;
                    var limiter = 100;
                    while(res.items[i] !== undefined){
                        var id = res.items[i].id.videoId
                        var url = null;
                        var desc = res.items[i].snippet.description
                        var live = ''
                        if(desc.length > limiter)desc = desc.slice(0,limiter--)+'...'
                        if(res.items[i].snippet.liveBroadcastContent === 'live')live = '``🔴``__``LIVE``__'
                        if(id === undefined)url = res.items[i].id.channelId
                        url = 'https://www.youtube.com/watch?v='+id
                        if( res.items[i].id.channelId !== undefined)url = 'https://www.youtube.com/channel/'+id
                        list.push(`${numb}. ${live} **__ [${res.items[i].snippet.title}](https://www.youtube.com/watch?v=${id})__**\n${desc}\n`+'**Автор** ``'+res.items[i].snippet.channelTitle+'``');
                        numb++
                        i++
                    }
                    list = list.join("\n \n")
                    message.channel.send(new Discord.RichEmbed({
                        title:'Результаты по запросу \n'+view_q,
                        author:{
                            name:'YouTube',
                            icon_url: 'https://cdn.discordapp.com/emojis/335112740957978625.png?v=1'
                        },
                        description: list,
                        color: 0xff0000
                    }))
                })
                .catch(function (err) {
                    message.channel.send('err')
                    console.log(err)
                })