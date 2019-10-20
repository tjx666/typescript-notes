/**
 * 枚举
 *
 */
// ------------------------ 思考 -----------------------------
/*
最早接触枚举是在 C 语言中，用来抽象一系列类似的值
枚举理论上来说应该具备以下几个特点：
1. 有限性 枚举肯定是有限的，毕竟枚举成员是硬编码的
2. 同类型 毕竟是表示同类型事物，它们的值应该是相同的
3. 不可变 枚举值应该是不可变的，因为他们的值变化毫无意义
4. 唯一性 其实语法上是允许不同的枚举成员的值是相同的，但是我们应该尽量避免

枚举的使用场景非常的典型，本质上如果碰到需要表示一系列相同类型的值就可以选择枚举了。
例如 Promise 的 3 种状态，大多数使用 switch case 的情况，case 值本身就可以构成一个枚举。

枚举有什么好处呢？
我觉得最大的优点更好的抽象表示一类相似的值，没有枚举相对比较好的方式是使用对象，如：
const PromiseStatus ={
    pending: Symbol('promise pending status), // 使用 Symbol 来获得唯一值
    fulfilled: Symbol('promise fulfilled'),
    rejected: Symbol('promise rejected)
};

最挫的方法是定义一系列常量：
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

其实还有更挫的是直接用 0, 1, 2，简直一堆魔法数字

使用枚举多优雅:
enum PromiseStatus {
    PENDING,
    FULFILLED,
    REJECTED
}
 */
// ------------------------ Numeric enums -----------------------------
// ts 枚举值有两种类型：数值型和字符串型
var Season;
(function (Season) {
    Season[Season["SPRING"] = 0] = "SPRING";
    Season[Season["SUMMER"] = 1] = "SUMMER";
    Season[Season["AUTUMN"] = 2] = "AUTUMN";
    Season[Season["WINTER"] = 3] = "WINTER";
})(Season || (Season = {}));
// 看一下编译成 js 的结果
/*
编译出的 js 是下面这样的：
var Season;
(function (Season) {
    Season[Season["SPRING"] = 0] = "SPRING";
    Season[Season["SUMMER"] = 1] = "SUMMER";
    Season[Season["AUTUMN"] = 2] = "AUTUMN";
    Season[Season["WINTER"] = 3] = "WINTER";
})(Season || (Season = {}));

其实枚举最后输的是一个对象，tsc 在构造这个对象的时候使用了一个小技巧：
当你需要定义键值可以互相访问的时候，即 obj[key] = value; obj[value] = key; 可以采用：obj[obj[key] = value] = key;
*/
// 第一个枚举成员未初始化的情况下，默认值是0，当前枚举成员没有初始化并且前一个成员值是数字的情况下值是前一个成员值 + 1
console.log(Season.SPRING); // => 0
console.log(Season.SUMMER); // => 1
console.log(Season.AUTUMN); // => 2
// 反向取值
console.log(Season[0]); // => Spring
var Days;
(function (Days) {
    Days[Days["Sun"] = 1] = "Sun";
    Days[Days["Mon"] = 2] = "Mon";
    Days[Days["Tue"] = 3] = "Tue";
    Days[Days["Wed"] = 4] = "Wed";
    Days[Days["Thu"] = 5] = "Thu";
    Days[Days["Fri"] = 6] = "Fri";
    Days[Days["Sat"] = 7] = "Sat";
})(Days || (Days = {}));
console.log(Days.Mon); // => 2
(function () {
    // 手动赋值可能会出现枚举值重复的情况，但是 Typescript 并不会察觉到这一点
    let Days;
    (function (Days) {
        Days[Days["Sun"] = 3] = "Sun";
        Days[Days["Mon"] = 1] = "Mon";
        Days[Days["Tue"] = 2] = "Tue";
        Days[Days["Wed"] = 3] = "Wed";
        Days[Days["Thu"] = 4] = "Thu";
        Days[Days["Fri"] = 5] = "Fri";
        Days[Days["Sat"] = 6] = "Sat";
    })(Days || (Days = {}));
    console.log(Days['Sun'] === 3); // true
    console.log(Days['Wed'] === 3); // true
    console.log(Days[3] === 'Sun'); // false
    console.log(Days[3] === 'Wed'); // true
})();
// 数值型枚举值还可以是负数或小数，后续跟着的成员如果没有初始化还是 + 1
var Direction;
(function (Direction) {
    Direction[Direction["EAST"] = -1] = "EAST";
    Direction[Direction["SOUTH"] = 0.5] = "SOUTH";
    Direction[Direction["WEST"] = 1.5] = "WEST";
    Direction[Direction["NORTH"] = 2.5] = "NORTH";
})(Direction || (Direction = {}));
console.log(Direction.WEST); // 1.5
console.log(Direction.NORTH); // 2.5
// ------------------------ String enum -----------------------------
// 枚举值可以是字符串类型
var PromiseStatus;
(function (PromiseStatus) {
    PromiseStatus["Pending"] = "pending";
    PromiseStatus["Fulfilled"] = "fulfilled";
    PromiseStatus["Rejected"] = "rejected";
})(PromiseStatus || (PromiseStatus = {}));
/*编译结果
var PromiseStatus;
(function (PromiseStatus) {
    PromiseStatus["Pending"] = "pending";
    PromiseStatus["Fulfilled"] = "fulfilled";
    PromiseStatus["Rejected"] = "rejected";
})(PromiseStatus || (PromiseStatus = {}));
 */
