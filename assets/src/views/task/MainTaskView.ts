import { _decorator } from 'cc';
import { Task } from './TaskInfo';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('MainTaskView')
export class MainTaskView extends TaskView<Task> {
    protected _className = "MainTaskView";
    start() {

    }
}


