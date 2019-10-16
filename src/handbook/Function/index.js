/**
 * function 函数
 */
// ------------------------ getting started -----------------------------
// 从有没有名字的角度来说有两种
// 一：命名函数
function namedFunc(x) { }
// 二：匿名函数
var Anonymous = function () { };
// 从声明函数的角度来说分三种
// 一：直接使用 function 声明
function func() { }
// 二：function声明的表达式形式
var funcExp = function () { };
// 三：箭头函数表达式
var arrowFuncExp = function () { };
// 用哪种？一般情况应该选择箭头函数表达式
// ------------------------ 为函数添加类型 -----------------------------
var add = function (operand1, operand2) {
    return operand1 + operand2;
};
// 完整的函数类型
// 函数的类型只和两部分有关：参数类型和返回值类型
// 和参数中捕获的变量无关，那是函数的内部状态，描述一个函数我们只关心函数参数和返回值
var pow = function (x, y) {
    if (y === void 0) { y = 2; }
    return Array.from({ length: y }).reduce(function (product) { return product * x; }, 1);
};
console.log(pow(4)); // 16
// ------------------------ arguments -----------------------------
// 参数
// 可选参数
var buildName = function (firstName, lastName) {
    if (lastName) {
        return firstName + " " + lastName;
    }
    else {
        return firstName;
    }
};
console.log(buildName('Yu', 'Tengjing')); // => Yu Tengjing
console.log(buildName('Luo')); // => Luo
// 带有默认值的参数
// 首先肯定是可选参数，因为可以省略，我们一般不需要指出带有默认值的参数的类型，因为类型一般可以从默认推断出来
var getDate = function (millisecond) {
    if (millisecond === void 0) { millisecond = Date.now(); }
    return new Date(millisecond);
};
console.log(getDate()); // 2019-10-15T15:32:05.766Z
// rest 参数
var log = function () {
    var parts = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        parts[_i] = arguments[_i];
    }
    console.log(parts.join(', '));
};
log('Microsoft', 'Google', 'facebook'); // => Microsoft, Google, facebook
// ------------------------ this -----------------------------
// js 中的 this 指向是一个比较复杂得问题
// 普通函数的 this 指向不不确定的，这也就是为什么在 ts 中普通函数中没有指定 this 类型时 this 会被推断为 any 类型的原因
/**
 看下面 js 中的一个例子
const obj = {
    name: 'ly',
    func() {
        console.log(this.name);
    }
};

obj.func = obj.func.bind({ name: 'bob' });
obj.func() // => 'bob'
结论就是：你无法确定普通函数的 this 是哪个类型
 */
(function () {
    var deck = {
        suits: ['hearts', 'spades', 'clubs', 'diamonds'],
        cards: Array(52),
        createCardPicker: function () {
            return function () {
                var pickedCard = Math.floor(Math.random() * 52);
                var pickedSuit = Math.floor(pickedCard / 13);
                // this' implicitly has type 'any' because it does not have a type annotatio
                // return {suit: this.suits[pickedSuit], card: pickedCard % 13};
            };
        },
    };
})();
var deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    // 给函数指定 this 参数，这样 ts 就知道 this 指向的类型了
    createCardPicker: function () {
        return function () {
            var pickedCard = Math.floor(Math.random() * 52);
            var pickedSuit = Math.floor(pickedCard / 13);
            return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
        };
    },
};
var cardPicker = deck.createCardPicker();
// 编译通过 运行还是会报错
// let pickedCard = cardPicker();
// console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit);
// 为了禁止用户调用我们的第三方库传递的回调函数不会出现 this 错误，可以声明回调有个 this: void 参数
var eventEmitter = {
    addListener: function (callback) {
        callback();
    },
};
var Handler = /** @class */ (function () {
    function Handler() {
        var _this = this;
        // 箭头函数不会使用外部 this，也就是 this: void 的，但是可以绑定 this
        this.callback = function () {
            console.log(_this.message);
        };
    }
    return Handler;
}());
var h = new Handler();
eventEmitter.addListener(h.callback);
// 箭头函数声明的方法和非箭头函数声明的有什么区别？
var K = /** @class */ (function () {
    function K() {
    }
    K.prototype.func = function () { };
    return K;
}());
var F = /** @class */ (function () {
    function F() {
        this.func = function () { };
    }
    return F;
}());
/*
从编译出来的js代码就可以看出，普通函数 是绑定到
class K {
    func() {
    }
}
class F {
    constructor() {
        this.func = () => {
        };
    }
}
*/