// 比起数值型枚举的好处就是枚举值是个字符串，更好理解
console.log(PromiseStatus.Rejected); // => rejected
// 很明显不能反向取值, 看例子就知道了
// Property 'pending' does not exist on type 'typeof PromiseStatus'. Did you mean 'PENDING'?
// PromiseStatus['pending'];
// ------------------------ member -----------------------------
// ts 枚举成员分两类
// 常量成员：编译期间可推导出值得成员
var ConstantEnumMember;
(function (ConstantEnumMember) {
    ConstantEnumMember[ConstantEnumMember["FIRST"] = 0] = "FIRST";
    ConstantEnumMember[ConstantEnumMember["SECOND"] = 1] = "SECOND";
    // FIRST + SECOND 这个叫常量枚举表达式，首先它是个常量表达式，但是一般的常量表达式可不能是使用枚举成员，所以叫常量枚举表达式
    ConstantEnumMember[ConstantEnumMember["THIRD"] = 1] = "THIRD";
})(ConstantEnumMember || (ConstantEnumMember = {}));
// 计算成员：编译期间无法确定枚举值的枚举成员
var ComputedEnumMember;
(function (ComputedEnumMember) {
    ComputedEnumMember[ComputedEnumMember["FIRST"] = 'abcd'.length] = "FIRST";
})(ComputedEnumMember || (ComputedEnumMember = {}));
// 如果一个枚举它成员都是常量成员，那么这个枚举的每一个成员都同时是一种类型，这个类型的值只有枚举成员本身
// 拿前面的 Direction 枚举来说
const east = Direction.EAST;
// ------------------------ compile enum -----------------------------
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["ERROR"] = 0] = "ERROR";
    LogLevel[LogLevel["WARN"] = 1] = "WARN";
    LogLevel[LogLevel["INFO"] = 2] = "INFO";
    LogLevel[LogLevel["DEBUG"] = 3] = "DEBUG";
})(LogLevel || (LogLevel = {}));
function printImportant(key, message) {
    const num = LogLevel[key];
    if (num <= LogLevel.WARN) {
        console.log('Log level key is: ', key);
        console.log('Log level value is: ', num);
        console.log('Log level message is: ', message);
    }
}
printImportant('ERROR', 'This is a message');
// 我觉得和 keyof 作用于普通对象没什么区别，把枚举当一个对象看待就好了
const testOBj = { name: 'ly', age: 21 };
console.log(1 /* Tencent */);
let aligns = [Aligns.Up, Aligns.Down, Aligns.Left, Aligns.Right];
/* 编译结果
let aligns = [Aligns.Up, Aligns.Down, Aligns.Left, Aligns.Right];
*/
// declare 和 const 可以同时作用于 enum
// !提问
// 如何选择数字枚举和字符串枚举?
/*
如果需要序列化的时候值是非数字的情况下那只能选择使用字符串枚举，其它情况建议数字枚举
看个例子，后端接口返回的内容如下：
const response = {
    data: {
        // 后端返回 'EAST 那你就没得选了
        direction: 'EAST'，
    }
}
*/
// 如何选择普通枚举和常量枚举？
/*
优先选择常量枚举，因为会减少编译出的无用代码，提高执行效率
*/
