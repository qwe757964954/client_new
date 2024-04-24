import { assetManager, AudioClip } from "cc";
import { ResLoader } from "./ResLoader";
import AudioUtil from "../util/AudioUtil";

export default class RemoteSoundManager {
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
            assetManager.loadRemote(url, { audioLoadMode: AudioClip.AudioType.DOM_AUDIO }, (err, audioclip: AudioClip) => {
                if (isTimeout) return;
                clearTimeout(loadLimitTimer);
                if (err) {
                    console.log("加载错误", err);
                    resolve(false);
                    return;
                }
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
}