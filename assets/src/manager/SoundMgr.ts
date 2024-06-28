import AudioUtil from "../util/AudioUtil";

export const SoundConfig = {
    loginBgm: "sound/bgm/loginbgm",
    mainBgm: "sound/bgm/mainbgm",

    clik: "sound/click",
    correct: "sound/correct",
    wrong: "sound/wrong",
    victory: "sound/succ",
    fail: "sound/fail"
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
    /**选择正确 */
    static correct() {
        AudioUtil.playEffect(SoundConfig.correct);
    }
    /**选择错误 */
    static wrong() {
        AudioUtil.playEffect(SoundConfig.wrong);
    }

    /**胜利 */
    static victory() {
        AudioUtil.playEffect(SoundConfig.victory);
    }
    /**失败 */
    static fail() {
        AudioUtil.playEffect(SoundConfig.fail);
    }
}