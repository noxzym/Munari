module.exports = class MunariSongManager {
    constructor(video, message) {
        this.title = video.title
        this.identifier = video.identifier
        this.author = video.author
        this.duration = video.duration
        this.nowplaying = video.nowplaying
        this.url = video.url
        this.thumbnail = video.thumbnail
        this.requester = message
    }
}