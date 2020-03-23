//游戏运行时的数据
//增加关卡修改步骤：修改总关卡数、新手导航标记、通关标志标记
let currentData = {
    //当前关卡数
    currentRoundNum: 1,
    //总关卡数,会在mapinitiallizer里设置
    roundSum: 4,
    //新手导航标记
    goThroughMark: [0, 0, 2, 0],
    //通关标志标记
   // goThroughLockMark: [1, 0, 0, 0],
    goThroughLockMark: [1, 1, 1, 1],
    //当前关卡的结果：-1为输，0为未赋值，1为胜利
    roundResult: 0,
    //球球当前的血量
    currentBlood: 0,
    //拿到钥匙的状态
    haveGonttenKey: false,
    //当前摄像机的节点
    camera: cc.Component,
    //是否碰到curtainMap
    haveTouchedCurtainMap: false
}

module.exports = currentData;