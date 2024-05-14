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


interface WorldBossInfo {
    Code: number;
    Data: {
        BossStatus: {
            Id: number;
            Boss1: number;
            Boss2: number;
            Boss3: number;
            Boss4: number;
            Boss5: number;
            Boss6: number;
            Boss7: number;
            Boss8: number;
            Boss9: number;
        };
        TotalWordNums: number[];
    };
    Msg: string;
    Path: string;
}

const WordBossInfoData: WorldBossInfo = {
    Code: 200,
    Data: {
        BossStatus: {
            Id: 2837,
            Boss1: 0,
            Boss2: 0,
            Boss3: 0,
            Boss4: 0,
            Boss5: 0,
            Boss6: 0,
            Boss7: 3183,
            Boss8: 7100,
            Boss9: 8100
        },
        TotalWordNums: [1000, 1500, 2200, 3000, 4100, 5100, 6100, 7100, 8100]
    },
    Msg: "请求成功",
    Path: "WorldBoss.Info"
};

export { WordBossInfoData };


export interface BossRank {
    Rid: number;
    AccountId: number;
    Num: number;
    RealName: string;
    RoleId: number;
    ModelId: number;
    AvatarBox: number | null;
    Ce: number;
    WingId: number | null;
    MedalSet: string | null;
    Level: number;
    HeadPortrait: any; // Depending on the actual type
    Face: any; // Depending on the actual type
    Hair: any; // Depending on the actual type
    Hat: any; // Depending on the actual type
    Clothes: any; // Depending on the actual type
    Trousers: any; // Depending on the actual type
    Shoes: any; // Depending on the actual type
    Gloves: any; // Depending on the actual type
    Ornament1: any; // Depending on the actual type
    Ornament2: any; // Depending on the actual type
}

export interface AwardPropInfo {
    PropID: number;
    Total: number;
    Change: number
}

export interface JoinAwards {
    Coin: number;
    Diamond: number;
    Props: AwardPropInfo[];
    MedalId: number;
    Score: number;
    Exp: number;
    Stone: number;
    Raffle: number;
    Ce: number;
}
export interface BossGameWord {
    En:string;
    Cn:string;
}

export interface BossGameInfo {
    BossNo: number;
    LastNum: number;
    SubmitNum: number;
    RecFlag: number;
    Words: BossGameWord[]; // Depending on the actual type
    TotalWordNum: number;
}

export interface WorldBossData {
    DamageNum: number;
    Game: BossGameInfo;
    JoinAwards: JoinAwards;
    RankList: BossRank[]; // Array of BossRank objects
    WorldAwards: JoinAwards;
}

export interface WorldBossResponse {
    Code: number;
    Data: WorldBossData;
    Msg: string;
    Path: string;
}