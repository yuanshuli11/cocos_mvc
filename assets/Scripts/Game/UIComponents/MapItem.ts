// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ResMgr from "../../Managers/ResMgr";
import { UICtrl } from "../../Managers/UICtrl";

const { ccclass, property } = cc._decorator;
export class Mapdata {
    ID: number;
    MapType: number;
    MapX: number = 0;
    MapY: number = 0;
    OffsetX: number = 0;
    OffsetY: number = 0;
    constructor(id: number, mapType: number, mapX: number, mapY: number, offsetX: number, offsetY: number) {
        this.ID = id
        this.MapX = mapX;
        this.MapY = mapY;
        this.MapType = mapType
        this.OffsetX = offsetX;
        this.OffsetY = offsetY;

    }
}

@ccclass
export default class MapItem extends UICtrl {

    private locationLabel: cc.Label = null;
    private bgSprite: cc.Sprite = null;
    private iconSprite: cc.Sprite = null;

    public MapData: Mapdata = null;
    protected onLoad(): void {
        super.onLoad()
        this.locationLabel = this.view["loc"].getComponent(cc.Label)
        this.bgSprite = this.view["bg"].getComponent(cc.Sprite)
        this.iconSprite = this.view["resicon"].getComponent(cc.Sprite)

    }
    setLocation(mapData: Mapdata) {
        this.MapData = mapData
        //   this.locationLabel.string = `(${this.MapData.MapX},${this.MapData.MapY})`
        this.setImage(this.MapData.OffsetX, this.MapData.OffsetY)

    }

    setImage(offsetX: number, offsetY: number) {
        offsetX = (offsetX % 10 + 10) % 10
        offsetY = (offsetY % 19 + 19) % 19
        let bgPath = `mbg_${offsetY + 1}${offsetX}`
        this.bgSprite.spriteFrame = ResMgr.Instance.getRes(bgPath, cc.SpriteFrame)
        // this.locationLabel.string = bgPath
        // if (this.MapData) {
        //     this.locationLabel.string = this.locationLabel.string + this.MapData.MapType
        // }
        if (this.MapData) {
            if (this.MapData.MapType < 10) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_001", cc.SpriteFrame)
            } else if (this.MapData.MapType < 20) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_002", cc.SpriteFrame)
            } else if (this.MapData.MapType < 35) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_003", cc.SpriteFrame)
            } else if (this.MapData.MapType < 50) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_004", cc.SpriteFrame)
            } else if (this.MapData.MapType < 65) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_005", cc.SpriteFrame)
            } else if (this.MapData.MapType < 70) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_000", cc.SpriteFrame)
            } else if (this.MapData.MapType < 75) {
                this.iconSprite.spriteFrame = ResMgr.Instance.getRes("mres_010", cc.SpriteFrame)
            } else {
                this.iconSprite.spriteFrame = null
            }
        }
    }
    setMapItemLocation(offsetX: number, offsetY: number) {
        var pos = this.node.getPosition()
        pos.x += this.node.width * (offsetX - 2)
        pos.y -= this.node.width * (offsetY - 2)
        this.setImage(offsetX, offsetY)
        this.node.setPosition(pos)
    }
    start() {
    }

    // update (dt) {}
}
