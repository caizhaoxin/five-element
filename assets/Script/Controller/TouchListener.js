cc.Class({
    extends: cc.Component,
    properties: {
        x: 0,
        y: 0,
        speedLimit: 300,
        ball: cc.Component
    },
    onLoad() {
        //监听触摸开始
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        //监听触摸移动
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        //监听触摸在区域内离开
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        //监听触摸在区域外离开
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_end, this);
    },
    //触摸监听开始回调函数
    on_touch_start(t){

    },
    //触摸监听移动回调函数
    on_touch_move(t) {
        
    },
    //触摸监听离开回调函数
    on_touch_end(t) {
        
    },
    start() {

    },
    update(dt) {

    },
});
