let globalMusicSource = require('./GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,
    properties: {
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
        bgm: {
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
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        let that = this
        //bgm
        // let url = { url: 'http://134.175.7.229/cocoSourceGetter.php?url=http://134.175.7.229/happy.mp3', type: 'mp3' }
        // cc.loader.load(url, function (err, clip) {
        //     let bgmVal = cc.audioEngine.play(clip, true, globalMusicSource.maximumVolume / 2);
        //     globalMusicSource.bgm = bgmVal
        // });
        if (globalMusicSource.bgm == null) {
            let bgmVal = cc.audioEngine.play(this.bgm, true, globalMusicSource.maximumVolume / 2);
            globalMusicSource.bgm = bgmVal
        }
        //各种音效
        globalMusicSource.acoustics = globalMusicSource.maximumVolume / 2
        globalMusicSource.mentionsound = this.mentionsound
        globalMusicSource.button = this.button
        globalMusicSource.ding = this.ding
        globalMusicSource.failure = this.failure
        globalMusicSource.success = this.success
        globalMusicSource.swoosh = this.swoosh
    },

    start() {

    },

    // update (dt) {},
});
