import { AudioClip, AudioSource, director, Node, resources } from "cc";

//声音工具类
export default class AudioUtil {
    private _audioNode: Node = null;//背景音乐音频node
    private _musicSource: AudioSource = null;//背景音乐
    private _effectSource: AudioSource = null;//音效音频
    public musicVolume: number = 1.0;//背景音乐音量
    public effectVolume: number = 1.0;//音效音量

    private static _AudioUtl: AudioUtil = null;
    public static get instance(): AudioUtil {
        if (!this._AudioUtl) {
            this._AudioUtl = new AudioUtil();
        }
        return this._AudioUtl;
    }
    private constructor() {
        this._audioNode = new Node("_AudioUtil_");
        director.getScene().addChild(this._audioNode);
        director.addPersistRootNode(this._audioNode);
        this._musicSource = this.createSource(this.musicVolume, true);
        this._effectSource = this.createSource(this.effectVolume, false);
    }
    private createSource(volume: number, isLoop: boolean): AudioSource {
        let source = this._audioNode.addComponent(AudioSource);
        source.clip = null;
        source.volume = volume;
        source.loop = isLoop;
        source.playOnAwake = false;
        return source;
    }

    //播放音效
    public static playEffect(sound: AudioClip | string, volumeScale: number = 1.0) {
        AudioUtil.instance.playEffect(sound, volumeScale);
    }
    public playEffect(sound: AudioClip | string, volumeScale: number = 1.0) {
        if (!sound) return;
        if (sound instanceof AudioClip) {
            this._effectSource.playOneShot(sound, volumeScale);
        } else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                    return;
                }
                this._effectSource.playOneShot(clip, volumeScale);
            })
        }
    }

    //播放背景音乐
    public static playMusic(sound: AudioClip | string, volumeScale: number = 1.0) {
        AudioUtil.instance.playMusic(sound, volumeScale);
    }
    public playMusic(sound: AudioClip | string, volumeScale: number = 1.0) {
        if (!sound) return;
        if (sound instanceof AudioClip) {
            this.playMusicEx(sound, volumeScale);
        } else {
            resources.load(sound, (err, clip: AudioClip) => {
                if (err) {
                    console.log(err);
                    return;
                }
                this.playMusicEx(clip, volumeScale);
            })
        }
    }
    public playMusicEx(sound: AudioClip, volumeScale: number = 1.0) {
        if (this._musicSource.playing && this._musicSource.clip == sound) return;
        this._musicSource.stop();
        this._musicSource.clip = sound;
        this._musicSource.volume = this.musicVolume * volumeScale;
        this._musicSource.play();
    }
    //停止背景音乐
    public static stopMusic() {
        AudioUtil.instance.stopMusic();
    }
    public stopMusic() {
        this._musicSource.stop();
    }
    //暂停背景音乐
    public static pauseMusic() {
        AudioUtil.instance.pauseMusic();
    }
    public pauseMusic() {
        this._musicSource.pause();
    }
    //恢复背景音乐
    public static resumeMusic() {
        AudioUtil.instance.resumeMusic();
    }
    public resumeMusic() {
        this._musicSource.play();
    }
    //静音
    public static mute() {
        AudioUtil.instance.mute();
    }
    public mute() {
        this._musicSource.volume = 0.0;
        this._effectSource.volume = 0.0;
    }
    //取消静音
    public static unmute() {
        AudioUtil.instance.unmute();
    }
    public unmute() {
        this._musicSource.volume = this.musicVolume;
        this._effectSource.volume = this.effectVolume;
    }
    //设置背景音乐音量
    public static setMusicVolume(volume: number) {
        AudioUtil.instance.setMusicVolume(volume);
    }
    public setMusicVolume(volume: number) {
        this._musicSource.volume = volume;
    }
    //设置音效音量
    public static setEffectVolume(volume: number) {
        AudioUtil.instance.setEffectVolume(volume);
    }
    public setEffectVolume(volume: number) {
        this._effectSource.volume = volume;
    }
}