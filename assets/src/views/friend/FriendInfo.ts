
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