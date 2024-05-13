import AudioUtil from "../util/AudioUtil";

export const SoundConfig = {
    loginBgm: "sound/bgm/loginbgm",
    mainBgm: "sound/bgm/mainbgm",

    clik: "sound/click",
}

/**声音播放管理 */
export class SoundMgr {
    /**点击音效 */
    static click() {
        AudioUtil.playEffect(SoundConfig.clik);
    }
    /**登录背景音 */
    static loginBgm() {
        AudioUtil.playMusic(SoundConfig.loginBgm);
    }
    /**主背景音 */
    static mainBgm() {
        AudioUtil.playMusic(SoundConfig.mainBgm);
    }
    /**停止背景音乐 */
    static stopBgm() {
        AudioUtil.stopMusic();
    }
}