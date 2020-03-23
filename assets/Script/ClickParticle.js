cc.Class({
    extends: cc.Component,

    properties: {
        clickPar: cc.Prefab
    },

    // onLoad () {},
    start() {
        this._initNodeTouchEvent();
    },
    _initNodeTouchEvent() {
        //监听事件
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch, this);
    },

    _destroyTouchEvent() {
        //销毁事件
        this.node.off(cc.Node.EventType.TOUCH_START, this.on_touch, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.on_touch, this);
    },
    on_touch: function (event) {
        //获取当前点击的全局坐标
        let temp = event.getLocation();
        //获取当前点击的局部坐标
        let tempClick = this.node.convertToNodeSpaceAR(temp)
        this.newClickNode(tempClick, function (node) {
            if (!node) return

            //杀死所有存在的粒子，然后重新启动粒子发射器。
            node.getComponent(cc.ParticleSystem).resetSystem();

            this.node.children.forEach(element => {

                if (element.name === 'clickNode') {

                    //获取粒子系统组件
                    let particle = element.getComponent(cc.ParticleSystem);

                    //指示粒子播放是否完毕
                    if (particle.stopped) {
                        //特效播放完毕的节点放入对象池
                        this._clickPool.put(element);
                        // cc.log("顺利回收...");
                    }
                }
            });
        }.bind(this));
    },
    onDestroy() {
        //销毁事件
        this._destroyTouchEvent();
    },
    //使用对象池动态实例化预制资源
    newClickNode(position, callBack) {
        let that = this
        let newNode = null;
        if (!this._clickPool) {
            //初始化对象池
            this._clickPool = new cc.NodePool();
        }
        if (this._clickPool.size() > 0) {
            //从对象池请求对象
            newNode = this._clickPool.get();
            this.setClickNode(newNode, position, callBack);
        } else {
            newNode = cc.instantiate(that.clickPar);
            this.setClickNode(newNode, position, callBack);
        }

    },

    setClickNode(newNode, position, callBack) {
        newNode.name = "clickNode"; //设置节点名称
        newNode.setPosition(position); //设置节点位置
        this.node.addChild(newNode); //将新的节点添加到当前组件所有节点上
        if (callBack) {
            callBack(newNode); //回调节点
        }

    },
    // update (dt) {},
});