/**
 * function 函数
 */
export default undefined;

// ------------------------ getting started -----------------------------
// 从有没有名字的角度来说有两种
// 一：命名函数
function namedFunc(x: number): void {}
// 二：匿名函数
const Anonymous = function() {};

// 从声明函数的角度来说分三种
// 一：直接使用 function 声明
function func() {}
// 二：function声明的表达式形式
const funcExp = function() {};
// 三：箭头函数表达式
const arrowFuncExp = () => {};
// 用哪种？一般情况应该选择箭头函数表达式

// ------------------------ 为函数添加类型 -----------------------------
const add = (operand1: number, operand2: number): number => {
    return operand1 + operand2;
};

// 完整的函数类型
// 函数的类型只和两部分有关：参数类型和返回值类型
// 和参数中捕获的变量无关，那是函数的内部状态，描述一个函数我们只关心函数参数和返回值
const pow: (x: number, y?: number) => number = (x: number, y = 2): number => {
    return Array.from({ length: y } as ArrayLike<number>).reduce(product => product * x, 1);
};
console.log(pow(4)); // 16

// ------------------------ arguments -----------------------------
// 参数
// 可选参数
const buildName = (firstName: string, lastName?: string): string => {
    if (lastName) {
        return `${firstName} ${lastName}`;
    } else {
        return firstName;
    }
};
console.log(buildName('Yu', 'Tengjing')); // => Yu Tengjing
console.log(buildName('Luo')); // => Luo

// 带有默认值的参数
// 首先肯定是可选参数，因为可以省略，我们一般不需要指出带有默认值的参数的类型，因为类型一般可以从默认推断出来
const getDate = (millisecond = Date.now()): Date => {
    return new Date(millisecond);
};
console.log(getDate()); // 2019-10-15T15:32:05.766Z

// rest 参数
const log = (...parts: string[]) => {
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
(function() {
    let deck = {
        suits: ['hearts', 'spades', 'clubs', 'diamonds'],
        cards: Array(52),
        createCardPicker: function() {
            return function() {
                let pickedCard = Math.floor(Math.random() * 52);
                let pickedSuit = Math.floor(pickedCard / 13);

                // this' implicitly has type 'any' because it does not have a type annotatio
                // return {suit: this.suits[pickedSuit], card: pickedCard % 13};
            };
        },
    };
})();

// this 参数
interface Card {
    suit: string;
    card: number;
}
interface Deck {
    suits: string[];
    cards: number[];
    createCardPicker(this: Deck): () => Card;
}
let deck: Deck = {
    suits: ['hearts', 'spades', 'clubs', 'diamonds'],
    cards: Array(52),
    // 给函数指定 this 参数，这样 ts 就知道 this 指向的类型了
    createCardPicker: function() {
        return function(this: Deck) {
            let pickedCard = Math.floor(Math.random() * 52);
            let pickedSuit = Math.floor(pickedCard / 13);

            return { suit: this.suits[pickedSuit], card: pickedCard % 13 };
        };
    },
};

let cardPicker = deck.createCardPicker();
// 编译通过 运行还是会报错
// let pickedCard = cardPicker();
// console.log('card: ' + pickedCard.card + ' of ' + pickedCard.suit);

// 回调函数经常因为被直接调用，this 指向错误，可以使用 this 参数来减少这种错误
// 声明回调有个 this: void 参数
const eventEmitter = {
    addListener(callback: (this: void) => void) {
        callback();
    },
};

class Handler {
    message?: string;
    // 箭头函数不会使用外部 this，也就是 this: void 的，但是可以绑定 this
    callback = () => {
        console.log(this.message);
    };
}

const h = new Handler();
eventEmitter.addListener(h.callback);

// 箭头函数声明的方法和非箭头函数声明的有什么区别？
class K {
    func() {}
}

class F {
    func = () => {};
}

/*
从编译出来的js代码就可以看出，普通函数是绑定到构造器原型上，箭头函数是绑定到实例上
性能上当然普通的函数更高，所有实例共用
var K = (function () {
    function K() {
    }
    K.prototype.func = function () { };
    return K;
}());
var F = (function () {
    function F() {
        this.func = function () { };
    }
    return F;
}());
*/

// ------------------------ overload -----------------------------
// 重载，重载只和参数有关系
// 直接看一个🌰
// 步骤：
// 1. 提供一个参数列表，tsc 会从前往后匹配，如果参数有包涵关系，将短的放前面
// 2. 在最后一个兼容所有参数类型的函数中编写代码
function reverse(target: number): number;
function reverse(target: string): string;
function reverse(target: any): any {
    if (typeof target === 'number') {
        return Number(String(target).split('').reverse().join(''));
    } else if (typeof target === 'string') {
        return target.split('').reverse().join('');
    }
}

// 报错找不到匹配的函数，所以重载列表最后一个声明是不算重载的
// console.log(reverse(true));
