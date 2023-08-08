import { UICtrl } from "../../Managers/UICtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class UIGame_Ctrl extends UICtrl {
    private versionLabel : cc.Label = null;
    onLoad () {
        super.onLoad()

        this.versionLabel =  this.view["Version"].getComponent(cc.Label)
        this.versionLabel.string = "2.0.0"

        this.add_button_listen("Login",this,this.onGameStartClick)
    }

    private onGameStartClick () {
        console.log("onGameStartClick")
    }

    // update (dt) {}
}
