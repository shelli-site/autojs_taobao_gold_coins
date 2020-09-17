"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.debug = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require("../utils/log");

var _appUtils = require("../utils/appUtils");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var debug = exports.debug = false;

var Task = function () {
    function Task() {
        _classCallCheck(this, Task);

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


    _createClass(Task, [{
        key: "run",
        value: function run() {
            this.init();
            this.checkAndGoActivity();
            while (this.performTasks()) {}
            this.collectReward();
            this.end();
        }

        /**
         * 初始化
         */

    }, {
        key: "init",
        value: function init() {
            (0, _appUtils.launchOpenApp)(this.packageName);
        }

        /**
         * 进入指定活动界面 子类实现
         */

    }, {
        key: "checkAndGoActivity",
        value: function checkAndGoActivity() {
            throw new Error("请实现[checkAndGoActivity]方法");
        }

        /**
         * 执行任务
         */

    }, {
        key: "performTasks",
        value: function performTasks() {
            if (debug) (0, _log.ShowMessage)("执行任务");
            var ActionsList = this.getTaskList();
            var noTask = false,
                hasTask = true;
            if (ActionsList) {
                var taskCounts = this.getTaskCounts(ActionsList);
                if (debug) (0, _log.ShowMessage)("已获取" + taskCounts + "个任务");
                for (var i = 0; hasTask && i < taskCounts; ++i) {
                    hasTask = false;

                    var _getSubtask = this.getSubtask(ActionsList, i),
                        taskBtn = _getSubtask.taskBtn,
                        taskText = _getSubtask.taskText,
                        taskName = _getSubtask.taskName;

                    if (taskBtn.text() == "领取奖励") {
                        taskBtn.click();
                        sleep(1000);
                    } else if (this.CompletedTaskList.indexOf(taskName) !== -1) {
                        hasTask = true;
                        continue;
                    } else {
                        if (debug) (0, _log.ShowMessage)(taskName + " " + taskText + " " + taskBtn.text());
                        this.doTask(taskBtn, taskText, taskName, function () {
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

    }, {
        key: "collectReward",
        value: function collectReward() {}

        /**
         * 结束
         */

    }, {
        key: "end",
        value: function end() {
            (0, _appUtils.endApp)(this.packageName);
        }

        /**
         * 获取任务列表
         * @returns {*[]}
         */

    }, {
        key: "getTaskList",
        value: function getTaskList() {
            throw new Error("请实现[getTaskList]方法");
        }

        /**
         * 获取任务个数
         * @param ActionsList
         * @returns {*}
         */

    }, {
        key: "getTaskCounts",
        value: function getTaskCounts(ActionsList) {
            return ActionsList.childCount();
        }

        /**
         * 获取子任务
         * @param ActionsList
         * @returns {{taskBtn: *, taskName: *, taskText: *}}
         */

    }, {
        key: "getSubtask",
        value: function getSubtask(ActionsList, index) {
            throw new Error("请实现[getSubtask]方法");
        }

        /**
         * 任务执行分支逻辑
         * @param taskBtn
         * @param taskText
         * @param taskName
         * @param repeatCallback
         */

    }, {
        key: "doTask",
        value: function doTask(taskBtn, taskText, taskName, repeatCallback) {
            throw new Error("请实现[doTask]方法");
        }
    }]);

    return Task;
}();

exports.default = Task;