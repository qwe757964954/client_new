import { _decorator, Component, sp, Node, UITransform } from 'cc';
import { LoadManager } from '../../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterModel')
export class MonsterModel extends Component {
    @property(sp.Skeleton)
    public monster: sp.Skeleton = null;
    @property(Node)
    public hpMask: Node = null;
    @property(Node)
    public hpNode: Node = null;
    private _showHp: boolean = false;

    protected start(): void {

    }

    async init(path: string, showHp: boolean = false) {
        this._showHp = showHp;
        this.hpNode.active = this._showHp

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

    injury() {
        return new Promise((resolve) => {
            this.monster.setCompleteListener(() => {
                this.monster.setCompleteListener(null);
                this.monster.setAnimation(0, 'idle', true);
                resolve(true);
            })
            this.monster.setAnimation(0, 'injury', false);
        });
    }

    inHit() {
        return new Promise((resolve) => {
            this.monster.setCompleteListener(() => {
                this.monster.setCompleteListener(null);
                this.monster.setAnimation(0, 'idle', true);
                resolve(true);
            })
            this.monster.setAnimation(0, 'hit', false);
        });
    }

    public hit(aciton: string = 'attack') {
        return new Promise((resolve) => {
            this.monster.setCompleteListener(() => {
                this.monster.setCompleteListener(null);
                this.monster.setAnimation(0, 'idle', true);
                resolve(true);
            })
            this.monster.setAnimation(0, aciton, false);
        });
    }

    die() {
        // this.monster.setAnimation(0, 'die', false);
        return new Promise((resolve) => {
            this.monster.setCompleteListener(() => {
                this.monster.setCompleteListener(null);
                resolve(true);
            })
            this.monster.setAnimation(0, 'die', false);
        });
    }

    flee() {
        this.monster.setAnimation(0, 'flee', true);
    }

    move() {
        this.monster.setAnimation(0, 'move', true);
    }

    action(actionName: string, loop: boolean = false) {
        return new Promise((resolve) => {
            if (loop) {
                this.monster.setAnimation(0, actionName, true);
                resolve(true);
            } else {
                this.monster.setCompleteListener(() => {
                    this.monster.setCompleteListener(null);
                    this.monster.setAnimation(0, 'idle', true);
                    resolve(true);
                })
                this.monster.setAnimation(0, actionName, false);
            }

        });
    }

    setHp(passNum: number, totalNum: number) {
        let transform = this.hpMask.getComponent(UITransform);
        transform.width = (totalNum - passNum) / totalNum * 275;
    }

    protected onDestroy(): void {

    }
}


