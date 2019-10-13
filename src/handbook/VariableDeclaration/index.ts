/**
 * 变量声明
 * 
 * 本章主要了解下typescript 中变量声明的几种方式：bar, let, const，以及解构赋值，扩展运算符的应用
 * 以及它们在函数参数中的使用
 * 
 * 大多数内容其实 ES6 都支持了，并非 ts 独有
 */

// ------------------------ var -----------------------------
// var 是函数作用域
function sumMatrix(matrix: number[][]) {
    var sum = 0;
    for (var i = 0; i < matrix.length; i++) {
        var currentRow = matrix[i];
        // 内层循环这个 i 指向同一函数作用域中的外层循环的那个 i，同一作用域的变量居然允许重复声明
        for (var i = 0; i < currentRow.length; i++) {
            sum += currentRow[i];
        }
    }

    return sum;
}
// 两个 for 循环中的 i 指向sumMatrix 这个函数作用域中的同一个 i，外层循环只运行了一次，因为内层循环完 i 就等于 3 了
const sum = sumMatrix([[1, 2, 3], [4, 5, 6]]);
console.log(sum); // => 6

// 5 个函数绑定的是同一个全局作用域中的 i
for (var i = 0; i < 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 100 * i);
}
// =>
// 5
// 5
// 5
// 5
// 5

/*
// 使用 IIFE （immediately invoke function expression）立即执行函数表达式，将变量在循环的时候立即消耗掉
for (var i = 0; i < 10; i++) {
    // capture the current state of 'i'
    // by invoking a function with its current value
    (function(i) {
        setTimeout(function() { console.log(i); }, 100 * i);
    })(i);
}
*/

// ------------------------ let -----------------------------
// let 声明的变量处在块级作用域
{
    let blockScopeVariable = 6666;
}
// console.log(blockScopeVariable); // => Cannot find name 'blockScopeVariable'.

// 暂时性死区，typescript 在编译的时候就能给出错误提示，如果是 javascript 得等到调用它的时候才知道
function testTemporalDeadZone() {
    // a++; // => Block-scoped variable 'a' used before its declaration
    let a;
}

// try/catch 的 catch 块也是块级作用域
try {
    throw 'oh no!';
} catch (e) {
    console.log('Oh well.');
}

// 一个特殊情况允许在函数中调用还未声明的变量，仅限于编译的 target 在 ES2015
function foo() {
    // okay to capture 'a'
    return a;
}

// illegal call 'foo' before 'a' is declared
// runtimes should throw an error here
// foo();

let a = 6;

// let 不允许重复声明
let kkk = 1024;
// let kkk = 520; // => Cannot redeclare block-scoped variable 'kkk'

// let 声明的变量在 for 循环中每次循环的时候 js 解释器会记住上一次循环的值，并重新声明一个变量
for (let i = 1; i <= 5; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000 * i);
}
// =>
// 1
// 2
// 3
// 4
// 5

// ------------------------ const -----------------------------
// 作用域和 let 是差不多的，但是不能改变变量的指向，但是变量指向的对象状态是可变的，是 mutable 的
const PORT = 8000;
// PORT = 9999; // => annot assign to 'PORT' because it is a constant.
const me = {
    name: 'lyreal666',
    age: 22,
};

me.name = 'lyreal666'; // all okay
// 想要声明一个 immutable 的变量可以使用 readonly 关键字
class Student {
    readonly name?: string;
}

// new Student().name = 'ly'; // => Cannot assign to 'name' because it is a read-only property

// ------------------------ Array destructuring -----------------------------
// 数组解构
const input = [1, 2];
let [first, second] = input;

// 最简单的 swap
[first, second] = [second, first];

// 函数参数使用解构赋值
function f([first, second]: [number, number]) {
    console.log(first);
    console.log(second);
}
// [1, 2] 默认推导出的类型是 number[] 不是 [number, number]
// const arg = [1, 2]; // => Argument of type 'number[]' is not assignable to parameter of type '[number, number]'
const arg: [number, number] = [1, 2];
f(arg);

// 可以使用扩展运算符获取解构剩余的元素
const [firstEle, ...rest] = [1, 2, 3, 4];
console.log(rest); // => [ 2, 3, 4 ]

// 解构时不需要的元素可以直接跳过
const [, , third, , fifth] = [1, 2, 3, 4, 5, 6];
console.log({ third, fifth }); // => { third: 3, fifth: 5 }

// ------------------------ Tuple destructuring -----------------------------
// 元组解构
const item: [string, number, boolean] = ['ly', 22, false];
// 有类型推到还是很方便的，不需要声明类型
const [nickname, age, single] = item;
// 不要越界
// const [nickname, age, single, notExists] = item; // => Tuple type '[string, number, boolean]' of length '3' has no element at index '3'.

// 使用扩展运算符获取剩余元素
const [...infos] = item; // infos 类型为 [string, number, boolean]

// 不需要的元素可以像上面数组那样直接跳过

// ------------------------ Object destructuring -----------------------------
// 对象解构
const obj = {
    b: 'bb',
    c: 'c',
    d: 'ddd',
};
// 不需要的属性可以直接跳过，比如这里的 b，使用冒号重命名
let { d, c } = obj;

// 类似于数组解构一样，解构赋值不一定要同时声明新变量
// !: 这里注意使用括号包起来，因为 { javascript 引擎在解析的时候回将其解析为语句块的开始
({ c, d } = obj);

// 对象也可以使用扩展运算符号获取剩余的属性
const { ...restProps } = { x: 1, y: 2, z: 3 };
console.log(restProps); // => { x: 1, y: 2, z: 3 }

// 属性重命名，在解构变量名后面使用 :，
// { o: newName } 可以读作 o as newName
// 下面的等同于 const newName = { o: 0 }.o。
const { o: newName1 } = { o: 0 };

// 如果要声明类型怎么办，解构赋值不能再解构语句里面直接使用冒号声明类型，那是重命名的
// 需要像下面这样在整个解构语句后面声明
const { q: newName2 }: { q: string } = { q: 'QQ' };

// 默认值语法
function keepWholeObject(wholeObject: { a: string; b?: number }) {
    // 解构的时候使用等号跟着默认值，当解构对象该属性为 undefined 时，b 就会使用默认值
    let { a, b = 1001 } = wholeObject;
}

// ------------------------ 函数声明 -----------------------------
// 函数声明

type C = { a: string; b?: number };
// 简单的解构示例，不声明 C 类型的话。a, b 会被推断成 any
function func1({ a, b }: C): void {
    // ...
}

// 不提供类型你也要能让编译器能够推断的出 a, b 的类型，
function func2({ a = 1, b = 2 } = {}): void {}
function func3({ a = 1, b } = { b: 3 }): void {}

// ------------------------ spread -----------------------------
// 扩展运算
let someObj = {
    a: 1,
    b: 2,
};

// 鸭子类型
let clonedObj = { ...someObj };
// clonedObj = { ...someObj, c: 3 }; // => Type '{ c: number; a: number; b: number; }' is not assignable to type '{ a: number; b: number; }'

// 属性覆盖，
someObj = { ...someObj, a: 8 };
console.log(someObj); // => { a: 8, b: 2 }

// 浅拷贝
const deepObj = {
    level1: {
        level2: {
            a: 1,
        },
    },
};

const shadowCopyDeepObj = { ...deepObj };
console.log(deepObj.level1 === shadowCopyDeepObj.level1); // => true
