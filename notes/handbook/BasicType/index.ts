/**
 * typescript 基本类型
 *
 * 本章主要了解下 typescript 中原生数据类型和一些特有的类型
 * 基本数据类型还是那么几个： boolean, number, string, null, undefined, symbol
 * 特有的挺多：Tuple, never, any, enum 等
 * 一些特殊情况需要人为指定类型时可以使用类型断言
 * 可以了解到 ts 中类型中非常丰富，实用和具有实际意义的
 * 实用比如：接口，枚举，元组
 * 实际意义：void, never
 */
export default undefined;

// ------------------------ boolean -----------------------------
const show: boolean = true;
// 基本类型转对象类型没问题
const display: Boolean = true;
// 对象类型转基本类型不行
//  const is:boolean = new Boolean(true);  // => Type 'Boolean' is not assignable to type 'boolean'

// ------------------------ number -----------------------------
// 可以使用 es6 的二进制 0b 和八进制 0o
const decimal: number = 666;
const decimalObj: Number = 999;
// 包装类型不会自动转基本类型
// const decimal1: number = new Number(1024);
// Type 'Number' is not assignable to type 'number'
// 'number' is a primitive, but 'Number' is a wrapper object. Prefer using 'number' when possible.
const hex = 0x10;
console.log(hex); // => 16
const binary = 0b10;
console.log(binary); // => 2
const octal = 0o10;
console.log(octal); // => 8
const nan: number = NaN;
const max: number = Infinity;
const min: number = Number.MIN_VALUE;
console.log(Infinity === Number.MAX_VALUE); // false
console.log(Infinity === Number.POSITIVE_INFINITY); // true

// ------------------------ string -----------------------------
// 和 js 没什么区别
const singleQuoteString: string = "我在学习 typescript";
const doubleQuoteString: string = "我在看 3.6 的英文文档";
const age = 21;
const es6TemplatesString = `I will be ${age + 1} years old next year`;

// ------------------------ Array -----------------------------
// 两种方式
// 第一种：像大多数静态类型语言一样使用 ElementType[] 表示数组类型，大多数情况应该使用这种
const forever: number[] = [1, 0, 2, 4];
// 第二种: 使用 Array<ElementType> 即 Array 类型搭配泛型
const letters: Array<string> = ["a", "b", new String("c").toString()];
// 可以越界访问，不像 java 会抛数组越界的异常
console.log(forever[100]); // => undefined

// ------------------------ Tuple -----------------------------
// 元组，和 python 中元组有点像，表示元素个数有限且类型可以不同的数组
/*
特点：
1. 可以说是一种特殊的数组
2. 元素的类型可以不同
3. 个数是有限的
用途：表示一组相关联的数据，想象一组 excel 中的数据： 
*/
const me: [string, number, boolean] = ["ly", 21, false];
// 不能越界访问，因为没意义
// console.log(me[3]); // => Tuple type '[string, number, boolean]' of length '3' has no element at index '3'.
// ts 元组的元素是允许修改的，这点和 gaython 不一样
me[0] = "lyreal666";
console.log(Array.isArray(me)); // => true;

// ------------------------ enum -----------------------------
// 枚举
// 声明方式和 java 类似，可以理解为就是一个只读对象
enum Weekday {
    Sunny,
    Monday,
    Tuesday,
    Wednesday,
    Friday,
    Saturday
}

// 没有枚举的时候，我们是使用数字数组或者字符串数组表示枚举，或者高级一点使用对象，
const Status = {
    PENDING: Symbol("pending"),
    FULFILLED: Symbol("fulfilled"),
    REJECTED: Symbol("rejected")
};
// 枚举每一个元素都是有值得，默认第一个元素为0，往后递增1
console.log(Weekday.Monday); // 1
console.log(typeof Weekday); // => Object
const day = Weekday.Tuesday;
console.log(typeof day); // number

