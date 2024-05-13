export interface BossInfo {
    bgImage: string;
    bossImage: string;
    name: string;
    skeleton: string;
    scale: number;
}

const WordBossArray: BossInfo[] = [
    {
        bgImage: "worldBoss/bg1/spriteFrame",
        bossImage: "worldBoss/boss1/spriteFrame",
        skeleton: "spine/worldBoss/hongyanlong/hongyanlong.json",
        scale:0.7,
        name: "焰鳄"
    },
    {
        bgImage: "worldBoss/bg2/spriteFrame",
        bossImage: "worldBoss/boss2/spriteFrame",
        skeleton: "spine/worldBoss/bingyuanmengma/bingyuanmengma.json",
        scale:0.4,
        name: "冰猛犸"
    },
    {
        bgImage: "worldBoss/bg3/spriteFrame",
        bossImage: "worldBoss/boss3/spriteFrame",
        skeleton: "spine/worldBoss/jukouniaolong/jukouniaolong.json",
        scale:0.7,
        name: "大嘴鸟"
    },
    {
        bgImage: "worldBoss/bg4/spriteFrame",
        bossImage: "worldBoss/boss4/spriteFrame",
        skeleton: "spine/worldBoss/hanzhu/hanzhu.json",
        scale:0.7,
        name: "蓝翼蛛"
    },
    {
        bgImage: "worldBoss/bg5/spriteFrame",
        bossImage: "worldBoss/boss5/spriteFrame",
        skeleton: "spine/worldBoss/qiguanglong/qiguanglong.json",
        scale:0.85,
        name: "紫棘龙"
    },
    {
        bgImage: "worldBoss/bg6/spriteFrame",
        bossImage: "worldBoss/boss6/spriteFrame",
        skeleton: "spine/worldBoss/diyifeng/diyifeng.json",
        scale:0.85,
        name: "绿腹蜂"
    },
    {
        bgImage: "worldBoss/bg7/spriteFrame",
        bossImage: "worldBoss/boss7/spriteFrame",
        skeleton: "spine/worldBoss/qiguanglong/qiguanglong.json",
        scale:0.85,
        name: "巨象龟"
    },
    {
        bgImage: "worldBoss/bg8/spriteFrame",
        bossImage: "worldBoss/boss8/spriteFrame",
        skeleton: "spine/worldBoss/qiguanglong/qiguanglong.json",
        scale:0.85,
        name: "三头狼"
    },
    {
        bgImage: "worldBoss/bg9/spriteFrame",
        bossImage: "worldBoss/boss9/spriteFrame",
        skeleton: "spine/worldBoss/qiguanglong/qiguanglong.json",
        scale:0.85,
        name: "黄泉龙"
    },
];

export default WordBossArray;
