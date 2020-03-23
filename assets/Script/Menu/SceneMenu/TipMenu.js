let globalMusicSource = require('../../GlobalData/GlobalMusicSource')
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {

    },
    onClickButton(obj, data) {
        if (data == 'return') {
            //按钮点击音效button
            cc.audioEngine.play(globalMusicSource.button, false, globalMusicSource.acoustics);
            //scene上的按钮重新生效
            this.node.getParent().getChildByName('sceneMenuBotton').getChildByName('buttonReplay').active = true
            this.node.getParent().getChildByName('sceneMenuBotton').getChildByName('buttonPlay').active = true
            this.node.getParent().getChildByName('sceneMenuBotton').getChildByName('buttonHome').active = true
            //tip节点消失
            this.node.active = false
        }
    }
    // update (dt) {},
});
