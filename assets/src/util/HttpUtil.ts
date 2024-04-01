// http网络请求类
export default class HttpUtil{

    public static get(url:string){
        console.log("HttpUtil get",url);
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 400)) {
                        resolve(xhr.responseText);
                    } else {
                        reject();
                    }
                }
            }
            xhr.send();
        })
    }

    public static post(url:string,data:any){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 400)) {
                        resolve(xhr.responseText);
                    } else {
                        reject();
                    }
                }
            }
            xhr.send(data);
        })
    }

    // 未测试方法，未知原生是否可用
    public static upload(url:string,file:string){
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            let formData = new FormData();
            formData.append("file",file);
            xhr.open("POST", url, true);
            // xhr.setRequestHeader("Content-type", "multipart/form-data");
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    if ((xhr.status >= 200 && xhr.status < 400)) {
                        resolve(xhr.responseText);
                    } else {
                        reject();
                    }
                }
            }
            xhr.send(formData);
        })
    }
}
