"use strict";

auto.waitFor();
var tao_jin_bi = new GoldCoins();
var shop_jin_bi = new ShopTask();

tao_jin_bi.end = function () {
    shop_jin_bi.run();
};
tao_jin_bi.run();