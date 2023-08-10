// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import ResMgr  from "./ResMgr";

export  class UICtrl extends cc.Component {
    protected view = {}
    /** 页面状态 */
    protected _isOpen: boolean = false;
    
    load_all_object(root, path) {
        for(let i = 0; i < root.childrenCount; i ++) {
            this.view[path + root.children[i].name] = root.children[i];
            this.load_all_object(root.children[i], path + root.children[i].name + "/");
        }
    }
    protected onLoad(): void {
        this.view = {};
        this.load_all_object(this.node,"")
    }
    start () {

    }
    public isOpen(): boolean {
        return this.isValid() && this._isOpen;
    }
    public add_button_listen(view_name,caller,func){
        var view_node = this.view[view_name]
        if (!view_node){
                return;
        }
        var button = view_node.getComponent(cc.Button)
        if (!button){
            return;
        }
        view_node.on("click",func,caller)
    }
    // update (dt) {}
}

export  default class UIMgr extends cc.Component {
    private Canvas: cc.Node = null;
    public static Instance: UIMgr = null
    private uiMap = {}

    onLoad () {
        if (UIMgr.Instance===null){
            UIMgr.Instance = this
        }else{  
            this.destroy()
            return;
        }   
        this.Canvas = this.node.parent
    }
    public AddUIItem(uiName,parent?:cc.Node) {
        if (!parent){
            parent = this.Canvas;
        }
        var prefab = ResMgr.Instance.getAsset("GUI","UIItemPrefabs/"+uiName)
        if (prefab){
            var item = cc.instantiate(prefab);
            parent.addChild(item);
            return item
        }
         
    }
    public ShowUI(uiName,parent?:cc.Node) {
        if (!parent){
            parent = this.Canvas;
        }
        this.ClearAll()
        var prefab = ResMgr.Instance.getAsset("GUI","UIPrefabs/"+uiName)
        var item = null;
        if (prefab){
            var item = cc.instantiate(prefab);
            parent.addChild(item);
            item.addComponent(uiName + "_Ctrl");
        }else{
            console.log("[UICtrl]:ShowUI Error Empty prefab:" + uiName);
        }
        this.uiMap[uiName] = item;
        return item;
    }
    public RemoveUI(uiName){
        if (this.uiMap[uiName]){
            this.uiMap[uiName].removeFromParent()
            this.uiMap[uiName] = null;
        }
    }
    public ClearAll(){
        for (var key in this.uiMap){
            this.RemoveUI(key)
        }
    }
}