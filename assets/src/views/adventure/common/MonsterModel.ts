import { _decorator, Component, sp } from 'cc';
import { LoadManager } from '../../../manager/LoadManager';
const { ccclass, property } = _decorator;

@ccclass('MonsterModel')
export class MonsterModel extends Component {
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

    protected onDestroy(): void {

    }
}


