import UIMgr, { UICtrl } from "../../Managers/UICtrl";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Map_Ctrl extends UICtrl {
    private blockSize:number = 50;
    private mapWidth:number = 0;
    private mapHeight: number = 0;
    private viewWidth : number = 0;
    private viewHeight: number;

    // 初始位置
    private orginMapX: number = 0;
    private orginMapY: number = 0;

    private offsetY = 0;
    private offsetX = 0;
    private keyCodeMask = 0 ;
    onLoad () {
        super.onLoad()
        this.InitMapInfo(50,30,30,8,16)
        this.LoadMapAt(3,3)

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,(event)=>{
          var keyCode = event.keyCode
          switch(keyCode){
              case 37: //左
              this.keyCodeMask |= (1<<0);
                break;
              case 38: //上
              this.keyCodeMask |= (1<<1);
                break;
              case 39: //右
                this.keyCodeMask |= (1<<2);
                break;
              case 40: //下
                this.keyCodeMask |= (1<<3);
                break;
          }
        },this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,(event)=>{
          var keyCode = event.keyCode
          switch(keyCode){
              case 37: //左
                this.keyCodeMask &= ~(1<<0);
                break
              case 38: //上
                this.keyCodeMask &= ~(1<<1);
                break;
              case 39: //右
                this.keyCodeMask &= ~(1<<2);
                  break
              case 40: //下 0000 0001
                this.keyCodeMask &= ~(1<<3);
                break;
          }
        },this)
    }
    private mapSprites:Array<Array<cc.Node>>=[];
    public InitMapInfo(blockSize:number,mapWidth:number,mapHeight:number,viewWidth:number,viewHeight:number){
      this.blockSize = blockSize
      this.mapWidth = mapWidth
      this.mapHeight = mapHeight
      this.viewWidth = viewWidth
      this.viewHeight = viewHeight
      var index = 0;
      for(var i =0;i< viewHeight;i++){
        var lineSprites = [];
        for(var j = 0;j<viewWidth;j++){
           var childNode =  UIMgr.Instance.AddUIItem("MapItem",this.node.getChildByName("mapBlock"))
            
            lineSprites.push(childNode)
            this.setMapItemLocation(childNode,j,i)
            index++;
        }
        this.mapSprites.push(lineSprites);
      }
    }
    private setMapItemLocation(mapItemNode:cc.Node,offsetX:number,offsetY:number){
      var pos = mapItemNode.getPosition()
      pos.x += mapItemNode.width*(offsetX-3)
      pos.y -= mapItemNode.width*(offsetY-3)
      mapItemNode.setPosition(pos)
    }
    // i行 j列 可视化显示的i,j
    private loadMapBlock(i:number,j:number){
        var mapX = j+this.orginMapX;
        var mapY = i+this.orginMapY;
        var loc = `(${mapX},${mapY})`
        this.mapSprites[i][j].getChildByName("loc").getComponent(cc.Label).string=loc
    }
    public LoadMapAt(beginX:number,beginY :number){
        this.orginMapX = this.orginMapY = 0;

        for (var i = 0;i<this.viewHeight;i++){
          for(var j= 0;j<this.viewWidth;j++){
              this.loadMapBlock(i,j)
          }
        }
    }

    private moveShowItemUp(){
       // 把 i ---> i - 1,
        for (var i =1;i<this.viewHeight;i++){
          for (var j = 0;j<this.viewWidth;j++){
              this.mapSprites[i-1][j].getChildByName("loc").getComponent(cc.Label).string =this.mapSprites[i][j].getChildByName("loc").getComponent(cc.Label).string
          }
        }
        //加载新地图快
        for (var j = 0;j<this.viewWidth;j++){
          this.loadMapBlock(this.viewHeight-1,j)
        }
    }
    private moveShowItemLeft(){
      // 把 i-1 ---> i ,
      for (var i = 1;i<this.viewWidth;i++){
        for (var j = 0;j<this.viewHeight;j++){
            this.mapSprites[j][i-1].getChildByName("loc").getComponent(cc.Label).string =this.mapSprites[j][i].getChildByName("loc").getComponent(cc.Label).string
        }
      }
      //加载新地图快
      // for (var j = 0;j<this.viewHeight;j++){
      //   this.loadMapBlock(this.viewWidth-1,j)
      // }
   }
    private moveShowItemDown(){
      // 把 i-1 ---> i ,
      for (var i =this.viewHeight-1;i>0;i--){
        for (var j = 0;j<this.viewWidth;j++){
            this.mapSprites[i][j].getChildByName("loc").getComponent(cc.Label).string =this.mapSprites[i-1][j].getChildByName("loc").getComponent(cc.Label).string
        }
      }
      //加载新地图快
      for (var j = 0;j<this.viewWidth;j++){
        this.loadMapBlock(0,j)
      }
    }
    private moveMap (dx:number,dy:number) {
      var pos = this.node.getPosition()
      pos.x += dx
      pos.y += dy
      this.offsetY +=dy
      this.offsetX +=dx

      // Y向大变化
      if (this.offsetY>=this.blockSize){ //加载条件
        if (this.orginMapY+this.viewHeight<this.mapHeight){
              this.orginMapY++;
              this.moveShowItemUp()
              pos.y-=this.blockSize
              this.offsetY -=this.blockSize
        }
      }

      // Y向小数字变化
      if (this.offsetY<-this.blockSize){ //加载条件
        if (this.orginMapY>-this.mapHeight){
            this.orginMapY--;
            this.moveShowItemDown()
            pos.y+=this.blockSize
            this.offsetY +=this.blockSize
        }
      }  
        // X向小数字变化
      if (this.offsetX<-this.blockSize){ //加载条件
        if (this.orginMapX>-this.mapWidth){
            this.orginMapX--;
            this.moveShowItemLeft()
            pos.x+=this.blockSize
            this.offsetX +=this.blockSize
        }
      }    
      this.node.setPosition(pos)
    }

    update (dt) {
      if (this.keyCodeMask& (1<<0)){
          this.moveMap(-200*dt,0)
      }
      if (this.keyCodeMask & (1<<1)){
        this.moveMap(0,-200*dt)
      }
      if (this.keyCodeMask & (1<<2)){
        this.moveMap(200*dt,0)
      }
      if (this.keyCodeMask & (1<<3)){
        this.moveMap(0,+200*dt)
      }
    }
}