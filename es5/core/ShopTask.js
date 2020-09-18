"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _log = require("../utils/log");

var _appUtils = require("../utils/appUtils");

var _Task2 = require("./Task");

var _Task3 = _interopRequireDefault(_Task2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ShopTask = function (_Task) {
    _inherits(ShopTask, _Task);

    function ShopTask() {
        _classCallCheck(this, ShopTask);

        var _this2 = _possibleConstructorReturn(this, (ShopTask.__proto__ || Object.getPrototypeOf(ShopTask)).call(this));

        _this2.Tasks_Activity = "com.taobao.weex.WXActivity";
        _this2.Home_Activity = "com.taobao.tao.TBMainActivity";
        _this2.Coins_Activity = "com.taobao.browser.BrowserActivity";
        return _this2;
    }

    _createClass(ShopTask, [{
        key: "checkAndGoActivity",
        value: function checkAndGoActivity() {
            var _this = this;
            sleep(4000);
            if (isOnCorrectPage()) return;
            log(currentActivity());
            switch (currentActivity()) {
                case this.Home_Activity:
                    (0, _log.ShowMessage)("在主页，准备跳至淘金币页...");
                    (0, _appUtils.clickText)("领淘金币", [540, 960]);
                    sleep(3000);
                    (0, _log.ShowMessage)("已跳至淘金币页！");
                case this.Coins_Activity:
                    (0, _log.ShowMessage)("在淘金币页，准备跳至任务页...");
                    className("android.view.View").depth(10).drawingOrder(0).clickable(false).find().filter(function (e) {
                        return e.childCount() === 1;
                    })[1].child(0).click();
                    (0, _log.ShowMessage)("已跳至任务页！");
                    break;
                default:
                    (0, _appUtils.endApp)(this.packageName);
                    (0, _appUtils.launchOpenApp)(this.packageName);
                    break;
            }
            if (!isOnCorrectPage()) {
                (0, _log.ShowMessage)("无法跳至任务页！");
                (0, _appUtils.endApp)(this.packageName);
                this.checkAndGoActivity();
            }

            function isOnCorrectPage() {
                return _this.Tasks_Activity === currentActivity();
            }
        }
    }, {
        key: "getTaskCounts",
        value: function getTaskCounts(ActionsList) {
            return ActionsList.length;
        }
    }, {
        key: "getTaskList",
        value: function getTaskList() {
            var list = className("android.widget.FrameLayout").column(-1).depth(3).clickable(true).find();
            var effectiveList = list.filter(function (s) {
                return s.childCount && s.childCount() === 1;
            }).map(function (s) {
                return s.child(0).desc() === "逛10秒+10";
            });
            list = list.filter(function (s) {
                return s.childCount && s.childCount() === 3;
            }).filter(function (s, i) {
                return effectiveList[i];
            });
            log(list.length);
            return list;
        }
    }, {
        key: "getSubtask",
        value: function getSubtask(ActionsList, index) {
            var taskBtn = void 0,
                taskName = void 0,
                taskText = void 0;
            var Action = ActionsList[index];
            taskBtn = Action;
            taskName = Action.child(0).desc();
            taskText = "";
            return { taskBtn: taskBtn, taskName: taskName, taskText: taskText };
        }
    }, {
        key: "doTask",
        value: function doTask(taskBtn, taskText, taskName, repeatCallback) {
            this.PerformVisit(taskBtn, taskName, 5000);
        }
    }, {
        key: "collectReward",
        value: function collectReward() {}
    }]);

    return ShopTask;
}(_Task3.default);

exports.default = ShopTask;