import { assetManager, AudioClip, AudioSource } from "cc";
import { NetConfig } from "../config/NetConfig";
import GlobalConfig from "../GlobalConfig";
import { ResLoader } from "./ResLoader";

class RemoteSoundManager {
    private _cacheAsset: Map<string, AudioSource> = new Map();
    private _playList: Set<string> = new Set();
    private _playPromises: Map<string, Promise<void>> = new Map();

    private static _instance: RemoteSoundManager | null = null;

    public static get i(): RemoteSoundManager {
        if (this._instance === null) {
            this._instance = new RemoteSoundManager();
        }
        return this._instance;
    }

    /**
     * 播放远程音频
     * @param url 音频的远程 URL
     * @returns Promise
     */
    public async playSound(url: string,timeoutDuration:number = 5000): Promise<void> {
        // 如果音频正在播放或已在播放列表中，则直接返回
        if (this._playList.has(url)) return;
        this._playList.add(url);

        try {
            const loadPromise = new Promise<AudioClip>((resolve, reject) => {
                // 超时处理
                const loadLimitTimer = setTimeout(() => {
                    this._playList.delete(url);
                    reject(new Error('音频加载超时'));
                }, timeoutDuration);
                // 加载音频
                ResLoader.instance.loadRemote(url, { audioLoadMode: AudioClip.AudioType.WEB_AUDIO }, (err, audioclip: AudioClip) => {
                    clearTimeout(loadLimitTimer);
                    if (err) {
                        console.error("加载错误", err);
                        this._playList.delete(url);
                        reject(err);
                        return;
                    }
                    resolve(audioclip);
                });
            });

            const audioclip = await loadPromise;
            let audioSource = new AudioSource();
            audioSource.clip = audioclip;
            this._cacheAsset.set(url, audioSource);

            // 播放音频
            const durationTime = audioclip.getDuration();
            audioSource.play();

            // 处理音频播放完成
            await new Promise<void>(resolve => {
                if (durationTime > 0) {
                    setTimeout(() => {
                        this._playList.delete(url);
                        resolve();
                    }, durationTime * 1000);
                } else {
                    this._playList.delete(url);
                    resolve();
                }
            });
        } catch (error) {
            console.error('播放音频错误', error);
        }
    }

    /**
     * 停止播放指定 URL 的音频
     * @param url 音频的远程 URL
     */
    public stopSound(url: string): void {
        const audioSource = this._cacheAsset.get(url);
        if (audioSource) {
            audioSource.stop();
            this._cacheAsset.delete(url);
        }
        this._playList.delete(url);
    }

    /**
     * 清理所有音频资源
     */
    public clearAudio(): void {
        this._cacheAsset.forEach(asset => {
            assetManager.releaseAsset(asset.clip);
        });
        this._cacheAsset.clear();
    }

    /**
     * 获取音频类型
     * @returns 音频类型字符串
     */
    private getSoundType(): string {
        return GlobalConfig.USE_US ? "en" : "uk";
    }

    /**
     * 播放单词音频
     * @param word 单词
     * @returns Promise
     */
    public playWord(word: string): Promise<void> {
        const url = `${NetConfig.assertUrl}/sounds/glossary/words/${this.getSoundType()}/${word}.wav`;
        return this.playSound(url);
    }
}

export const RemoteSoundMgr = RemoteSoundManager.i;
