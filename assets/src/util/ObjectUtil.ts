import { ItemData } from "../manager/DataMgr";


export namespace ObjectUtil{
    /** 判断空 */
	export function isNull(param): boolean {
		if (typeof (param) == "number" && isNaN(param) == false) {
			return false;
		}
		if (param != null && param != undefined) {
			return false
		}
		return true
	}
	/** 判断都不为空 */
	export function isNotNull(...args: any[]): boolean {
		let res = true;
		for (let i = 0; i < args.length; i++) {
			if (isNull(args[i])) {
				return false;
			}
		}
		return res;
	}

	/**
	 * 文件路径取文件名称
	 * @param filePath 文件路径 image/file/img.png
	 * @param hasSuffix 结果是否保留后缀名 默认false 不保留
	 * @returns string
	 */
	export function stringSplitFileName(filePath: string, hasSuffix: boolean = false): string {
		if (filePath == null && filePath == undefined || filePath == "") {
			return filePath;
		}
		filePath = String(filePath);
		let pathName = "";
		let trim = filePath.split("/");
		if (trim.length > 0) {
			pathName = trim[trim.length - 1];
			pathName = String(pathName);
			if (hasSuffix == false) {
				let dotIndex = pathName.lastIndexOf(".");

				if (dotIndex == -1) {
					//非文件属性 可能是文件夹
					return pathName;
				}
				pathName = pathName.substring(0, dotIndex);
			}
		}
		return pathName;
	};


	export function extractId(input: string): string {
		return input.replace(/\bUnit\s*/g, "").trim();
	}
	export function isNumericString(value: string): boolean {
		return /^\d+$/.test(value);
	}
	export function formatDateTime(dateTimeString: string): string {
		// 将日期字符串转换为 Date 对象
		const date = new Date(dateTimeString.replace(" ", "T"));
		
		// 获取月份（0-11，需要加1），以及日期
		const month = date.getMonth() + 1; // 月份从0开始，因此需要+1
		const day = date.getDate();
		
		// 获取小时和分钟
		const hours = date.getHours();
		const minutes = date.getMinutes();
		
		// 格式化小时和分钟，确保是两位数
		const formattedHours = hours.toString().padStart(2, '0');
		const formattedMinutes = minutes.toString().padStart(2, '0');
		
		// 拼接成需要的格式
		return `${month}月${day}日 ${formattedHours}:${formattedMinutes}`;
	}

	/** 
	 * 将 awards 对象转换为 ItemData 数组
	 */
	export function convertAwardsToItemData(awards: { [key: string]: number }): ItemData[] {
		return Object.entries(awards).map(([key, value]) => ({
			id: parseInt(key),
			num: value
		}));
	}
	/** 
	 * 将 number[] 对象转换为 ItemData 数组
	 */
	export function convertRewardData(rewardArray:number[]){
        const result = rewardArray.reduce((acc, value, index, array) => {
            if (index % 2 === 0) {
              // 当索引为偶数时
              let propsData: ItemData = {
                    id: value,
                    num: array[index + 1]
                }
              acc.push(propsData);
            }
            return acc;
          }, [] as ItemData[]);

        return result;
    }

	/** 
	 * 将 {
    "pass_reward": [
    ],
    "star_one_reward": [
    ],
    "star_two_reward": [
    ],
    "star_three_reward": [
    ]
	} 对象转换为 ItemData 数组
	 */
	export function extractRewardData(awardInfo: any): ItemData[] {
        const rewardTypes = [
			{ key: 'star_three_reward', from: 'star_three_reward' },
			{ key: 'star_two_reward', from: 'star_two_reward' },
            { key: 'star_one_reward', from: 'star_one_reward' },
            { key: 'pass_reward', from: 'pass_reward' },
            { key: 'random_reward', from: 'random_reward' },
        ];
        console.log("awardInfo.....extractRewardData",awardInfo);
        return rewardTypes.reduce((acc: ItemData[], { key, from }) => {
            if (awardInfo[key]) {
                const rewards = awardInfo[key].map((item: ItemData) => ({ ...item, from }));
                acc.push(...rewards);
            }
            return acc;
        }, []);
    }
}