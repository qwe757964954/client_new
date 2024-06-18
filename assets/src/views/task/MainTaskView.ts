import { _decorator } from 'cc';
import { TaskBaseData } from '../../models/TaskModel';
import { TaskView } from './TaskView';
const { ccclass, property } = _decorator;

@ccclass('MainTaskView')
export class MainTaskView extends TaskView<TaskBaseData> {
    protected _className = "MainTaskView";
    start() {

    }
}