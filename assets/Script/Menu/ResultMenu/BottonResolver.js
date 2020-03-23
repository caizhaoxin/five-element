let CurrentData = require('../../GlobalData/CurrentData')
let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,

    properties: {
        //用于延长跳转时间，因为单线程我也是实在没办法
        countStart: false,
        sleepCount: 0,
        scene: null
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onClickBotton(obj, data) {
        //恢复不放bgm
        cc.audioEngine.resume(globalMusicSource.bgm);
        //按钮点击音效button
        cc.audioEngine.play(globalMusicSource.button, false, globalMusicSource.acoustics);
        //下一个跳转场景
        let scene = this.scene
        //下一关
        if (data == 'nextLevel') {
            let nextLevel = this.node.getChildByName('nextLevel')
            //shadow打开
            nextLevel.getChildByName('shadow').active = true
            //设置全局当前关卡为下一关
            CurrentData.currentRoundNum++
            //下一关，走
            this.scene = "round"
        }
        //再来一次
        else if (data == 'winOnceMore' || data == 'lostOnceMore') {
            let onceMore = this.node.getChildByName(data)
            //shadow打开
            onceMore.getChildByName('shadow').active = true
            //重来
            this.scene = "round"
        }
        //回到主菜单
        else if (data == 'homeMenu') {
            let homeMenu = this.node.getChildByName('homeMenu')
            //shadow打开
            homeMenu.getChildByName('shadow').active = true

            cc.log('shadow:', )

            //回到主菜单
            this.scene = "homeMenu"
        }
        //用于全部通关
        //再来一次
        else if (data == 'playThroughOnceMore') {
            let onceMore = this.node.getChildByName('clearanceScene').getChildByName(data)
            //shadow打开
            onceMore.getChildByName('shadow').active = true
            //重来
            this.scene = "round"
        }
        //回到主菜单
        else if (data == 'playThroughHomeMenu') {
            let homeMenu = this.node.getChildByName('clearanceScene').getChildByName('playThroughHomeMenu')
            //shadow打开
            homeMenu.getChildByName('shadow').active = true

            cc.log('shadow:', )

            //回到主菜单
            this.scene = "homeMenu"
        }
        //等待一秒后，跳入下一个场景
        this.countStart = true
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
    },
    update(dt) {
        if (this.countStart) {
            this.sleepCount++
            if (this.sleepCount > 50) {
                this.sleepCount = 0
                this.countStart = false
                cc.director.loadScene(this.scene)
            }
        }
    },
});
