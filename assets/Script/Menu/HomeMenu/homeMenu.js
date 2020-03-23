let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,
    properties: {
        //左箭头
        leftChevron: cc.Component,
        leftChevronMoveTag: -1,
        //右箭头
        rightChevron: cc.Component,
        rightChevronMoveTag: -1,
        //内外圈变量
        outerCircle: cc.Component,
        innerCircle: cc.Component
    },
    onLoad() {
        //子节点数组
        this.optionArray = new Array(
            this.node.getChildByName('instruction(wood)'),
            this.node.getChildByName('acoustics(water)'),
            this.node.getChildByName('startGame(fire)'),
            this.node.getChildByName('stageSelect(soil)'),
            this.node.getChildByName('exit(metal)')
        )
        //监听触摸开始
        this.node.on(cc.Node.EventType.TOUCH_START, this.on_touch_start, this);
        //监听触摸移动
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.on_touch_move, this);
        //监听触摸在区域内离开
        this.node.on(cc.Node.EventType.TOUCH_END, this.on_touch_end, this);
        //监听触摸在区域外离开
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.on_touch_end, this);
        //设置界面选项的显示
        this.setOptionShow()
    },
    //触摸监听开始回调函数
    on_touch_start(t) {

    },
    //触摸监听移动回调函数
    on_touch_move(event) {

    },
    //触摸监听离开回调函数
    on_touch_end(event) {
        let startPoint = event.currentTouch._startPoint
        let prevPoint = event.currentTouch._prevPoint
        let difference = prevPoint.x - startPoint.x
        //重新排序选项数组
        if (prevPoint.x - startPoint.x > 0) {
            this.resort(1)
            //按钮切换音效
            cc.audioEngine.play(globalMusicSource.swoosh, false, globalMusicSource.acoustics);
            this.setOptionShow()
        }
        else if (prevPoint.x - startPoint.x < 0) {
            //按钮切换音效
            cc.audioEngine.play(globalMusicSource.swoosh, false, globalMusicSource.acoustics);
            this.resort(-1)
            this.setOptionShow()
        }
    },
    //用于重新排序选项数组
    resort(flag) {
        let optionArray = this.optionArray
        //为正，数组右移
        if (flag == 1) {
            let temp = optionArray[0];
            for (let i = 0; i < 5; i++) {//调整次数
                let t = optionArray[(i + 1) % 5];
                optionArray[(i + 1) % 5] = temp;
                temp = t;
            }
        }
        //为负，数组左移
        else if (flag == -1) {
            let temp = optionArray[4];
            for (let i = 4; i >= 0; i--) {//调整次数
                let index = i - 1;
                if (index == -1) index = 4;
                let t = optionArray[index];
                optionArray[index] = temp;
                temp = t;
            }
        }
    },
    //用于设置界面选项的显示
    setOptionShow() {
        //内外圈转动
        this.outerCircle.node.angle = (this.outerCircle.node.angle + 75) % 350
        this.innerCircle.node.angle = (this.innerCircle.node.angle - 75) % -350

        let optionArray = this.optionArray
        //从左数起设置,从零开始
        let option0 = optionArray[0]
        option0.setPosition(cc.v2(-470, -110))
        option0.getChildByName('sprayPaint').active = false
        option0.getChildByName('label').active = false
        option0.getChildByName('button').active = false

        let option1 = optionArray[1]
        option1.setPosition(cc.v2(-310, -110))
        option1.getChildByName('sprayPaint').active = false
        option1.getChildByName('label').active = false
        option1.getChildByName('button').active = false

        let option2 = optionArray[2]
        option2.setPosition(cc.v2(0, 0))
        option2.getChildByName('sprayPaint').active = true
        option2.getChildByName('label').active = true
        option2.getChildByName('button').active = false
        option2.getChildByName('button').active = true

        let option3 = optionArray[3]
        option3.setPosition(cc.v2(310, -110))
        option3.getChildByName('sprayPaint').active = false
        option3.getChildByName('label').active = false
        option3.getChildByName('button').active = false

        let option4 = optionArray[4]
        option4.setPosition(cc.v2(470, -110))
        option4.getChildByName('sprayPaint').active = false
        option4.getChildByName('label').active = false
        option4.getChildByName('button').active = false

        let acousticsNode = this.node.getChildByName('acoustics(water)')
        if (option2.name == 'acoustics(water)') {
            acousticsNode.getChildByName('word').active = true
            acousticsNode.getChildByName('label').active = false
        }
        else {
            acousticsNode.getChildByName('word').active = false
            acousticsNode.getChildByName('label').active = false
        }
    },
    start() {

    },
    onClickBotton(obj, data) {
        //按钮点击音效button
        cc.audioEngine.play(globalMusicSource.swoosh, false, globalMusicSource.acoustics);
        //定义
        let optionArray = this.optionArray
        //如果是开始游戏startGame
        if (data == 'leftChevron') {
            let temp = optionArray[0];
            for (let i = 0; i < 5; i++) {//调整次数
                let t = optionArray[(i + 1) % 5];
                optionArray[(i + 1) % 5] = temp;
                temp = t;
            }
        }
        else if (data == 'rightChevron') {
            let temp = optionArray[4];
            for (let i = 4; i >= 0; i--) {//调整次数
                let index = i - 1;
                if (index == -1) index = 4;
                let t = optionArray[index];
                optionArray[index] = temp;
                temp = t;
            }
        }
        this.setOptionShow()
    },
    update(dt) {
        /*左箭头
        leftChevron: cc.Component,
            //右箭头
            rightChevron: cc.Component */
        //左箭头运行
        let lx = this.leftChevron.node.getPosition().x
        let ly = this.leftChevron.node.getPosition().y
        if (this.leftChevronMoveTag == -1) {//-1为向左
            if (lx > -230) {
                this.leftChevron.node.setPosition(cc.v2(lx - 1, ly))
            }
            else
                this.leftChevronMoveTag = 1
        }
        else {
            if (lx < -210) {
                this.leftChevron.node.setPosition(cc.v2(lx + 1, ly))
            }
            else
                this.leftChevronMoveTag = -1
        }
        //右箭头运行
        let rx = this.rightChevron.node.getPosition().x
        let ry = this.rightChevron.node.getPosition().y
        if (this.rightChevronMoveTag == -1) {//-1为向左
            if (rx < 230) {
                this.rightChevron.node.setPosition(cc.v2(rx + 1, ly))
            }
            else
                this.rightChevronMoveTag = 1
        }
        else {
            if (rx > 210) {
                this.rightChevron.node.setPosition(cc.v2(rx - 1, ly))
            }
            else
                this.rightChevronMoveTag = -1
        }
    },
});
