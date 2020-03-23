let SceneMenuData = require('SceneMenuData')
let CurrentData = require('../../GlobalData/CurrentData')
let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,
    properties: {
        mapInitializer: cc.Component
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this.openTag = true
    },
    start() {
    },
    //点击了按钮
    onClickBotton(obj, data) {
        //按钮点击音效button
        cc.audioEngine.play(globalMusicSource.button, false, globalMusicSource.acoustics);
        //回到游戏
        if (data == 'buttonPlay') {
            let ballNode = this.mapInitializer.node.getChildByName('ball')
            //设回球球能被控制
            ballNode.getComponent('InputListener').canController = true
            ballNode.getComponent('G-SensorListener').canController = true
            //设回能旋转
            ballNode.getComponent(cc.RigidBody).fixedRotation = false
            //速度回去
            ballNode.getComponent(cc.RigidBody).linearVelocity = SceneMenuData.v
            //如果球球曾设为吸收非吸收状态，设回去
            if (this.haveSetUnabsorted == true) {
                ballNode.getComponent('Ball').beAbsorted = true
                this.haveSetUnabsorted = false
            }
            //关闭掩膜
            this.node.getParent().getChildByName('maskFilm').active = false
            //设置打开标志
            SceneMenuData.openTag = false
            //按钮撤回
            this.node.active = false
        }
        //回到主菜单
        else if (data == 'buttonHome') {
            //关卡数设置0
            CurrentData.currentRoundNum = 0;
            //设置会scene菜单打开标志
            SceneMenuData.openTag = false
            //回到主菜单
            cc.director.loadScene("homeMenu")
        }
        //重新开始游戏
        else if (data == 'buttonReplay') {
            //设置会scene菜单打开标志
            SceneMenuData.openTag = false
            //重新加载当前场景
            cc.director.loadScene("round")
        }
        //打开tip
        else if (data == 'buttonTips') {
            //scene上的按钮停止使用，防止用户不小心触摸
            this.node.getChildByName('buttonReplay').active = false
            this.node.getChildByName('buttonPlay').active = false
            this.node.getChildByName('buttonHome').active = false
            this.node.getParent().getChildByName('tip').active = true
        }
    }
    // update (dt) {},
});
