import { assetManager, AudioClip } from "cc";
import { NetConfig } from "../config/NetConfig";
import GlobalConfig from "../GlobalConfig";
import AudioUtil from "../util/AudioUtil";

class RemoteSoundManager {
    private _cacheAsset: Map<string, AudioClip> = new Map();

    private static _instance: RemoteSoundManager = null;
    public static get i(): RemoteSoundManager {
        if (this._instance == null) {
            this._instance = new RemoteSoundManager();
        }
        return this._instance;
    }

    playSound(url: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            let isTimeout = false;
            let loadLimitTimer = setTimeout(() => {
                isTimeout = true;
                resolve(false);
            }, 5000);
            assetManager.loadRemote(url, { audioLoadMode: AudioClip.AudioType.WEB_AUDIO }, (err, audioclip: AudioClip) => {
                if (isTimeout) return;
                clearTimeout(loadLimitTimer);
                if (err) {
                    console.log("加载错误", err);
                    resolve(false);
                    return;
                }
                this._cacheAsset.set(url, audioclip);
                let durationTime = audioclip ? audioclip.getDuration() : 0;
                console.log('durationTime', durationTime);
                if (durationTime == 0) {
                    resolve(true);
                } else {
                    AudioUtil.instance.playEffect(audioclip);
                    setTimeout(() => {
                        resolve(true);
                    }, durationTime * 1000);
                }
            });
        })
    }

    /**清理音频资源 */
    clearAudio() {
        this._cacheAsset.forEach(asset => {
            assetManager.releaseAsset(asset);
        });
        this._cacheAsset.clear();
    }

    /**中美音类型字符串 */
    getSoundType() {
        return GlobalConfig.USE_US ? "us" : "en";
    }
    /**播放单词音频 */
    playWord(word: String): Promise<any> {
        let url = NetConfig.assertUrl + "/sounds/glossary/words/" + this.getSoundType() + "/" + word + ".wav";
        return RemoteSoundMgr.playSound(url);
    }
}

export const RemoteSoundMgr = RemoteSoundManager.i;