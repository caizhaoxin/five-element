let globalMusicSource = {
    //最大音量大小
    maximumVolume: 5,
    //背景音乐大小
    bgmVolume: 0,
    //音效大小
    acoustics: 0,
    //音效资源
    button: {
        type: cc.AudioClip,
        default: null,
    },
    ding: {
        type: cc.AudioClip,
        default: null,
    },
    failure: {
        type: cc.AudioClip,
        default: null,
    },
    success: {
        type: cc.AudioClip,
        default: null,
    },
    swoosh: {
        type: cc.AudioClip,
        default: null,
    },
    mentionsound: {
        type: cc.AudioClip,
        default: null,
    },
    //bgm对象
    bgm: null
}

module.exports = globalMusicSource;