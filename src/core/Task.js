import {ShowMessage} from "../utils/log";
import {endApp} from "../utils/appUtils";

export const debug = false;

class Task {


    constructor() {
        this.packageName = "com.taobao.taobao";
        /**
         *
         * @type {*[]}
         */
        this.CompletedTaskList = new Array();
    }

    /**
     * 执行任务
     */
    run() {
        this.init();
        this.checkAndGoActivity();
        while (this.performTasks()) ;
        this.collectReward();
        this.end();
    }

    /**
     * 初始化
     */
    init() {
        launchOpenApp(this.packageName)
    }

    /**
     * 进入指定活动界面 子类实现
     */
    checkAndGoActivity() {
        throw new Error("请实现[checkAndGoActivity]方法");
    }

    /**
     * 执行任务
     */
    performTasks() {
        if (debug) ShowMessage("执行任务");
        let ActionsList = this.getTaskList()
        let noTask = false, hasTask = true;
        if (ActionsList) {
            let taskCounts = this.getTaskCounts(ActionsList);
            if (debug) ShowMessage("已获取" + taskCounts + "个任务")
            for (var i = 0; hasTask && i < NBChild; ++i) {
                hasTask = false;
                let {taskBtn, taskText, taskName} = this.getSubtask(ActionsList, i);
                if (taskBtn.text() == "领取奖励") {
                    ActBtn.click();
                    sleep(1000)
                } else if (this.CompletedTaskList.includes(taskName)) {
                    hasTask = true;
                    continue;
                } else {
                    if (debug) ShowMessage(`${taskName} ${taskText} ${taskBtn.text()}`)
                    this.doTask(taskBtn, taskText, taskName, () => {
                        hasTask = true;
                    });
                }
                this.CompletedTaskList.push(taskName);
            }
        }
        if (!hasTask) noTask = true;
        return noTask;
    }

    /**
     * 领取奖励
     */
    collectReward() {
    }

    /**
     * 结束
     */
    end() {
        endApp(this.packageName)
    }

    /**
     * 获取任务列表
     * @returns {*[]}
     */
    getTaskList() {
        throw new Error("请实现[getTaskList]方法");
    }

    /**
     * 获取任务个数
     * @param ActionsList
     * @returns {*}
     */
    getTaskCounts(ActionsList) {
        return ActionsList.childCount();
    }

    /**
     * 获取子任务
     * @param ActionsList
     * @returns {{taskBtn: *, taskName: *, taskText: *}}
     */
    getSubtask(ActionsList, index) {
        throw new Error("请实现[getSubtask]方法");
    }

    /**
     * 任务执行分支逻辑
     * @param taskBtn
     * @param taskText
     * @param taskName
     * @param repeatCallback
     */
    doTask(taskBtn, taskText, taskName, repeatCallback) {
        throw new Error("请实现[doTask]方法");
    }
}

export default Task;
