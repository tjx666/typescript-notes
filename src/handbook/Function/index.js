/**
 * function 函数
 */
// ------------------------ getting started -----------------------------
// 从有没有名字的角度来说有两种
// 一：命名函数
function namedFunc(x) { }
// 二：匿名函数
const Anonymous = function () { };
// 从声明函数的角度来说分三种
// 一：直接使用 function 声明
function func() { }
// 二：function声明的表达式形式
const funcExp = function () { };
// 三：箭头函数表达式
const arrowFuncExp = () => { };
// 用哪种？一般情况应该选择箭头函数表达式
// ------------------------ 为函数添加类型 -----------------------------
const add = (operand1, operand2) => {
    return operand1 + operand2;
};
// 完整的函数类型
// 函数的类型只和两部分有关：参数类型和返回值类型
// 和参数中捕获的变量无关，那是函数的内部状态，描述一个函数我们只关心函数参数和返回值
const pow = (x, y = 2) => {
    return Array.from({ length: y }).reduce(product => product * x, 1);
};
console.log(pow(4)); // 16
// ------------------------ arguments -----------------------------
// 参数
// 可选参数
const buildName = (firstName, lastName) => {
    if (lastName) {
        return `${firstName} ${lastName}`;
    }
    else {
        return firstName;
    }
};
console.log(buildName('Yu', 'Tengjing')); // => Yu Tengjing
console.log(buildName('Luo')); // => Luo
// 带有默认值的参数
// 首先肯定是可选参数，因为可以省略，我们一般不需要指出带有默认值的参数的类型，因为类型一般可以从默认推断出来
const getDate = (millisecond = Date.now()) => {
    return new Date(millisecond);
};
console.log(getDate()); // 2019-10-15T15:32:05.766Z
// rest 参数
const log = (...parts) => {
    console.log(parts.join(', '));
};
log('Microsoft', 'Google', 'facebook'); // => Microsoft, Google, facebook
