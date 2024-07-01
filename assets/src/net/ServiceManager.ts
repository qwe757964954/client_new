import AccountService from "../service/AccountService";
import { BuildingService } from "../service/BuildingService";
import { PropService } from "../service/PropService";
import { ShopService } from "../service/ShopService";
import StudyService from "../service/StudyService";
import { UserService } from "../service/UserService";

class ServiceManager {
    private static _instance: ServiceManager = null;
    public accountService: AccountService = null;
    public studyService: StudyService = null;
    public buildingService: BuildingService = null;
    public propService: PropService = null;  //背包物品服务
    public shopService: ShopService = null;  //商城相关服务
    public userSrv: UserService = null; //用户相关服务

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
        this.propService = new PropService();
        this.shopService = new ShopService();
        this.userSrv = new UserService();
    }
}
/**ServiceManager单例 */
export const ServiceMgr = ServiceManager.i;