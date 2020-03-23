let mapData = require("MapData");
let currentData = require('./GlobalData/CurrentData')
let SceneMenuData = require('./Menu/SceneMenu/SceneMenuData')
cc.Class({
    extends: cc.Component,
    properties: {
        //砖块预制体
        brick: {
            type: cc.Prefab,
            default: null
        },
        //障碍预制体
        obstacle: {
            type: cc.Prefab,
            default: null
        },
        //球预制体
        ball: {
            type: cc.Prefab,
            default: null
        },
        //终点预制体
        terminalPoint: {
            type: cc.Prefab,
            default: null
        },
        //转换机预制体
        switch: {
            type: cc.Prefab,
            default: null
        },
        //钥匙预制体
        key: {
            type: cc.Prefab,
            default: null
        },
        //球spriteFrame,用于更改图片,2：金球 3：木球 4：水球 5：火球  6：土球
        metalBallSprite: cc.SpriteFrame,
        woodenBallSprite: cc.SpriteFrame,
        waterBallSprite: cc.SpriteFrame,
        fireBallSprite: cc.SpriteFrame,
        soilBallSprite: cc.SpriteFrame,
        //球spriteFrame,用于更改图片,7：金障碍 8：木障碍  9：水障碍 10：火障碍 11：土障碍 
        metalObstacleSprite: cc.SpriteFrame,
        woodenObstacleSprite: cc.SpriteFrame,
        waterObstacleSprite: cc.SpriteFrame,
        fireObstacleSprite: cc.SpriteFrame,
        soilObstacleSprite: cc.SpriteFrame,
        //背景sprite
        bg01: cc.SpriteFrame,
        bg02: cc.SpriteFrame,
        //关数
        currentRoundNum: 1,
        //存储摄像机对象
        camera: {
            type: cc.Component,
            default: null
        },
        //ResultMenu
        resultMenu: cc.Component,
        //新手导航
        noviceNavigation: cc.Component
    },
    // use this for initialization
    onLoad: function () {
        //测试用，临时
        //currentData.currentRoundNum = 3

        //设置总关数
        currentData.roundSum = Object.keys(mapData.roundInfo).length
        //清除所有的子节点
        this.node.removeAllChildren(true)
        //设置场景菜单SceneMenu为不显示状态
        SceneMenuData.openTag = false
        //重新设定关数
        this.currentRoundNum = currentData.currentRoundNum
        let currentRoundNum = this.currentRoundNum
        //新手导航设置
        if (currentData.goThroughMark[currentRoundNum - 1] == 0 && currentRoundNum != 3) {
            this.noviceNavigation.node.active = true
            this.noviceNavigation.node.getChildByName('maskFilm').active = true
            this.noviceNavigation.node.getChildByName('round0' + currentRoundNum + '_1').active = true
        }
        //设置当前关卡通关标志
        currentData.goThroughLockMark[currentData.currentRoundNum - 1] = 1
        //存储全局摄像机位置
        currentData.camera = this.camera
        //设置关卡背景图片
        let background = this.node.getParent().getParent().getChildByName('background')
        background.getComponent(cc.Sprite).spriteFrame = this.mapSpriteResolver(currentRoundNum)
        // 使用给定的模板在场景中生成一个新节点
        let brick = this.brick
        //取地图的数据，为二维数组形式，关卡下标从1开始
        let array = mapData.getMapData(currentRoundNum)
        //地图数据的长和宽，row为行数，list为列数
        let row = array.length
        let list = array[0].length
        //预加载预制体
        let cube = cc.instantiate(brick);
        //球实体，为了防止球被其他物体遮住，只能最后在add到node里面去,所以这里定义个变量先把节点存起来
        let ball = null
        //钥匙实体,钥匙放在球球上面，所以要比球球迟放下
        let key = null
        //设置拿到钥匙的状态为false,是第一关设为true
        if (currentRoundNum == 1)
            currentData.haveGonttenKey = true
        else
            currentData.haveGonttenKey = false
        //当前关卡的结果：-1为输，0为未赋值，1为胜利
        currentData.roundResult = 0
        //循环输出地图
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < list; j++) {//1.  0, 40*17
                if (array[i][j] == 0) continue
                //球的初始化,2：金球 3：木球 4：水球 5：火球  6：土球
                else if (array[i][j] >= 2 && array[i][j] <= 6) {
                    ball = this.ballInitializer(i, j)
                    continue
                }
                //钥匙的初始化,代号13
                else if (array[i][j] == 13) {
                    //初始化钥匙节点
                    key = cc.instantiate(this.key);
                    key.setPosition(cc.v2(j * 40, (row - 1 - i) * 40));
                    continue
                }
                //障碍初始化,7：金障碍 8：木障碍  9：水障碍 10：火障碍 11：土障碍 
                else if (array[i][j] >= 7 && array[i][j] <= 11) {
                    this.obstacleInitializer(i, j)
                    continue
                }
                //12：终点
                else if (array[i][j] == 12) {
                    //创建并初始化终点节点
                    let cube = cc.instantiate(this.terminalPoint);
                    //不是第一关就修改颜色为灰色，表示未拿到钥匙
                    if (currentRoundNum != 1)
                        cube.color = new cc.Color(135, 135, 135);
                    // 将新增的节点添加到 Canvas 节点下面
                    this.node.addChild(cube, 'terminalPoint');
                    cube.setPosition(cc.v2(j * 40, (row - 1 - i) * 40));
                    continue
                }
                //转换机初始化，为了方便起从21开始，21代表转换一次，22为两次，依次类推
                else if (array[i][j] >= 21 && array[i][j] <= 24) {
                    //创建并初始化节点
                    let cube = cc.instantiate(this.switch)
                    //修改label的string,从1开始
                    cube.getChildByName('changeTime').getComponent(cc.Label).string = array[i][j] - 20
                    //修改collider的tag，从21开始
                    cube.getChildByName('collider').getComponent(cc.BoxCollider).tag = array[i][j]
                    // 将新增的节点添加到 Canvas 节点下面
                    this.node.addChild(cube);
                    cube.setPosition(cc.v2(j * 40, (row - 1 - i) * 40));
                    continue
                }
                //创建并初始化节点
                let cube = cc.instantiate(brick);
                // 将新增的节点添加到 Canvas 节点下面
                this.node.addChild(cube);
                cube.setPosition(cc.v2(j * 40, (row - 1 - i) * 40));
                //cc.log(cube.anchor)
            }
        }
        //add入小球
        if (ball != null)
            this.node.addChild(ball, 'ball');
        //最好加入钥匙
        if (key != null)
            this.node.addChild(key, 'key')
    },
    //球的初始化
    ballInitializer(i, j) {
        //关数
        let currentRoundNum = this.currentRoundNum
        //创建并初始化障碍物节点
        let ball = cc.instantiate(this.ball);
        //取地图的数据，为二维数组形式，关卡下标从1开始
        let array = mapData.getMapData(currentRoundNum)
        //地图数据的长和宽，row为行数，list为列数
        let row = array.length
        let list = array[0].length
        //球的标识
        let ballNum = array[i][j]
        //设置球的tag
        ball.getComponent(cc.CircleCollider).tag = array[i][j]
        //设置球球的血条
        cc.log('ini blood:', mapData.getBallBlood(currentRoundNum))
        currentData.currentBlood = mapData.getBallBlood(currentRoundNum)
        //设置球球的ResultMenu变量
        ball.getComponent('Ball').resultMenu = this.resultMenu
        //设置spriteFrame
        switch (ballNum) {
            case 2://金球
                ball.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.metalBallSprite
                break
            case 3://木球
                ball.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.woodenBallSprite
                break
            case 4://水球
                ball.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.waterBallSprite
                break
            case 5://火球
                ball.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.fireBallSprite
                break
            case 6://土球
                ball.getChildByName('background').getChildByName('ballSprite').getComponent(cc.Sprite).spriteFrame = this.soilBallSprite
                break
        }
        //设置小球的位置
        ball.setPosition(cc.v2(j * 40 + 20, (row - 1 - i) * 40 + 20));
        //返回小球实体
        return ball
    },
    //障碍初始化
    obstacleInitializer(i, j) {
        //关数
        let currentRoundNum = this.currentRoundNum
        //创建并初始化障碍物节点
        let obstacle = cc.instantiate(this.obstacle);
        //取地图的数据，为二维数组形式，关卡下标从1开始
        let array = mapData.getMapData(currentRoundNum)
        //地图数据的长和宽，row为行数，list为列数
        let row = array.length
        let list = array[0].length
        //障碍的标志
        let obstacleNum = array[i][j]
        //设置obstacle
        //设置障碍的tag,7：金障碍 8：木障碍  9：水障碍 10：火障碍 11：土障碍 
        obstacle.getComponent(cc.BoxCollider).tag = array[i][j]
        switch (obstacleNum) {
            case 7://金障碍
                obstacle.getComponent(cc.Sprite).spriteFrame = this.metalObstacleSprite
                break
            case 8://木障碍
                obstacle.getComponent(cc.Sprite).spriteFrame = this.woodenObstacleSprite
                break
            case 9://水障碍
                obstacle.getComponent(cc.Sprite).spriteFrame = this.waterObstacleSprite
                break
            case 10://火障碍
                obstacle.getComponent(cc.Sprite).spriteFrame = this.fireObstacleSprite
                break
            case 11://土障碍
                obstacle.getComponent(cc.Sprite).spriteFrame = this.soilObstacleSprite
                break
        }
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(obstacle);
        obstacle.setPosition(cc.v2(j * 40, (row - 1 - i) * 40));
    },
    //地图sprite解析器
    mapSpriteResolver(currentRoundNum) {
        //this.mapSpriteResolver(mapData.getMapBackground(currentRoundNum))
        //= this.mapSpriteResolver(currentRoundNum)
        let mapNum = parseInt(mapData.getMapBackground(currentRoundNum))
        switch (mapNum) {
            case 1:
                return this.bg01
                break
            case 2:
                return this.bg02
                break
            case 3:
                return this.bg03
                break
            case 4:
                return this.bg04
                break
        }
    },
    // called every frame
    // update: function (dt) {}
});
