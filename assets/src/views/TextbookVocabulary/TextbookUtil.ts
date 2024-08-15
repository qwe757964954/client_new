export class TextbookUtil { 
    public static calculateDays(totoal_level:number,challengesPerDay: number){
        if (challengesPerDay === 0) {
            console.error("challengesPerDay cannot be zero.");
            return 0; // or another default value
        }
        return Math.ceil(totoal_level / challengesPerDay);
    }

    public static calculateLevels(total_level: number, days: number): number {
        if (days === 0) {
            console.error("Days cannot be zero.");
            return 0; // or another default value
        }
        return Math.ceil(total_level / days);
    }
    
    /**
	 * 根据天数计划那天的年月日
	 * @param days 天数
	 * @returns 
	 */
	public static getFormattedDate(days: number): string {
        // 几天算作一天
        days = days - 1;
		// 获取当前日期
		let currentDate = new Date();
	
		// 计算目标日期
		currentDate.setDate(currentDate.getDate() + days);
	
		// 获取年份、月份和日期
		let year = currentDate.getFullYear();
		let month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
		let day = currentDate.getDate().toString().padStart(2, '0');
	
		// 格式化日期为 "xxxx年xx月xx日"
		return `${year}年${month}月${day}日`;
	}
    /**
     * 关卡计算预估时间算法
     * @param level 关卡
     * @returns 
     */
    public static formatTotalMinutes(level: number): string {
        // 计算总分钟数
        let totalMinutes = Math.ceil(level * 5 / 10 * 5);
    
        // 计算小时和分钟
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;
    
        // 构建格式化的时间字符串
        if (hours > 0) {
            return `${hours}小时${minutes}分钟`;
        } else {
            return `${minutes}分钟`;
        }
    }
}