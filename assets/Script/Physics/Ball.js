let mapData = require("../MapData")
let currentData = require('../GlobalData/CurrentData')
let SceneMenuData = require('../Menu/SceneMenu/SceneMenuData')
let globalMusicSource = require('../GlobalData/GlobalMusicSource')
let a = 3
cc.Class({
    extends: cc.Component,
    properties: {
        //ResultMenu
        resultMenu: cc.Component,
        //球的血条
        blood: 0,
        //球球和障碍物的碰撞tag，仅在碰撞时使用！
        ballColliderTag: 0, obstacleColliderTag: 0,
        isIntoObstacle: false,
        //球spriteFrame,用于更改图片,2：金球 3：木球 4：水球 5：火球  6：土球
        metalBallSprite: cc.SpriteFrame,
        woodenBallSprite: cc.SpriteFrame,
        waterBallSprite: cc.SpriteFrame,
        fireBallSprite: cc.SpriteFrame,
        soilBallSprite: cc.SpriteFrame,
        //地图数组
        array: null,
        //吸附状态
        beAbsorted: false,
        //吸附的目标
        targetX: 0, targetY: 0,
        //到达终点后的旋转状态
        isSpinning: false,
        //缩小状态
        shrinking: false,
        //放大状态
        boosting: false,
        //各个方位的闪烁状态
        topLeftTwinkleBloodSpriteTwinked: false,
        topRightTwinkleBloodSpriteTwinked: false,
        downTwinkleBloodSpriteTwinked: false,
        //控制各个方位闪烁的变量
        topLeftTwinkleTime: 0,
        topRightTwinkleTime: 0,
        downTwinkleTime: 0,
        //上一次碰撞前的障碍物的tag,默认为-1
        preObstacle: -1,
        //存储当前的转换机
        currentSwitch: null,
        //判断是否离开了摄像机边界格子
        haveLeftCameraEdgeChequer: true
    },
    onLoad() {
        //关闭SceneMenuData的openTag
        //SceneMenuData.openTag = false

        //取地图的数据，为二维数组形式，关卡下标从1开始
        this.array = mapData.getMapData(currentData.currentRoundNum)//(currentData.currentRoundNum)
        //碰撞管理器启动
        cc.director.getCollisionManager().enabled = true
        //球sprite的数组,从下标为0开始
        //生关系：金->水->木->火->土
        this.ballSpriteArray = new Array(
            this.metalBallSprite,
            this.waterBallSprite,
            this.woodenBallSprite,
            this.fireBallSprite,
            this.soilBallSprite)
        //设置球球的血的sprite
        this.setBallSpriteBloodShow()


        this.node.schedule(function () {
            // 这里的 this 指向 component
            console.log('123wqwqwq');
        }, 1);


    },
    //球球停止函数
    ballStop() {
        //球球父节点
        let ballNode = this.node
        ballNode.getComponent('InputListener').canController = false
        ballNode.getComponent('G-SensorListener').canController = false
        //定义速度向量，设置取球球的速度为0
        let v = cc.Vec2
        //速度设为0
        v.x = 0; v.y = 0;
        ballNode.getComponent(cc.RigidBody).linearVelocity = v
        //设为不能旋转
        ballNode.getComponent(cc.RigidBody).fixedRotation = true
        //设置openTag为true，防止触发
        SceneMenuData.openTag = true
    },
    //球球恢复函数
    ballMoving() {
        //设回球球能被控制
        this.getComponent('InputListener').canController = true
        this.getComponent('G-SensorListener').canController = true
        //设回不能旋转
        this.node.getComponent(cc.RigidBody).fixedRotation = false
        //设置openTag回true
        SceneMenuData.openTag = false
    },
    onCollisionEnter: function (other, self) {
        //碰到的是终点,且已经拿到钥匙
        if (other.tag == 1 && currentData.haveGonttenKey == true) {
            //音效
            cc.audioEngine.play(globalMusicSource.success, false, globalMusicSource.acoustics);
            //设置resultMenu
            currentData.roundResult = 1
            // //设置通关标志标记
            // currentData.goThroughLockMark[currentData.currentRoundNum - 1] = 1
            //设置球球不能被控制
            if (this.getComponent(cc.RigidBody) != null)
                this.ballStop()
            //胜利啦！！！
            //如果是最后一关，摄像机移动到中间//设置resultMenu的位置并显示
            this.resultMenu.node.active = true
            if (currentData.currentRoundNum == currentData.roundSum) {
                currentData.camera.node.setPosition(cc.v2(540, 0))
            }
        }
        //碰到的是障碍物
        else if (other.tag >= 7 && other.tag <= 11) {
            if (this.isIntoObstacle == false || this.preObstacle != other.tag) {
                //球克障碍，不扣血
                //障碍克球，扣一滴血
                //互不克制，扣两滴血
                let diminution = this.getDiminution(other.tag, self.tag)
                currentData.currentBlood -= diminution
                this.preObstacle = other.tag

                // this.blood -= diminution
                this.isIntoObstacle = true
                //用于设置球球血条显示的函数
                this.setBallSpriteBloodShow()
                //设置闪烁
                //防止还在闪烁的途中再次进入障碍继续闪烁
                if (currentData.currentBlood <= 2)
                    this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('topRightTwinkleBloodSprite').active = false
                if (currentData.currentBlood <= 1)
                    this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('downTwinkleBloodSprite').active = false
                if (currentData.currentBlood <= 0)
                    this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('topLeftTwinkleBloodSprite').active = false

                /*   if (this.topRightTwinkleBloodSpriteTwinked)
                       this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('topRightTwinkleBloodSprite').active = false
                   if (this.topLeftTwinkleBloodSpriteTwinked)
                       this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('topLeftTwinkleBloodSprite').active = false
                   if (this.downTwinkleBloodSpriteTwinked)
                       this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('downTwinkleBloodSprite').active = false
                 */  //所有闪烁设为false
                this.topLeftTwinkleBloodSpriteTwinked = false
                this.topRightTwinkleBloodSpriteTwinked = false
                this.downTwinkleBloodSpriteTwinked = false
                //控制各个方位闪烁的变量
                this.topLeftTwinkleTime = 0
                this.topRightTwinkleTime = 0
                this.downTwinkleTime = 0
                switch (diminution) {
                    //不扣血
                    case 0:
                        break
                    //扣了一滴血
                    case 1:
                        switch (currentData.currentBlood) {
                            //从3变2
                            case 2:
                                this.topRightTwinkleBloodSpriteTwinked = true
                                break
                            //从2变1
                            case 1:
                                this.downTwinkleBloodSpriteTwinked = true
                                break
                            //从1变0
                            case 0:
                                this.topLeftTwinkleBloodSpriteTwinked = true
                                break
                            //从0变-1，直接输掉
                            default:
                                //音效
                                cc.audioEngine.play(globalMusicSource.failure, false, globalMusicSource.acoustics);
                                //设置resultMenu
                                currentData.roundResult = -1
                                //输啦啦！！！
                                //设置resultMenu的位置并显示
                                //this.resultMenu.node.setPosition(currentData.camera.node.getPosition())
                                this.resultMenu.node.active = true
                                //设置球球不能被控制
                                this.ballStop()
                                break
                        }
                        break
                    //扣了两滴血
                    case 2:
                        switch (currentData.currentBlood) {
                            //从3变1
                            case 1:
                                this.topRightTwinkleBloodSpriteTwinked = true
                                this.downTwinkleBloodSpriteTwinked = true
                                break
                            //从2变0
                            case 0:
                                this.topLeftTwinkleBloodSpriteTwinked = true
                                this.downTwinkleBloodSpriteTwinked = true
                                break
                            //从1变-1，直接输掉
                            default:
                                //音效
                                cc.audioEngine.play(globalMusicSource.failure, false, globalMusicSource.acoustics);
                                //设置resultMenu
                                currentData.roundResult = -1
                                //输啦啦！！！
                                //设置resultMenu的位置并显示
                                //this.resultMenu.node.setPosition(currentData.camera.node.getPosition())
                                this.resultMenu.node.active = true
                                //设置球球不能被控制
                                this.ballStop()
                                break
                        }
                        break
                }
            }
        }
        //碰到转换机
        else if (21 <= other.tag && other.tag <= 24) {
            //音效
            cc.audioEngine.play(globalMusicSource.mentionsound, false, globalMusicSource.acoustics);
            //定义转换次数
            let changeTime = other.tag - 20
            //转换机父节点
            let switchNode = other.node.getParent()
            //球球父节点
            let ballNode = self.node
            //存储当前的转换机，用于转换机消失
            this.currentSwitch = switchNode
            //球球被吸附到转换机的位置
            //ballNode.setPosition(switchNode, ballNodeswitchNode.getPosition().x + 20, switchNode.getPosition().y + 20);
            this.ballBeAbsort(switchNode, ballNode, switchNode.getPosition().x + 20, switchNode.getPosition().y + 20);
            //球球和障碍物的碰撞tag
            this.ballColliderTag = self.tag; this.obstacleColliderTag = other.tag - 20
            // cc.log('this.ballColliderTag', this.ballColliderTag, 'this.obstacleColliderTag:', this.obstacleColliderTag)
        }
        //碰到钥匙
        else if (other.tag == 13) {
            if (currentData.haveGonttenKey == false) {
                //音效
                cc.audioEngine.play(globalMusicSource.ding, false, globalMusicSource.acoustics);
                //拿到钥匙和终点的变量
                let key = this.node.getParent().getChildByName('key')
                let terminalPoint = this.node.getParent().getChildByName('terminalPoint')
                //钥匙消失，终点恢复颜色，且可以接触
                key.active = false
                terminalPoint.color = new cc.Color(255, 255, 255);
                currentData.haveGonttenKey = true
            }
        }
        //碰到摄像机右移边界
        else if (other.tag == 30) {
            //cc.log('我碰到了边界点')
            //设置摄像机的节点
            if (currentData.camera.node.getPosition().x == 0)
                currentData.camera.node.setPosition(cc.v2(1160, 0))
            else
                currentData.camera.node.setPosition(cc.v2(0, 0))
        }
    },

    //碰撞保持时回调函数
    onCollisionStay: function (other, self) {

    },
    //碰撞结束时回调函数
    onCollisionExit: function (other, self) {
        //离开障碍物
        //cc.log('离开障碍物', other.tag)
        if (other.tag >= 7 && other.tag <= 11) {
            let x = parseInt(this.node.getPosition().x / 40)
            let y = parseInt(this.node.getPosition().y / 40)
            let array = this.array
            let row = array.length
            //cc.log('array[row - 1 - y][x]:', array[row - 1 - y][x])
            if (array[row - 1 - y][x] == 0) {
                this.isIntoObstacle = false
                this.preObstacle = -1
            }
            // cc.log('this.isIntoObstacle:', this.isIntoObstacle)
        }
        //碰到摄像机右移边界
        else if (other.tag == 30) {
            //球从上碰到边界后，离开时没有继续向下，而是回去往上
            //x1220y340
            //cc.log(currentData.camera.node.getPosition().x, ' ', this.node.getPosition().x, ' ', this.node.getPosition().y)
            if (currentData.camera.node.getPosition().x == 1160 && (this.node.getPosition().x <= 1220 || this.node.getPosition().y >= 340)) {
                currentData.camera.node.setPosition(cc.v2(0, 0))
            }
            //球从下碰到边界后，离开时没有继续向上，而是回去往下
            else if (currentData.camera.node.getPosition().x == 0 && (this.node.getPosition().x >= 1220 || this.node.getPosition().y <= 340)) {
                currentData.camera.node.setPosition(cc.v2(1160, 0))
            }
        }
    },
    /*
4.球克障碍物中：2->8,3->11,4->10,5->7,6->9
5.障碍物克球中：7->3,8->6,9->5,10->2,11->4
ballTag取值为2：金球 3：木球 4：水球 5：火球  6：土球（数据类型为number，也就是int）
obstacleTag取值为7：金障碍 8：木障碍  9：水障碍 10：火障碍 11：土障碍 （数据类型为number，也就是int）
*/
    getDiminution(obstacleTag, ballTag) {
        if (obstacleTag < 7 || obstacleTag > 11 || ballTag < 2 || ballTag > 6) {
            console.log("number error");
        }
        let diminution; //定义减血量
        //添加代码
        //球克障碍，不扣血
        if ((ballTag == 2 && obstacleTag == 8) || (ballTag == 3 && obstacleTag == 11) || (ballTag == 4 && obstacleTag == 10) || (ballTag == 5 && obstacleTag == 7) || (ballTag == 6 && obstacleTag == 9)) {
            diminution = 0;
        }
        else if ((obstacleTag == 7 && ballTag == 3) || (obstacleTag == 8 && ballTag == 6) || (obstacleTag == 9 && ballTag == 5) || (obstacleTag == 10 && ballTag == 2) || (obstacleTag == 11 && ballTag == 4)) {
            diminution = 2;
        }
        else {
            diminution = 1;
        }
        //障碍克球，扣2滴血
        //互不克制，扣1滴血
        return diminution; //返回减血量
    },
    //用于设置球球血条显示的函数
    setBallSpriteBloodShow() {
        let topLeftHignBloodSprite = this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('whiteBloodSprite').getChildByName('topLeftWhiteBloodSprite')
        let topRightWhiteBloodSprite = this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('whiteBloodSprite').getChildByName('topRightWhiteBloodSprite')
        let downWhiteBloodSprite = this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('whiteBloodSprite').getChildByName('downWhiteBloodSprite')
        //  cc.log('topLeftHignBloodSprite:', topLeftHignBloodSprite.active)
        //所有闪烁设为false
        this.topLeftTwinkleBloodSpriteTwinked = false
        this.topRightTwinkleBloodSpriteTwinked = false
        this.downTwinkleBloodSpriteTwinked = false
        switch (currentData.currentBlood) {
            case 0:
                topLeftHignBloodSprite.active = false
                topRightWhiteBloodSprite.active = false
                downWhiteBloodSprite.active = false
                break
            case 1:
                topLeftHignBloodSprite.active = true
                topRightWhiteBloodSprite.active = false
                downWhiteBloodSprite.active = false
                break
            case 2:
                topLeftHignBloodSprite.active = true
                topRightWhiteBloodSprite.active = false
                downWhiteBloodSprite.active = true
                break
            case 3:
                topLeftHignBloodSprite.active = true
                topRightWhiteBloodSprite.active = true
                downWhiteBloodSprite.active = true
                break
        }
    },
    //球球被吸附到转换机的位置
    ballBeAbsort(switchNode, ballNode, targetX, targetY) {
        //设置球球不能被控制
        ballNode.getComponent('InputListener').canController = false
        ballNode.getComponent('G-SensorListener').canController = false
        //速度设为0
        let v = this.node.getComponent(cc.RigidBody).linearVelocity
        v.x = 0; v.y = 0;
        this.node.getComponent(cc.RigidBody).linearVelocity = v
        //设为不能旋转
        this.node.getComponent(cc.RigidBody).fixedRotation = true
        //设置beAbsorted为true
        this.beAbsorted = true
        //设置this.targetX, this.targetY
        this.targetX = targetX; this.targetY = targetY;
    },
    start() {
    },
    update(dt) {
        let ballBackground = this.node.getChildByName('background')
        //球球处于被吸收状态
        if (this.beAbsorted) {
            //x变化
            let x = this.node.getPosition().x
            if (x > this.targetX) x--
            else if (x < this.targetX) x++
            //y变化
            let y = this.node.getPosition().y
            if (y > this.targetY) y--
            else if (y < this.targetY) y++
            //设置小球的位置
            this.node.setPosition(cc.v2(x, y))
            if (Math.abs(x - this.targetX) < 1 && Math.abs(y - this.targetY) < 1) {
                //设回不能吸收
                this.beAbsorted = false
                //到达转换机中心后的旋转状态变正
                this.isSpinning = true
                //到达转换机中心后的放大状态变正
                this.boosting = true
            }
        }
        //球球处于转换机中心的旋转状态
        if (this.isSpinning) {
            ballBackground.angle += 10
            //变身，へんしん！
            this.node.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.ballSpriteArray[Math.round(Math.random() * 5)]
        }
        //球球处于转换机中心放大状态
        if (this.boosting) {
            if (ballBackground.scaleX < 1.5) {
                ballBackground.scaleX += 0.01
                ballBackground.scaleY += 0.01
            }
            else {
                this.boosting = false
                this.shrinking = true
            }
        }
        //球球处于转换机中心缩小状态
        if (this.shrinking) {
            if (ballBackground.scaleX > 1) {
                ballBackground.scaleX -= 0.01
                ballBackground.scaleY -= 0.01
            }
            else {
                //解除缩小状态
                this.shrinking = false
                //解除旋转状态
                this.isSpinning = false
                //定义目标获得的球球数组ballSpriteArray的index
                let targetBallSpriteIndex = (mapData.getFromMapDataToProduct(this.ballColliderTag) + this.obstacleColliderTag) % 5
                //设置球球的tag
                this.getComponent(cc.CircleCollider).tag = mapData.getFromProductToMapData(targetBallSpriteIndex)
                //变身，へんしん！
                this.node.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.ballSpriteArray[targetBallSpriteIndex]
                //设回球球能被控制
                this.getComponent('InputListener').canController = true
                this.getComponent('G-SensorListener').canController = true
                //设回不能旋转
                this.node.getComponent(cc.RigidBody).fixedRotation = false
                //当前的转换机消失
                this.currentSwitch.active = false
            }
        }
        //球球处于被闪烁状态
        if (this.topLeftTwinkleBloodSpriteTwinked) {
            let topLeftTwinkleBloodSprite = this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('topLeftTwinkleBloodSprite')
            if (this.topLeftTwinkleTime < 100) {
                this.topLeftTwinkleTime++
                let mod = this.topLeftTwinkleTime % 20
                if (0 <= mod & mod <= 9)
                    topLeftTwinkleBloodSprite.active = true
                else
                    topLeftTwinkleBloodSprite.active = false
            }
            else {
                this.topLeftTwinkleTime = 0
                topLeftTwinkleBloodSprite.active = false
                this.topLeftTwinkleBloodSpriteTwinked = false
            }
        }
        if (this.topRightTwinkleBloodSpriteTwinked) {
            let topRightTwinkleBloodSprite = this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('topRightTwinkleBloodSprite')
            if (this.topRightTwinkleTime < 100) {
                this.topRightTwinkleTime++
                let mod = this.topRightTwinkleTime % 20
                if (0 <= mod & mod <= 9)
                    topRightTwinkleBloodSprite.active = true
                else
                    topRightTwinkleBloodSprite.active = false
            }
            else {
                this.topRightTwinkleTime = 0
                topRightTwinkleBloodSprite.active = false
                this.topRightTwinkleBloodSpriteTwinked = false
            }
        }
        if (this.downTwinkleBloodSpriteTwinked) {
            let downTwinkleBloodSprite = this.node.getChildByName('background').getChildByName('bloodSprite').getChildByName('twinkleBloodSprite').getChildByName('downTwinkleBloodSprite')
            if (this.downTwinkleTime < 100) {
                this.downTwinkleTime++
                let mod = this.downTwinkleTime % 20
                if (0 <= mod & mod <= 9)
                    downTwinkleBloodSprite.active = true
                else
                    downTwinkleBloodSprite.active = false
            }
            else {
                this.downTwinkleTime = 0
                downTwinkleBloodSprite.active = false
                this.downTwinkleBloodSpriteTwinked = false
            }
        }
        //新手导航打开时球不能动
        if (currentData.goThroughMark[currentData.currentRoundNum - 1] == 0) {
            // cc.log('ballStop')
            this.ballStop()
        }
        else if (currentData.goThroughMark[currentData.currentRoundNum - 1] == 1) {
            currentData.goThroughMark[currentData.currentRoundNum - 1]++
            this.ballMoving()
        }

        //  cc.log('blood:', this.blood)
    }
});
