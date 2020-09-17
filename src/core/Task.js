import {ShowMessage} from "../utils/log";
import {endApp, launchOpenApp} from "../utils/appUtils";

export const debug = false;

class Task {


    constructor() {
        this.packageName = "com.taobao.taobao";
        /**
         *
         * @type {*[]}
         */
        this.CompletedTaskList = [];
    }

    /**
     * 执行任务
     */
    run() {
        this.init();
        this.checkAndGoActivity();
        while (this.performTasks()) {
        }
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
        log(`获取任务列表`)
        let ActionsList = this.getTaskList()
        // hasTask 是否还有可完成任务
        // recaptureTask 是否重新获取任务列表
        let hasTask = false, recaptureTask = true;
        if (ActionsList) {
            let taskCounts = this.getTaskCounts(ActionsList);
            if (debug) ShowMessage("已获取" + taskCounts + "个任务")
            for (let i = 0; recaptureTask && i < taskCounts; ++i) {
                recaptureTask = false;
                let {taskBtn, taskText, taskName} = this.getSubtask(ActionsList, i);
                if (taskBtn.text() === "领取奖励") {
                    taskBtn.click();
                    sleep(1000)
                } else if (this.CompletedTaskList.indexOf(taskName) !== -1) {
                    recaptureTask = true;
                    continue;
                } else {
                    if (debug) ShowMessage(`${taskName} ${taskText} ${taskBtn.text()}`)
                    this.doTask(taskBtn, taskText, taskName, () => {
                        recaptureTask = true;
                    });
                }
                this.CompletedTaskList.push(taskName);
            }
        }
        log("=======已完成任务列表=======")
        this.CompletedTaskList.forEach((task, i) => log(`${i} - [${task}]`))
        log("==========================")
        if (!recaptureTask) {
            log("所有任务已完成")
            hasTask = true;
        }
        return hasTask;
    }

    /**
     * 领取奖励
     */
    collectReward() {
        log(`领取奖励。`)
    }

    /**
     * 结束
     */
    end() {
        log(`任务结束，关闭应用。`)
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
     * @param index
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
