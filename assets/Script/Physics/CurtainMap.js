let currentData = require('../GlobalData/CurrentData')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //碰撞管理器启动
        cc.director.getCollisionManager().enabled = true
    },

    start() {

    },
    onCollisionEnter(other, self) {
        if (other.tag == 2) {
            cc.log('onCollisionEnte(other, self) {')
            currentData.haveTouchedCurtainMap = true
            //睡眠两秒
            this.sleep(2000)
        }
    },
    //睡眠方法
    sleep(numberMillis) {
        var now = new Date();
        var exitTime = now.getTime() + numberMillis;
        while (true) {
            now = new Date();
            if (now.getTime() > exitTime)
                return true;
        }
    }
    // update (dt) {},
});