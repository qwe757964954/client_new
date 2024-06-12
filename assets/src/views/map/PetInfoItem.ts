import { Component, Layout, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PetInfoItem')
export class PetInfoItem extends Component {
    @property(Layout)
    public plContent: Layout = null;//内容

    start() {

    }

    update(deltaTime: number) {

    }
}


