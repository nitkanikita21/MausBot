const Discord = require('discord.js')
const request = require('request-promise')

class youtube{
    constructor(id){
        var id = id
    }
    searchYT(q,page){
        var q = message.content.split(" ")
        q.shift
        var view_q = q
        view_q.shift()
        view_q = view_q.join(" ")
        q = q.join(' ')
        q = encodeURI(q)
        this.url = 'https://www.googleapis.com/youtube/v3/search/?q='+q+'&part=snippet&key=AIzaSyAajgWfNyXiUSynHbzgm5sTHf8AdYXYgFg&maxResults='+8*page
        const options = {
            method: 'GET',
            url: this.url,
        }
        request(options)
            .then(response => {
                var i_result = 8-(8*page)
                this.view = []
                this.limiter = 110;
                while(response.items[i_result] !== undefined){
                    this.video_url = 'https://www.youtube.com/watch?v='+response.items[i_result].id.videoId
                    this.desc = res.items[i_result].snippet.description
                    if(desc.length > limiter)this.desc = desc.slice(0,limiter--)+'...'
                    if(response.items[i_result].id.videoId === undefined)this.video_url = 'https://www.youtube.com/channel/'+response.items[i_result].id.channelId
                    this.view.push(`${i_result++}`+'.'+'['+response.items[i_result].snippet.title+']'+'('+this.video_url+')'+'\n'+this.desc)
                    i_result++
                }
                this.view = this.view.join('\n \n')
                return this.view
            })
            .catch(err =>{

            })
    }
}