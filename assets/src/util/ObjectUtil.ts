

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
}