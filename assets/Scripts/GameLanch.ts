// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import Game from "./Game/Game"
import ResMgr from "./Managers/ResMgr";
import UIMgr from "./Managers/UICtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameLanch extends cc.Component {
    onLoad () {
        this.node.addComponent(ResMgr)
        this.node.addComponent(UIMgr)
        this.node.addComponent(Game)
    }

    start () {
        Game.Instance.GameStart()
    } 

    // update (dt) {}
}
