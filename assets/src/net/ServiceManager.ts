import AccountService from "../service/AccountService";
import StudyService from "../service/StudyService";

export default class ServiceManager {
    private static _instance: ServiceManager = null;
    public accountService: AccountService = null;
    public studyService: StudyService = null;

    public static get i(): ServiceManager {
        if (!this._instance) {
            this._instance = new ServiceManager();
            this._instance.initService();
        }
        return this._instance;
    }

    initService() {
        // 初始化服务
        this.accountService = new AccountService();
        this.studyService = new StudyService();
    }
}