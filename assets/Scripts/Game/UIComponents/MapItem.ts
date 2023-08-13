// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ResMgr from "../../Managers/ResMgr";
import { UICtrl } from "../../Managers/UICtrl";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapItem extends UICtrl {

    private locationLabel: cc.Label = null;
    private bgSprite: cc.Sprite = null;

    public MapX: number = 0;
    public MapY: number = 0;

    public OffsetX: number = 0;
    public OffsetY: number = 0;
    protected onLoad(): void {
        super.onLoad()
        this.locationLabel = this.view["loc"].getComponent(cc.Label)
        this.bgSprite = this.view["bg"].getComponent(cc.Sprite)
    }
    setLocation(mapX: number, mapY: number, offsetX: number, offsetY: number) {
        this.MapX = mapX
        this.MapY = mapY
        if (!this.locationLabel) {
            return
        }
        this.locationLabel.string = `(${mapX},${mapY})`
        this.OffsetX = offsetX
        this.OffsetY = offsetY
        this.setBgImage(offsetX, offsetY)
    }
    setBgImage(offsetX: number, offsetY: number) {
        this.bgSprite.spriteFrame = ResMgr.Instance.getRes(`mbg_${offsetY + 1}${offsetX}`, cc.SpriteFrame)
    }
    setMapItemLocation(offsetX: number, offsetY: number) {
        var pos = this.node.getPosition()
        pos.x += this.node.width * (offsetX - 3)
        pos.y -= this.node.width * (offsetY - 3)
        this.setBgImage(offsetX, offsetY)
        this.node.setPosition(pos)
    }
    start() {
    }

    // update (dt) {}
}
