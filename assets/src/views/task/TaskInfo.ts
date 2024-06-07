
export const taskInfos = [
    { id: 1, title: "登录天数", description: "登录2次" },
    { id: 2, title: "登陆时长", description: "登陆时长达到40分钟" },
    { id: 3, title: "词意模式新通关", description: "本周通3关新的词意模式" },
    { id: 4, title: "抄写模式新通关", description: "本周通3关新的抄写模式" },
    { id: 5, title: "组合模式新通关", description: "本周通3关新的组合模式" },
    { id: 6, title: "朗读模式新通关", description: "本周通3关新的朗读模式" },
    { id: 7, title: "拼写模式新通关", description: "本周通3关新的拼写模式" },
    { id: 8, title: "本周采矿次数", description: "本周采矿2次" },
    { id: 9, title: "本周浇树次数", description: "本周浇树2次" },
    { id: 10, title: "完成复习规划", description: "完成复习规划1次" }
  ];

  // Box animation data array
 export const boxAniData = [
    { id: 1, aniurl: "chest_tutor", x: 130, y: -20 },
    { id: 2, aniurl: "chest_uncommon", x: 255, y: -20 },
    { id: 3, aniurl: "chest_rare", x: 380, y: -20 },
    { id: 4, aniurl: "chest_epic", x: 510, y: -20 },
    { id: 5, aniurl: "chest_legend", x: 625, y: -20 }
  ];
  
  export const AchevementRewardInfos = [
    { id: 1, title: "成就总览", imageUrl: "totallook" },
    { id: 2, title: "角色成长", imageUrl: "juese" },
    { id: 3, title: "精灵培养", imageUrl: "jingling" },
    { id: 4, title: "副本活动", imageUrl: "fuben" },
    { id: 5, title: "能力培养", imageUrl: "jineng" },
    { id: 6, title: "社交", imageUrl: "shejiao" },
    { id: 7, title: "我的勋章", imageUrl: "badge" },
  ];

  // Achievement Interface
export interface AchievementDataInfo {
  AchId: number;        // 成就ID
  Info: string;         // 成就信息
  Awards: string;       // 奖励 (可能是逗号分隔的奖励字符串)
  Type: number;         // 成就类型
  Title: string;        // 成就标题
  T: number;            // 等级或阶段
  SendFlag: number;     // 发送标志
  Score: number;        // 得分
  MedalId: number;      // 奖牌ID
  Bid: number;          // 先前的成就ID (可能为0)
  Mid: number;          // 成就组ID
}
