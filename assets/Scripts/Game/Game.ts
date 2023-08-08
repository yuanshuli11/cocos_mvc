import ResMgr  from "../Managers/ResMgr";
import UIMgr, { UICtrl } from "../Managers/UICtrl";

export default class Game extends UICtrl{

    public static Instance: Game = null
    private canvas: cc.Node|null = null;
    private progressBar:cc.ProgressBar |null= null;
    onLoad () {
        if (Game.Instance===null){
            Game.Instance = this 
        }else{  
            this.destroy()
            return;
        }
        this.canvas = cc.find("Canvas")
        this.progressBar = this.canvas.getChildByName("ResourceLoading").getChildByName("LoadingProgress").getComponent(cc.ProgressBar)
    }


    public GameStart():void{
        // preLoad
        var resPkg = {
            "GUI": {
                assetType: cc.Prefab,
                urls:[
                    "UIPrefabs/UIGame",
                    "UIPrefabs/ResourceLoading",
                ],
            }
        }

       ResMgr.Instance.preloadResPkg(resPkg,(now,total)=>{
         if (this.progressBar){
            this.progressBar.progress = now/total
         }
        },()=>{
            this.canvas.getChildByName("ResourceLoading").active=false
            this.EnterGameScene()
       })
    }
    public EnterGameScene():void{

        // 释放UI
        UIMgr.Instance.ShowUI("UIGame")
    //   var uiGamePrefab  = ResMgr.Instance.getAsset("GUI","UIPrefabs/UIGame")
    //   var uiGame = cc.instantiate(uiGamePrefab)
    //   this.node.addChild(uiGame)
    }
    start () {

    }

    // update (dt) {}
}
