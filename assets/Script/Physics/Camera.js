cc.Class({
    extends: cc.Component,

    properties: {
        resultMenu: cc.Component,
        sceneMenu: cc.Component,
        position: cc.v2
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.position = this.node.getPosition()
    },

    start() {

    },

    update(dt) {
        if (this.position != this.node.getPosition()) {
            this.position = this.node.getPosition()
            this.resultMenu.node.setPosition(this.position) 
            this.sceneMenu .node.setPosition(this.position) 
        }
    },
});
