import AccountService from "../service/AccountService";
import { BuildingService } from "../service/BuildingService";
import { FriendService } from "../service/FriendService";
import StudyService from "../service/StudyService";

class ServiceManager {
    private static _instance: ServiceManager = null;
    public accountService: AccountService = null;
    public studyService: StudyService = null;
    public buildingService: BuildingService = null;
    public friendService: FriendService = null;

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
        this.buildingService = new BuildingService();
        this.friendService = new FriendService();
    }
}
/**ServiceManager单例 */
export const ServiceMgr = ServiceManager.i;