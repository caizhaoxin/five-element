let currentData = require('../../GlobalData/CurrentData')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //监听触摸开始
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
    },

    start() {

    },
    //触摸监听开始回调函数
    on_touch_start(t) {
        let currentRoundNum = currentData.currentRoundNum
        if (currentRoundNum == 2 || currentRoundNum == 4) {
            currentData.goThroughMark[currentData.currentRoundNum - 1] = 1
            //关闭新手导航
            this.node.getChildByName('maskFilm').active = false
            this.node.getChildByName('round0' + currentRoundNum + '_1').active = false
            this.node.active = false
        }
        else if (currentRoundNum == 1) {
            if (this.node.getChildByName('round01_1').active) {
                currentData.goThroughMark[currentData.currentRoundNum - 1] = 1
                //关闭新手导航
                this.node.getChildByName('round01_1').active = false
                this.node.getChildByName('round01_2').active = true
            }
            else {
                //关闭新手导航
                this.node.getChildByName('maskFilm').active = false
                this.node.getChildByName('round01_2').active = false
                this.node.active = false
            }
        }
    }
    // update (dt) {},
});
