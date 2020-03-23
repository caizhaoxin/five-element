cc.Class({
    extends: cc.Component,
    properties: {
        rigidBody: null,  //
        is_move_hori: null, //
        is_move_verti: null, //
        acceleration: 10,
        speedLimit: 800,
        canController: true
    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    start() {
        this.rigidBody = this.node.getComponent(cc.RigidBody)
        //重力测试
        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onDeviceMotionEvent, this);
    },
    onDeviceMotionEvent: function (event) {
        if (this.getComponent(cc.RigidBody) == null) return
        //不能被控制中
        if (!this.canController) return
        var rigidBody = this.rigidBody
        var nowGX = event.acc.x.toFixed(2);
        var nowGY = event.acc.y.toFixed(2);
        var nowGZ = event.acc.z.toFixed(2);
        //移动
        var acceleration = this.acceleration
        var v = rigidBody.linearVelocity
        let increaseX = v.x + acceleration * nowGX * 100
        let increaseY = v.y + acceleration * nowGY * 100
        /*v.x = increaseX
        v.y = increaseY*/
        if (-this.speedLimit < increaseX && increaseX < this.speedLimit) {
            v.x = increaseX
        }
        if (-this.speedLimit < increaseY && increaseY < this.speedLimit) {
            v.y = increaseY
        }
        rigidBody.linearVelocity = v
    }
    // update (dt) {},
});
