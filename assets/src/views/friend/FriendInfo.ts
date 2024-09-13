
export enum FriendTabType {
    List = 0, /** 好友列表 */
    Apply = 1, /** 好友申请 */
    Blacklist = 2 /** 黑名单 */
}

export const FriendTabInfos = [
    { id: FriendTabType.List, title: "好友列表"},
    { id: FriendTabType.Apply, title: "申请列表"},
    { id: FriendTabType.Blacklist, title: "黑名单"},
];

export enum PlayerInfoType {
    KingScore = 0, /** 国王分 */
    Vocabulary = 1, /** 词汇量 */
    CombatEffectiveness = 2 /** 战力值 */
}

export const PlayerInfoResources = [
    { id: PlayerInfoType.KingScore, title: "国王分",url:"friend/playerInfo1/spriteFrame"},
    { id: PlayerInfoType.Vocabulary, title: "词汇量",url:"friend/playerInfo2/spriteFrame"},
    { id: PlayerInfoType.CombatEffectiveness, title: "战力值",url:"friend/playerInfo3/spriteFrame"},
];

export const HeadIdMap = { "101": 101, "1101": 101, "102": 102, "1102": 102, "103": 103, "1103": 103 };


export interface ShortcutInfo {
    id: number;
    cnText: string;
    enText: string;
}