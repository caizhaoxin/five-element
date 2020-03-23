let currentData = require('../../GlobalData/CurrentData')
let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,

    properties: {
        gameInstruction: cc.Component,
        gameLevelSelect: cc.Component,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
       // cc.log('onload homemenu')
    },

    start() {

    },
    onClickBotton(obj, data) {
        //按钮点击音效button
        cc.audioEngine.play(globalMusicSource.button, false, globalMusicSource.acoustics);
        //如果是开始游戏startGame
        if (data == 'startGame') {
            //设置刚开始的关卡
            currentData.currentRoundNum = 1
            cc.director.loadScene("round")
        }
        else if (data == 'instruction') {
            //说明界面打开
            this.gameInstruction.node.active = true
            //主界面关闭
            this.node.getParent().active = false
        }
        else if (data == 'stageSelect') {
            //关卡选择界面打开
            this.gameLevelSelect.node.active = true
            //主界面关闭
            this.node.getParent().active = false
        }
        else if (data == 'acoustics') {
            //音量选择界面
            let acoustics = this.node.getChildByName('acoustics(water)')
            //label打开
            acoustics.getChildByName('label').active = true
            //音效的word关闭
            acoustics.getChildByName('word').active = false
            //button关闭
            acoustics.getChildByName('button').active = false
        }
        else if (data == 'share') {
            wx.shareAppMessage({
                title: "欢迎分享！！！",
                imageUrl: ""//可以是网络图片Url也可以本地路径
            })
        }
    }
    // update (dt) {},
});
