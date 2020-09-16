"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ShowMessage = ShowMessage;
function ShowMessage(msg) {
    log(msg);
    sleep(1500);
    toast(msg);
    sleep(1500);
}