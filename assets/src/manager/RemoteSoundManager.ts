import { assetManager, AudioClip, AudioSource } from "cc";
import { NetConfig } from "../config/NetConfig";
import GlobalConfig from "../GlobalConfig";

class RemoteSoundManager {
    private _cacheAsset: Map<string, AudioSource> = new Map();
    private _playList: Array<string> = [];

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
                if (this._playList.indexOf(url) == -1) {
                    reject();
                    return;
                }
                isTimeout = true;
                resolve(false);
            }, 5000);
            this._playList.push(url);
            assetManager.loadRemote(url, { audioLoadMode: AudioClip.AudioType.WEB_AUDIO }, (err, audioclip: AudioClip) => {
                if (isTimeout) return;
                clearTimeout(loadLimitTimer);
                if (err) {
                    console.log("加载错误", err);
                    reject();
                    return;
                }
                if (this._playList.indexOf(url) == -1) {
                    return;
                }
                let audioSource = new AudioSource();
                audioSource.clip = audioclip;
                this._cacheAsset.set(url, audioSource);
                let durationTime = audioclip ? audioclip.getDuration() : 0;
                console.log('durationTime', durationTime);
                if (durationTime == 0) {
                    if (this._playList.indexOf(url) == -1) {
                        return;
                    }
                    resolve(true);
                } else {
                    // AudioUtil.instance.playEffect(audioclip);
                    audioSource.play();
                    setTimeout(() => {
                        if (this._playList.indexOf(url) == -1) {
                            return;
                        }
                        resolve(true);
                    }, durationTime * 1000);
                }
            });
        })
    }

    stopSound(url: string) {
        let audioSource = this._cacheAsset.get(url);
        if (audioSource) {
            audioSource.stop();
            this._cacheAsset.delete(url);
        }
        let index = this._playList.indexOf(url);
        if (index != -1) {
            this._playList.splice(index, 1);
        }
    }

    /**清理音频资源 */
    clearAudio() {
        this._cacheAsset.forEach(asset => {
            assetManager.releaseAsset(asset.clip);
        });
        this._cacheAsset.clear();
    }

    /**中美音类型字符串 */
    getSoundType() {
        return GlobalConfig.USE_US ? "en" : "uk";
    }
    /**播放单词音频 */
    playWord(word: String): Promise<any> {
        let url = NetConfig.assertUrl + "/sounds/glossary/words/" + this.getSoundType() + "/" + word + ".wav";
        return RemoteSoundMgr.playSound(url);
    }
}

export const RemoteSoundMgr = RemoteSoundManager.i;