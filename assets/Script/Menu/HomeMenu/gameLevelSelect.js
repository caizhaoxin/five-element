let currentData = require('../../GlobalData/CurrentData')
let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,

    properties: {
        level1: cc.Component,
        level2: cc.Component,
        level3: cc.Component,
        level4: cc.Component,
        //mainPage
        mainPage: cc.Component,
        //gameInstruction
        gameLevelSelect: cc.Component,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.levelArray = new Array(
            this.level1, this.level2, this.level3, this.level4
        )
        //设置level，如果通关了就不显示
        /**currentData.goThroughlevelMark[currentData.currentRoundNum - 1] */
        for (let i = 0; i < currentData.roundSum; i++) {
            if (currentData.goThroughLockMark[i]) {
                this.levelArray[i].node.getChildByName('lock').active = false
            }
            else {
                this.levelArray[i].node.getChildByName('button').getComponent(cc.Button).interactable = false
            }
        }
    },

    start() {

    },
    onClickBotton(obj, data) {
        //按钮点击音效button
        cc.audioEngine.play(globalMusicSource.button, false, globalMusicSource.acoustics);
        if (data == 'return') {
            this.mainPage.node.active = true
            this.gameLevelSelect.node.active = false
        }
        else {
            //设置刚开始的关卡
            currentData.currentRoundNum = parseInt(data)
            cc.director.loadScene("round")
        }
    }
    // update (dt) {},
});
