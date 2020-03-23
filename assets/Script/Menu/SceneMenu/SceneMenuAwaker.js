let SceneMenuData = require('SceneMenuData')
cc.Class({
    extends: cc.Component,
    properties: {
        mapInitializer: cc.Component,
        haveSetUnabsorted: false
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
        //取球球
        let ballNode = this.mapInitializer.node.getChildByName('ball')
        //cc.log(typeof v)
        if (!SceneMenuData.openTag) {
            //cc.log('asdasd')
            //设置球球不能被控制
            ballNode.getComponent('InputListener').canController = false
            ballNode.getComponent('G-SensorListener').canController = false
            //将球球的速度存到全局变量里
            SceneMenuData.v = ballNode.getComponent(cc.RigidBody).linearVelocity
            //定义速度向量，设置取球球的速度
            let v = cc.Vec2
            //速度设为0
            v.x = 0; v.y = 0;
            ballNode.getComponent(cc.RigidBody).linearVelocity = v
            //设为不能旋转
            ballNode.getComponent(cc.RigidBody).fixedRotation = true
            //如果球球为吸收状态，设为非吸收状态
            if (ballNode.getComponent('Ball').beAbsorted == true) {
                ballNode.getComponent('Ball').beAbsorted = false
                this.haveSetUnabsorted = true
            }
            //设置打开标志
            SceneMenuData.openTag = true
            //打开掩膜
            this.node.getChildByName('maskFilm').active = true
            //按钮弹出
            this.node.getChildByName('sceneMenuBotton').active = true
        }
    },
    update(dt) {
        
    },
});
