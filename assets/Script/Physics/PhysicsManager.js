cc.Class({
    extends: cc.Component,
    properties: {
        is_dubug: false,
        gravity: cc.v2(0, -320)
    },

    onLoad() {
        //启动物理管理器，即开启物理碰撞效果
        cc.director.getPhysicsManager().enabled = true
        //开启调试模式
        if (this.is_dubug) {
            var Bits = cc.PhysicsManager.DrawBits //显示的类型
            cc.director.getPhysicsManager().debugDrawFlags = Bits.e_jointBit | Bits.e_shapeBit
        }
        else {
            cc.director.getPhysicsManager().debugDrawFlags = 0
        }
        //重力加速度的配置
        cc.director.getPhysicsManager().gravity = this.gravity
    },
    start() {

    },

    // update (dt) {},
});
