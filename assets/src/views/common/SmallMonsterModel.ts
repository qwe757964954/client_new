import { _decorator, Component, sp } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
const { ccclass, property } = _decorator;
/**精灵 */
@ccclass('SmallMonsterModel')
export class SmallMonsterModel extends Component {
    @property(sp.Skeleton)
    public monster: sp.Skeleton = null;

    protected start(): void {

    }

    async init(path: string) {
        await LoadManager.loadSpine(path, this.monster).then((skeletonData: sp.SkeletonData) => {
            this.idle();
        });
    }

    idle() {
        this.monster.setAnimation(0, 'idle', true);
    }

    attack() {
        this.monster.addAnimation(0, 'attack', false);
        this.monster.addAnimation(0, 'idle', true);
    }

    hit() {
        this.monster.setAnimation(0, 'hit', false);
        this.die();
    }

    die() {
        this.monster.setAnimation(0, 'die', false);
    }

    run() {
        this.monster.setAnimation(0, 'run', true);
    }

    protected onDestroy(): void {

    }
}