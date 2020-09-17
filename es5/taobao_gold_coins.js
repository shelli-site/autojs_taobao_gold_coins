"use strict";

var _GoldCoins = require("./core/GoldCoins");

var _GoldCoins2 = _interopRequireDefault(_GoldCoins);

var _ShopTask = require("./core/ShopTask");

var _ShopTask2 = _interopRequireDefault(_ShopTask);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

auto.waitFor();
var tao_jin_bi = new _GoldCoins2.default();
var shop_jin_bi = new _ShopTask2.default();

tao_jin_bi.end = function () {
    shop_jin_bi.run();
};
tao_jin_bi.run();