// 完全可以手动修改每个枚举值
enum Color {
    Red = 2,
    Green = 4,
    Blue
}
let c: Color = Color.Blue;
// 还是只加1
console.log(c); // 5
// 如果想知道某个枚举值的含义是什么，可以通过索引操作符访问
console.log(Color[4]); // 'Green
// 特点1：有限性，不能访问不存在的枚举值
// Color.Opacity; // => Property 'Opacity' does not exist on type 'typeof Color'.
// 特点2：不可改，枚举值都是 readonly 的
// Color.Green = 6; // => Cannot assign to 'Green' because it is a read-only property.

// 枚举值还可以是字符串
enum PromiseStatus {
    PENDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
}

// 枚举值允许重复
enum LoadingStatus {
    INITIAL = 0,
    LOADING = 0,
    SUCCESS = 1,
    ERROR = -1
}

// ------------------------ any -----------------------------
// 万恶之源，尽量少用，不要把 typescript 用成 anyScript
// 使用场景一： 当你不造一个变量是什么类型的时候，比如引用第三方库，而这个库没有类型声明
let notSure: any = 1;
notSure = "...";
// 使用场景二：当你只知道部分类型的时候
const anyArray: any[] = [1, "b"];

// any 和 Object 有啥区别？
let obj: Object = new Date();
// Object.anyProp; // => Property 'anyProp' does not exist on type 'ObjectConstructor'.
// notSure.anyMethod(); // => 编译通过，但是运行出错，
// 区别：Object 类型只能访问 Object d的属性， any 就 any 了

// any 是会蔓延的
const anyProp = notSure.anyProp; // anyProp 也是 any 类型

// ------------------------ void -----------------------------
// 空值
// 空值好像刚好和 any 类型相反，通常作为函数的返回值类型
function voidFunc(): void {
    // ..bundleRenderer.renderToStream
}

console.log(typeof voidFunc()); // undefined

// 声明一个 void 类型的变量通常是没有任何用的，只有 null 和 undefined 可以赋值给 void 类型
let voidVar: void = undefined;
// 开启了 strictNullChecks 选项 null 就不能赋值给 void 类型变量了
// voidVar = null; // => Type 'null' is not assignable to type 'void'.

// ------------------------ undefined/null -----------------------------
// 默认情况 undefined/null 是任何类型的子类，开启了 strictNullChecks 就不行了，只能赋值给对应的类型和 any 类型，但是 undefined 还是可以赋值给 void 类型
let date: Date;
// 必须先初始化才能使用，如果能够使用不就等于赋值给了 null
// console.log(date) // => // Variable 'date' is used before being assigned

// ------------------------ never -----------------------------
// never 类型，这个类型表示这个变量永远不会获得值，例如箭头函数中会抛异常，以及函数陷入死循环不会反悔值得情况
function error(message: string): never {
    throw new Error(message);
}

// Inferred return type is never
function fail() {
    return error("Something failed");
}

// Function returning never must have unreachable end point
function infiniteLoop(): never {
    while (true) {}
}

function checkNumber(x: string | number): boolean {
    if (typeof x === "number") {
        return true;
    } else if (typeof x === "string") {
        return false;
    }

    return error("Failure");
}

// ------------------------ object -----------------------------
// object 不是 Object，object 表示一个变量不是基本类型： number, string, boolean, symbol, null, or undefined.
function create(object: object | null): void {
    return Object.create(object);
}

create({ prop: 0 }); // OK
create(null); // OK

// create(42); // Error
// create("string"); // Error
// create(false); // Error
// create(undefined); // Error

// 下面两个都可以成功赋值，因为都不是基本类型
const myself: Object = { name: "ly" };
const someObj: object = new Object(); // obj' refers to a value, but is being used as a type here.

// ------------------------ type assert -----------------------------
// 类型断言，又叫类型转换，当你确定一个变量是某个类型时，可以将该变断言为某个类型
let someValue: any = "this is a string";
// 形式一：可以看出类型转换符优先级不如引用操作符
let strLength: number = (<string>someValue).length;
// 形式二：使用 as 关键字，在 tsx 中只能使用 as，因为
let substr = (someValue as string).substr(0);

// 再举一个🌰
function typeAssertExample(arg: number | string) {
    if (typeof arg === "number") {
        (arg as number).toFixed();
    }
}
