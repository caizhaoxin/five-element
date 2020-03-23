let currentData = require('../../GlobalData/CurrentData')
let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
let mapData = require("../../MapData");
let ResultMenu = cc.Class({
    extends: cc.Component,

    properties: {
        //地图初始化节点
        mapInitializer: cc.Component,
        //用于血条进度条数秒
        HRProgreeCount: 0,
        //谢幕图
        curtainMap: cc.Component,
        //砖块预制体
        brick: {
            type: cc.Prefab,
            default: null
        }
    },
    onLoad() {
        //获取子节点
        this.resultLabel = this.node.getChildByName('resultLabel')
        this.HP = this.node.getChildByName('HP')
        //HP各个节点的show数组,用于血条动画显示
        this.HPPointShowArray = new Array(
            this.HP.getChildByName('zeroPoint').getChildByName('show'),
            this.HP.getChildByName('onePoint').getChildByName('show'),
            this.HP.getChildByName('twoPoint').getChildByName('show'),
            this.HP.getChildByName('threePoint').getChildByName('show'),
        )
        this.pointIndex = 0

        this.nextLevel = this.node.getChildByName('nextLevel')
        this.winOnceMore = this.node.getChildByName('winOnceMore')
        this.lostOnceMore = this.node.getChildByName('lostOnceMore')
        this.homeMenu = this.node.getChildByName('homeMenu')
        //clearanceScene界面
        this.clearanceScene = this.node.getChildByName('clearanceScene')
        //获取球球，用于显示血分进度条
        this.ball = this.mapInitializer.node.getChildByName('ball')
    },

    start() {
        //设置血条

    },
    update(dt) {
        //按钮设置
        if (currentData.roundResult != 0) {
            //暂停bgm
            cc.audioEngine.pause(globalMusicSource.bgm);
            //胜利
            if (currentData.roundResult == 1) {
                //如果不是最后一关
                if (currentData.currentRoundNum != currentData.roundSum) {
                    currentData.roundResult = 0
                    //掩幕展示
                    this.node.getChildByName('maskFilm').active = true
                    //HP显示
                    this.HP.active = true
                    //resultLabel显示
                    this.resultLabel.getChildByName('winLabel').active = true
                    this.resultLabel.getChildByName('lostLabel').active = false
                    //botton显示
                    this.nextLevel.active = true
                    this.winOnceMore.active = true
                    this.homeMenu.active = true
                }
                //如果是最后一关
                else {
                    currentData.roundResult = 0
                    /* let mapNode = this.mapInitializer.node.getChildren()
                     for (let i = 0; i < mapNode.length; i++) {
                         //cc.log(mapNode[i].getComponent(cc.RigidBody).type)
                         mapNode[i].getComponent(cc.RigidBody).type = 2
                         let v = mapNode[i].getComponent(cc.RigidBody).linearVelocity
                         v.x = 0; v.y = -400;
                         mapNode[i].getComponent(cc.RigidBody).linearVelocity = v
                         mapNode[i].getComponent(cc.RigidBody).fixedRotation = true
                     }*/
                    this.curtainMapInitializer()
                }
            }
            //失败
            else if (currentData.roundResult == -1) {
                currentData.roundResult = 0
                //掩幕展示
                this.node.getChildByName('maskFilm').active = true
                //HP显示
                this.HP.active = true
                //resultLabel显示
                this.resultLabel.getChildByName('winLabel').active = false
                this.resultLabel.getChildByName('lostLabel').active = true
                //botton显示
                this.lostOnceMore.active = true
                this.homeMenu.active = true
            }
        }
        //HP动画设置
        if (this.HP.active) {
            this.HRProgreeCount++
            let currentBlood = currentData.currentBlood
            if (this.HRProgreeCount % 30 == 0) {
                if (this.pointIndex < this.HPPointShowArray.length && this.pointIndex <= currentBlood)
                    this.HPPointShowArray[this.pointIndex++].active = true
                else
                    this.HRProgreeCount = 0
            }
        }
        //已经碰到currentData,全部通关界面打开
        if (currentData.haveTouchedCurtainMap) {
            //掩幕展示
            this.node.getChildByName('maskFilm').active = true
            currentData.haveTouchedCurtainMap = false
            this.clearanceScene.active = true
        }
    },
    //curtainMap制作
    curtainMapInitializer() {
        //定义下降的速度
        let speed = -500
        let curtainMap = this.curtainMap
        //清除所有的子节点
        //curtainMap.node.removeAllChildren(true)
        // 砖块预制体
        let brick = this.brick
        //取地图的数据，为二维数组形式，关卡下标从1开始
        let array = mapData.getCurtainMap()
        //地图数据的长和宽，row为行数，list为列数
        let row = array.length
        let list = array[0].length
        //循环输出地图
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < list; j++) {//1.  0, 40*17
                if (array[i][j] == 0) continue
                //创建并初始化节点
                let brickNode = cc.instantiate(brick);
                brickNode.setPosition(cc.v2(j * 40, (row - 1 - i) * 40));
                brickNode.removeComponent(cc.RigidBody);
                curtainMap.node.addChild(brickNode);
                // cc.log('brickNode:', brickNode.getPosition())
            }
        }
        let v = curtainMap.getComponent(cc.RigidBody).linearVelocity
        v.x = 0; v.y = speed;
        curtainMap.getComponent(cc.RigidBody).linearVelocity = v
        //清除地图的实体
        let mapComponents = this.mapInitializer.node.getChildren()
        //循环清除
        for (let i = 0; i < mapComponents.length; i++) {
            let node = mapComponents[i]
            node.removeComponent(cc.RigidBody);
        }
        v = this.mapInitializer.getComponent(cc.RigidBody).linearVelocity
        v.x = 0; v.y = speed;
        this.mapInitializer.getComponent(cc.RigidBody).linearVelocity = v
    }
});

