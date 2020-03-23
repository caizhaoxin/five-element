cc.Class({
    extends: cc.Component,
    properties: {
        rigidBody: null,  //
        is_move_hori: null, //
        is_move_verti: null, //
        acceleration: 10,
        speedLimit: 300,
        canController: true
    },
    // LIFE-CYCLE CALLBACKS:
    // onLoad () {},
    start() {
        this.rigidBody = this.node.getComponent(cc.RigidBody)
        this.is_move_hori = 0
        this.is_move_verti = 0
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.on_key_down, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.on_key_up, this)
    },
    on_key_down(e) {
        var rigidBody = this.rigidBody
        //cc.log(e.keyCode)
        switch (e.keyCode) {//上38 下40 左37 右39
            case 38://上
                this.is_move_verti = 1
                break
            case 40://下
                this.is_move_verti = -1
                break
            case 37://左
                this.is_move_hori = -1
                break
            case 39://右
                this.is_move_hori = 1
                break
        }
    },
    on_key_up(e) {
        var rigidBody = this.rigidBody
        //cc.log(e.keyCode)
        switch (e.keyCode) {//上38 下40 左37 右39
            case 38:
                this.is_move_verti = 0
                break
            case 40:
                this.is_move_verti = 0
                break
            case 37:
                this.is_move_hori = 0
                break
            case 39:
                this.is_move_hori = 0
                break
        }
    },
    on_player_move_hori() {
        var rigidBody = this.rigidBody
        var acceleration = this.acceleration
        var v = rigidBody.linearVelocity
        v.x += acceleration * this.is_move_hori
        if (v.x > this.speedLimit || v.x < -this.speedLimit) {
            return
        }
        rigidBody.linearVelocity = v
    },
    on_player_move_verti() {
        var rigidBody = this.rigidBody
        var acceleration = this.acceleration
        var v = rigidBody.linearVelocity
        v.y += acceleration * this.is_move_verti
        if (v.y > this.speedLimit || v.y < -this.speedLimit) {
            return
        }
        rigidBody.linearVelocity = v
    },
    update(dt) {
        if (this.getComponent(cc.RigidBody) == null) return
        //不能被控制中
        if (!this.canController) return
        var rigidBody = this.rigidBody
        //cc.log(this.rigidBody.linearVelocity.x)
        if (this.is_move_hori !== 0) {
            this.on_player_move_hori()
        }
        if (this.is_move_verti !== 0) {
            this.on_player_move_verti()
        }
    },
});
