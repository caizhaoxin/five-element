let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,

    properties: {
        //mainPage
        mainPage: cc.Component,
        //gameInstruction
        gameInstruction: cc.Component,
        //firstPage
        firstPage: cc.Component,
        //secondPage
        secondPage: cc.Component
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.firstPage.node.active = true
        this.secondPage.node.active = false
    },
    onClickBotton(obj, data) {
        if (data == 'return') {
            this.mainPage.node.active = true
            this.gameInstruction.node.active = false
        }
        else if (data == 'nextPageBoton') {
            this.firstPage.node.active = false
            this.secondPage.node.active = true
        }
        else if (data == 'prePageBoton') {
            this.firstPage.node.active = true
            this.secondPage.node.active = false
        }
        //按钮点击音效button
        cc.audioEngine.play(globalMusicSource.button, false, globalMusicSource.acoustics);
    }
    // update (dt) {},
});
