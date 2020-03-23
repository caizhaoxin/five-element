cc.Class({
    extends: cc.Component,
    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //内圈
        this.innerCircle = this.node.getParent().getParent().getParent().getChildByName('circle').getChildByName('innerCircle')
        ///监听触摸开始
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        //监听触摸在区域内离开
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        //监听触摸在区域外离开
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_end, this);
    },
    //触摸监听开始回调函数
    on_touch_start(t) {
        this.innerCircle.setScale(0.9);
    },
    //触摸监听离开回调函数
    on_touch_end(t) {
        this.innerCircle.setScale(1);
    },
    start() {

    },

    // update (dt) {},
});
