import UIMgr, { UICtrl } from "../../Managers/UICtrl";
import MapItem, { Mapdata } from "../UIComponents/MapItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Map_Ctrl extends UICtrl {
  private blockSize: number = 60;
  private maxLat: number = 0;
  private minLat: number = 0;
  private maxLng: number = 0;
  private minLng: number = 0;
  private viewWidth: number = 0;
  private viewHeight: number;


  // 起始点位置
  private homeX: number = 0;
  private HomeY: number = 0;
  // 初始位置
  private orginMapX: number = 0;
  private orginMapY: number = 0;

  private offsetY = 0;
  private offsetX = 0;
  private keyCodeMask = 0;
  private mapBlock: cc.Node = null;
  onLoad() {

    super.onLoad()
    this.mapBlock = this.view["mapBlock"]
    console.log("==111", this.view)
    this.InitMapInfo(60, 499, 499, 10, 18)
    this.LoadMapAt(10, 10)

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event) => {
      var keyCode = event.keyCode
      switch (keyCode) {
        case 37: //左
          this.keyCodeMask |= (1 << 0);
          break;
        case 38: //上
          this.keyCodeMask |= (1 << 1);
          break;
        case 39: //右
          this.keyCodeMask |= (1 << 2);
          break;
        case 40: //下
          this.keyCodeMask |= (1 << 3);
          break;
      }
    }, this)
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, (event) => {
      var keyCode = event.keyCode
      switch (keyCode) {
        case 37: //左
          this.keyCodeMask &= ~(1 << 0);
          break
        case 38: //上
          this.keyCodeMask &= ~(1 << 1);
          break;
        case 39: //右
          this.keyCodeMask &= ~(1 << 2);
          break
        case 40: //下 0000 0001
          this.keyCodeMask &= ~(1 << 3);
          break;
      }
    }, this)
  }
  private mapSprites: Array<Array<MapItem>> = [];
  public InitMapInfo(blockSize: number, maxLat: number, maxLng: number, viewWidth: number, viewHeight: number) {
    this.blockSize = blockSize
    this.maxLat = maxLat
    this.maxLng = maxLng
    this.viewWidth = viewWidth
    this.viewHeight = viewHeight
    var index = 0;
    for (var i = 0; i < viewHeight; i++) {
      var lineSprites = [];
      for (var j = 0; j < viewWidth; j++) {
        let childNode = UIMgr.Instance.AddUIItem("MapItem", this.mapBlock)
        let childObj: MapItem = childNode.addComponent(MapItem)
        childObj.setMapItemLocation(j, i)

        lineSprites.push(childObj)
        index++;
      }
      this.mapSprites.push(lineSprites);
    }
  }

  // i行 j列 可视化显示的i,j
  private loadMapBlock(i: number, j: number, offsetX: number, offsetY: number) {
    var mapX = j + this.orginMapX;
    var mapY = i + this.orginMapY;
    let orignOffsetX = this.mapSprites[i][j].MapData ? this.mapSprites[i][j].MapData.OffsetX : 0
    let orignOffsetY = this.mapSprites[i][j].MapData ? this.mapSprites[i][j].MapData.OffsetY : 0
    var randomInt = Math.floor(Math.random() * 100);
    var mapInfo = new Mapdata(0, randomInt, mapX, mapY, orignOffsetX + offsetX, orignOffsetY + offsetY)
    this.mapSprites[i][j].setLocation(mapInfo)

  }
  public LoadMapAt(beginX: number, beginY: number) {
    this.homeX = beginX
    this.HomeY = beginY

    // beginX -= 4
    // beginY -= 7
    // if (beginX > this.maxLng - 10) {
    //   beginX = this.maxLng - 10
    // }
    // if (beginY > this.maxLat - 10) {
    //   beginY = this.maxLat - 10
    // }
    // if (beginX < 5) {
    //   beginX = 5
    // }
    // if (beginY < 5) {
    //   beginY = 5
    // }
    this.orginMapX = beginX;
    this.orginMapY = beginY;

    for (var i = 0; i < this.viewHeight; i++) {
      for (var j = 0; j < this.viewWidth; j++) {
        this.loadMapBlock(i, j, j, i)
      }
    }

  }
  start(): void {
    //  this.initBorderLocation()
  }
  private initBorderLocation() {
    console.log("==ccc", this.orginMapX)
    var pos = this.mapBlock.getPosition()
    console.log("==ss", pos.x)
    if (this.orginMapX <= 10) {
      //  pos.x -= 200
    }
    // console.log("==ss", pos.x)

    this.mapBlock.setPosition(pos)
  }
  private moveShowItemUp() {
    // 把 i ---> i - 1,
    for (var i = 1; i < this.viewHeight; i++) {
      for (var j = 0; j < this.viewWidth; j++) {
        let offsetObj = this.mapSprites[i][j]
        this.mapSprites[i - 1][j].setLocation(offsetObj.MapData)
      }
    }
    //加载新地图快
    for (var j = 0; j < this.viewWidth; j++) {
      this.loadMapBlock(this.viewHeight - 1, j, 0, 1)
    }
  }

  private moveShowItemLeft() {
    // 把 j ---> j - 1,
    for (var i = 0; i < this.viewHeight; i++) {
      for (var j = 1; j < this.viewWidth; j++) {
        let offsetObj = this.mapSprites[i][j]
        this.mapSprites[i][j - 1].setLocation(offsetObj.MapData)
      }
    }
    //加载新地图快
    for (var j = 0; j < this.viewHeight; j++) {
      this.loadMapBlock(j, this.viewWidth - 1, 1, 0)
    }
  }

  private moveShowItemDown() {
    // 把 i-1 ---> i ,
    for (var i = this.viewHeight - 1; i > 0; i--) {
      for (var j = 0; j < this.viewWidth; j++) {
        let offsetObj = this.mapSprites[i - 1][j]
        this.mapSprites[i][j].setLocation(offsetObj.MapData)
      }
    }
    //加载新地图快
    for (var j = 0; j < this.viewWidth; j++) {
      this.loadMapBlock(0, j, 0, -1)
    }
  }
  private moveShowItemRight() {
    // 把 j-1 ---> j ,
    for (var i = this.viewHeight - 1; i >= 0; i--) {
      for (var j = this.viewWidth - 1; j > 0; j--) {
        let offsetObj = this.mapSprites[i][j - 1]
        this.mapSprites[i][j].setLocation(offsetObj.MapData)
      }
    }
    //加载新地图快
    for (var j = 0; j < this.viewHeight; j++) {
      this.loadMapBlock(j, 0, -1, 0)
    }
  }

  private moveMap(dx: number, dy: number) {
    var pos = this.node.getPosition()
    pos.x += dx
    pos.y += dy
    this.offsetY += dy
    this.offsetX += dx
    // Y向大变化 (按上键)
    if (this.offsetY >= this.blockSize) { //加载条件
      if (this.orginMapY + this.viewHeight <= this.maxLat) {
        this.orginMapY++;
        this.moveShowItemUp()
        pos.y -= this.blockSize
        this.offsetY -= this.blockSize
      }
    }

    // Y向小数字变化(按下键)
    if (this.offsetY < -this.blockSize) { //加载条件
      if (this.orginMapY > this.minLat) {
        this.orginMapY--;
        this.moveShowItemDown()
        pos.y += this.blockSize
        this.offsetY += this.blockSize
      }
    }
    // X向大数字变化 (按右键)
    if (this.offsetX < -this.blockSize) { //加载条件
      if (this.orginMapX + this.viewWidth <= this.maxLng) {
        this.orginMapX++;
        this.moveShowItemLeft()
        pos.x += this.blockSize
        this.offsetX += this.blockSize
      }
    }
    // X向小数字变化 (按左键)
    if (this.offsetX >= this.blockSize) { //加载条件
      if (this.orginMapX > this.minLng) {
        this.orginMapX--;
        this.moveShowItemRight()
        pos.x -= this.blockSize
        this.offsetX -= this.blockSize
      }
    }
    this.node.setPosition(pos)
  }

  update(dt) {
    if (this.keyCodeMask & (1 << 0)) {
      this.moveMap(200 * dt, 0)
    }
    if (this.keyCodeMask & (1 << 1)) {
      this.moveMap(0, -200 * dt)
    }
    if (this.keyCodeMask & (1 << 2)) {
      this.moveMap(-200 * dt, 0)
    }
    if (this.keyCodeMask & (1 << 3)) {
      this.moveMap(0, +200 * dt)
    }
  }
}
