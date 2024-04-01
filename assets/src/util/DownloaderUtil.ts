import { native, game } from "cc";
//版本检测下载类
export default class DownloaderUtil{
    private _assetsManager:native.AssetsManager;
    private _updateListener;
    private _updating:boolean;

    public constructor(){
        let manifestUrl = "version.manifest";
        let storagePath = (native.fileUtils?.getWritablePath() ?? '/') + 'remote-asset';
        this._assetsManager = native.AssetsManager.create(manifestUrl, storagePath);

        this._assetsManager.setVersionCompareHandle((arg1, arg2) => {
            return arg1 === arg2 ? 0 : -1;
        });
        this._updateListener = null;
        this._updating = false;
    }

    public checkUpdate(){
        if(this._updating){
            return;
        }
        this._assetsManager.setEventCallback(this.checkCb.bind(this));

        this._assetsManager.checkUpdate();
        this._updating = true;
    }

    public hotUpdate(){
        if(this._updating){
            return;
        }
        this._assetsManager.setEventCallback(this.updateCb.bind(this));

        this._assetsManager.update();
        this._updating = true;
    }

    private checkCb(event: any) {
        console.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log("No local manifest file found, hot update skipped.");
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log("Fail to download manifest file, hot update skipped.");
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log("Already up to date with the latest remote version.");
                break;
            case native.EventAssetsManager.NEW_VERSION_FOUND:
                console.log('New version found, please try to update. (' + Math.ceil(this._assetsManager.getTotalBytes() / 1024) + 'kb)');
                break;
            default:
                return;
        }

        this._assetsManager.setEventCallback(null!);
        this._updating = false;
    }

    private updateCb(event: any) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                console.log('No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_PROGRESSION:
                // this.panel.byteProgress.progress = event.getPercent();
                // this.panel.fileProgress.progress = event.getPercentByFile();

                // this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                // this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();
                // console.log(this.panel.fileLabel.string, this.panel.byteLabel.string);
                var msg = event.getMessage();
                if (msg) {
                    console.log('Updated file: ' + msg);
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case native.EventAssetsManager.ERROR_PARSE_MANIFEST:
                console.log('Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case native.EventAssetsManager.ALREADY_UP_TO_DATE:
                console.log('Already up to date with the latest remote version.');
                failed = true;
                break;
            case native.EventAssetsManager.UPDATE_FINISHED:
                console.log('Update finished. ' + event.getMessage());
                needRestart = true;
                break;
            case native.EventAssetsManager.UPDATE_FAILED:
                console.log('Update failed. ' + event.getMessage());
                this._updating = false;
                break;
            case native.EventAssetsManager.ERROR_UPDATING:
                console.log('Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case native.EventAssetsManager.ERROR_DECOMPRESS:
                console.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            this._assetsManager.setEventCallback(null!);
            this._updateListener = null;
            this._updating = false;
        }

        if (needRestart) {
            this._assetsManager.setEventCallback(null!);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths = native.fileUtils.getSearchPaths();
            var newPaths = this._assetsManager.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            native.fileUtils.setSearchPaths(searchPaths);

            // restart game.
            setTimeout(() => {
                game.restart();
            }, 1000)
        }
    }
}