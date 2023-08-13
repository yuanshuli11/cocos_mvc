export default class ResMgr extends cc.Component {

    private totalAb: number = 0;
    private nowAb: number = 0;

    private total: number = 0;
    private now: number = 0;

    private abBunds: any = {};
    private progressFunc: Function | null = null;
    private endFunc: Function | null = null;

    private _prefabDic: any = {};
    private _imgDic: any = {};
    private _atlasDic: any = {};
    private _audioDic: any = {};
    private _jsonDic: any = {};

    public static Instance: ResMgr = null as unknown as ResMgr;
    onLoad(): void {
        if (ResMgr.Instance === null) {
            ResMgr.Instance = this;
        }
        else {
            this.destroy();
            return;
        }
    }

    private loadAssetsBundle(abName: string, endFunc: Function): void {
        cc.assetManager.loadBundle(abName, (err, bundle) => {
            if (err !== null) {
                console.log("[ResMgr]:Load AssetsBundle Error: " + abName);
                this.abBunds[abName] = null;
            }
            else {
                console.log("[ResMgr]:Load AssetsBundle Success: " + abName);
                this.abBunds[abName] = bundle;
            }
            if (endFunc) {
                endFunc();
            }
        });
    }

    private loadRes(abBundle: any, url: any, typeClasss: any): void {
        let path = url.path ? url.path : url;
        abBundle.load(path, typeClasss, (error: any, asset: any) => {
            this.now++
            if (error) {
                console.log("load Res " + path + " error: " + error);
            }
            else {
                console.log("load Res " + path + " success!");
            }
            if (this.progressFunc) {
                this.progressFunc(this.now, this.total);
            }
            this._cacheRes(asset, typeClasss);

            if (this.now >= this.total) {

                if (this.endFunc !== null) {
                    this.endFunc();
                }
            }
        });
    }
    /**
        * 获取本地缓存资源
        * @param name 资源名称
        * @param type 类型
        */
    public getRes(name: string, type: typeof cc.Asset) {
        switch (type) {
            case cc.Prefab: {
                return this._check(name, this._prefabDic[name]);
            }
            case cc.SpriteFrame: {
                return this._check(name, this._imgDic[name]);
            }
            case cc.AudioClip: {
                return this._check(name, this._audioDic[name]);
            }
            case cc.JsonAsset: {
                return this._check(name, this._jsonDic[name]);
            }
            default: {
                cc.log("资源类型不存在：" + type);
                return null;
            }
        }
    }

    private _check(name: string, res: any) {
        if (res && res.isValid) {
            return res;
        } else {
            cc.log("资源不存在：" + name);
            return null;
        }
    }

    private _cacheRes(res: any, type: typeof cc.Asset) {
        if (type == cc.Prefab) {
            this._cachePrefab(res);
        } else if (type == cc.SpriteFrame) {
            this._cacheTexture(res);
        } else if (type == cc.SpriteAtlas) {
            this._cacheSpriteAtlas(res);
        } else if (type == cc.AudioClip) {
            this._cacheAudioClip(res);
        } else if (type == cc.JsonAsset) {
            this._cacheJsonAsset(res);
        }
    }
    private _cachePrefab(res: cc.Prefab) {
        if (res) {
            res.addRef();
            this._prefabDic[res.name] = res;
        }
    }

    private _cacheTexture(res: cc.SpriteFrame) {
        if (res) {
            res.addRef();
            this._imgDic[res.name] = res;
        }
    }

    private _cacheSpriteAtlas(res: cc.SpriteAtlas) {
        if (res) {
            res.addRef();
            this._atlasDic[res.name] = res;

            let spframes: cc.SpriteFrame[] = res.getSpriteFrames();
            for (let i = 0; i < spframes.length; i++) {
                this._cacheTexture(spframes[i]);
            }
        }
    }

    private _cacheAudioClip(res: cc.AudioClip) {
        if (res) {
            res.addRef();
            this._audioDic[res.name] = res;
        }
    }

    private _cacheJsonAsset(res: cc.JsonAsset) {
        if (res) {
            res.addRef();
            this._jsonDic[res.name] = res;
        }
    }

    private loadAssetsInAssetsBundle(resPkg: any): void {

        for (var key in resPkg) {
            var urlSet = resPkg[key].urls;
            var typeClass = resPkg[key].assetType;

            for (var i = 0; i < urlSet.length; i++) {
                let out = [];
                this.abBunds[key].getDirWithPath(urlSet[i], typeClass, out);
                for (let j = 0; j < out.length; j++) {
                    this.loadRes(this.abBunds[key], out[j], typeClass);
                }
                console.log("==11", this.total, this.now)
            }

        }
    }

    private calcTotal(resPkg, reloadResFunc) {
        this.total = 0;
        this.now = 0;
        this.totalAb = 0;
        this.nowAb = 0;
        for (var key in resPkg) {
            this.totalAb++;
        }
        for (var key in resPkg) {

            this.loadAssetsBundle(key, () => {
                this.nowAb++;
                if (this.nowAb === this.totalAb) {
                    for (var key in resPkg) {
                        var urlSet = resPkg[key].urls;
                        var typeClass = resPkg[key].assetType;
                        for (var i = 0; i < urlSet.length; i++) {
                            let out = [];
                            this.abBunds[key].getDirWithPath(urlSet[i], typeClass, out);
                            this.total += out.length

                        }
                    }
                    reloadResFunc(resPkg)
                }
            });
        }
    }
    // var pkg = {GUI: {assetType: cc.Prefab, urls: ["", "", ""] }};
    public preloadResPkg(resPkg: any, progressFunc: Function | null, endFunc: Function): void {
        // this.total = 0;
        // this.now = 0;
        // this.totalAb = 0;
        // this.nowAb = 0;

        this.progressFunc = progressFunc;
        this.endFunc = endFunc;

        // for (var key in resPkg) {
        //     this.totalAb++;
        //     this.total += resPkg[key].urls.length;
        // }
        this.calcTotal(resPkg, (resPkg) => {
            console.log("==key", this.nowAb, this.total)
            this.loadAssetsInAssetsBundle(resPkg);
        })

    }

    public unloadResPkg(resPkg: any): void {

    }

    public prelaodRes(abName: string, url: string, progressFunc: Function, endFunc: Function): void {

    }

    public getAsset(abName: string, resUrl: string): any {
        var bondule = cc.assetManager.getBundle(abName);
        if (bondule === null) {
            console.log("[error]: " + abName + " AssetsBundle not loaded !!!");
            return null;
        }
        return bondule.get(resUrl);
    }
}
