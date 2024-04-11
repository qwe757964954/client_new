
/**
 * 常量定义
 */

export const PbConst = {

    //性别
    GenderEnum: {
        "Male": 0,
        "Female": 1
    },

    //性别称呼
    GenderNameEnum: {
        "Male": "男",
        "Female": "女"
    },

    //货币
    MoneyEnum: {
        "Gold": 1,
        "Diamond": 2,
        "Ticket": 3
    },

    //道具类型
    PropTypeEnum: {
        "Other": 0,
        "WorldGame": 1,
        "Wings": 2,
        "House": 3,
        "Headbox": 4,
        "Skin": 5,
        "MoChong": 7,
        "Dress":20
    },

    //单词训练类型
    GameModeEnum: {
        "OldTraining": 1,
        "Training": 2, //练习模式
        "Break": 2,    //闯关模式
        "Wrong": 3,    //错题模式
        "Finger": 4,   //指法练习
        "Relaxation": 5,   // 休闲模式(家庭端)
        "Family": 6,   // 家庭模式(家庭端)
        "Meaning": 7, //词意模式
        "Copy": 3, //抄写模式
        "Group": 1 //组合模式
    },

    //道具
    PropEnum: {
        "Prop101": 101,   //放大镜
        "Prop102": 102,   //魔法药水
        "Prop103": 103,   //boss挑战卡
        "Prop104": 104,   //金蛋
        "Prop110": 110, //巧克力
        "Prop111": 111, //杯面
        "Prop112": 112, //牛奶
    },

    //功能
    ModuleEnum: {
        SYS_MOUDLE_GAME: 0, // 0单词大冒险
        SYS_MOUDLE_TEACH: 1, // 1教材单词
        SYS_MOUDLE_CLASSIFY: 2, // 2分类单词
        SYS_MOUDLE_GRAMMAR: 3, // 3语法训练
        SYS_MOUDLE_FINGER: 4, // 4指法练习
        SYS_MOUDLE_WRODTOTAL: 5,  // 5分类单词（课本单词，分类单词，趣味配音）
        SYS_MOUDLE_SHOP: 6, //商城
        SYS_MOUDLE_RANK: 7, //排行榜
        SYS_MOUDLE_SYNCH: 8, // 8同步学
        SYS_MOUDLE_PHC: 9,  // 9自然拼读
        SYS_MOUDLE_PK: 18, // 18PK赛
        SYS_MOUDLE_SPACE: 19, // 19我的小屋
        SYS_MOUDLE_FRIEND: 20, // 20我的好友
        SYS_MOUDLE_WORLDBOSS: 22, // 22世界BOSS

        SYS_MOUDLE_WEEKTASK: 10, // 10每周任务
        SYS_MOUDLE_MAINTASK: 11,// 11主线任务
        SYS_MOUDLE_MEMO: 12,// 12复习本
        SYS_MOUDLE_ACH: 13,// 13成就勋章
        SYS_MOUDLE_ROLELEVEL: 14,// 14特权等级
        SYS_MOUDLE_PETFRIEND: 15,// 15精灵好感度
        SYS_MOUDLE_PROPOSAL: 16,// 16意见收集
        SYS_MOUDLE_PET: 21,// 21我的精灵
        SYS_MOUDLE_CARDGAME: 23,// 23词牌游戏
        SYS_MOUDLE_CARD: 24,// 24词牌册
        SYS_MOUDLE_ADDCOIN: 25 // 25首页每日点击
    },

    //道具中文
    PropCnEnum: {
        "101": "放大镜",
        "102": "魔法药水",
        "103": "boss挑战卡",
        "104": "金蛋",
    },

    //是账号类型
    AccountTypeEnum: {
        "Student": 1,
        "Teacher": 2
    },

    //分类训练入口
    WordEntrance: {
        "bookword": "C",   //教材单词
        "typeword": "T",   //分类单词
    },

    //语法题目类型
    WordSyntaxType: {
        "gapfilling": 1,   //填空题
        "choice": 2,       //选择题
        "wrongtopic": 3,   //对错题
    },

    // 键盘字母
    KeyboardLettersType: {
        "A": 'A',   //A
        "B": 'B',   //B
        "C": 'C',   //C
        "D": 'D',   //D
        "E": 'E',   //E
        "F": 'F',   //F
        "G": 'G',   //G
        "H": 'H',   //H
        "I": 'I',   //I
        "J": 'J',   //J
        "K": 'K',   //K
        "L": 'L',   //L
        "M": 'M',   //M
        "N": 'N',   //N
        "O": 'O',   //O
        "P": 'P',   //P
        "Q": 'Q',   //Q
        "R": 'R',   //R
        "S": 'S',   //S
        "T": 'T',   //T
        "U": 'U',   //U
        "V": 'V',   //V
        "W": 'W',   //W
        "X": 'X',   //X
        "Y": 'Y',   //Y
        "Z": 'Z',   //Z
        "Shift": 'Shift' //Shift
    },

    // 宠物信息(每个阶段的动画量)
    petAnimationSteps: {
        // 闪电狼
        101: {
            1: 6,
            2: 7,
            3: 6,
            4: 6,
            5: 6,
            6: 0,
        },
        // 樱花狐
        102: {
            1: 6,
            2: 5,
            3: 6,
            4: 6,
            5: 6,
            6: 0,
        },
        // 蓝水龙
        103: {
            1: 8,
            2: 6,
            3: 5,
            4: 6,
            5: 6,
            6: 0,
        }
    },

    maleDress: [1106, 1107, 1108, 1109, 1112],

}