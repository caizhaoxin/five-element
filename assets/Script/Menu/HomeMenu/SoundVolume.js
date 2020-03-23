let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    //Handle移动
    onHandleMove(obj, data) {
        if (data == 'BGM') {
            //设置背景音乐音量大小
            globalMusicSource.bgmVolume = globalMusicSource.maximumVolume * obj.progress
            cc.audioEngine.setVolume(globalMusicSource.bgm, globalMusicSource.bgmVolume);
        }
        else if (data == 'soundEffect') {
            //设置音效音量大小
            globalMusicSource.acoustics = globalMusicSource.maximumVolume * obj.progress
        }
    }
    // update (dt) {},
});
