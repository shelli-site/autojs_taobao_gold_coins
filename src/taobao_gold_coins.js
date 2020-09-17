import GoldCoins from "./core/GoldCoins";
import ShopTask from "./core/ShopTask";

auto.waitFor();
let tao_jin_bi = new GoldCoins();
let shop_jin_bi = new ShopTask();

tao_jin_bi.end = () => {
    shop_jin_bi.run();
}
tao_jin_bi.run();

