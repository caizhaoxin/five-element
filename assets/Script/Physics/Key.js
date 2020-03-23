cc.Class({
    extends: cc.Component,
    properties: {
        //钥匙运动变量
        keymoving: 0,
        //钥匙x轴
        x: null,
        //钥匙y轴
        y: null
    },

    onLoad() {
        this.x = this.node.getPosition().x
        this.y = this.node.getPosition().y
    },
    start() {

    },

    update(dt) {
        let a
        if (this.keymoving % 4 == 0) {
            if (0 <= this.keymoving && this.keymoving <= 39) {
                this.node.setPosition(this.x, this.y++)
                this.keymoving++
            }
            else if (40 <= this.keymoving && this.keymoving <= 79) {
                this.node.setPosition(this.x, this.y--)
                this.keymoving++
            }
            else
                this.keymoving = 0
        }
        else
            this.keymoving++
    },
});
