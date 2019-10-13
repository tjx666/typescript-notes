/**
 * interface 接口
 * TYpescript 的类型是鸭子类型或者说结构亚型，长得像就是同一个类型
 * 接口在使用 ts 编写代码时非常常用，我们可以使用接口给我们自己的代码或者第三方库编写类型声明
 * 很多时候我们并不需要使用 class 来描述一个类型，只需要简单描述一个对象有哪些属性，使用接口非常的方便快捷
 */

// ------------------------ gettingStarted -----------------------------
// 了解一个东西最简单的方式就是来看一个简单的例子
const drawCircle = ({ x, y, r }: { x: number; y: number; r: number }) => {
    console.log(`Draw a circle which index is x: ${x} y: ${y}, the radius: ${r}`);
};
const circleArgs = { x: 2, y: 2, r: 1, uselessArg: 0 };
drawCircle(circleArgs);
// 对象字面量更严格
// drawCircle({ x: 2, y: 2, r: 1, uselessArg: 0 })

// 使用接口来抽象
interface Point {
    x: number;
    y: number;
}

const drawPoint = ({ x, y }: Point) => {
    console.log(`Draw the point: (${x}, ${y})`);
};

// 和属性的顺序无关，只需要包含接口需要的属性即可
// Typescript 不像其它的带类型的语言接口需要去实现它再 new 出来，ts 中的接口是对对象形状的描述
const point = { y: 1, x: 1, r: 10 };
drawPoint(point);

// ------------------------ optional property -----------------------------
// 可选属性
// 思考：有些属性我们可能只是在某些情况下载会存在于接口对象中，我们该怎么办？
// 接口中直接不声明？反正多了属性又不报错，再 as any？ 不好，访问错了属性咋办？
// 可选属性的优点就是你在使用可选属性描述可能获得的属性的同时你访问错了属性名还能获得错误提示
interface SquareConfig {
    color?: string;
    width?: number;
}

function createSquare(config: SquareConfig): { color: string; area: number } {
    let newSquare = { color: 'white', area: 100 };
    // if (config.clor) {
    //     // Error: Property 'clor' does not exist on type 'SquareConfig'
    //     newSquare.color = config.clor;
    // }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({ color: 'black' });

// ------------------------ readonly -----------------------------
// 只读属性
interface ReadonlyPropObj {
    readonly prop: number;
}

const readonlyObj: ReadonlyPropObj = { prop: 123 };
// readonlyObj.prop = 777; // => Cannot assign to 'prop' because it is a read-only property

// ts 有一种移除了所以可变方法的数组接口： ReadonlyArray<T>
const immutableArr: ReadonlyArray<number> = [1, 2, 3];
// immutableArr.push(); // => Property 'push' does not exist on type 'readonly number[]'.
// 使用类型断言将 ReadonlyArray 数组变回普通数组
const array = <Array<number>>immutableArr;
array.push(4);
console.log({ array }); // { array: [ 1, 2, 3, 4 ] }

// ------------------------ Excess properties check -----------------------------
// 多余属性检查
const config = { width: 100, extraProp: 666 };
// 变量赋值的时候类型检查还是很宽松啊
createSquare(config);
// createSquare({ width: 100, extraProp: 666 }); // => Argument of type '{ width: number; extraProp: number; }' is not assignable to parameter of type
// error: Object literal may only specify known properties, but 'colour' does not exist in type 'SquareConfig'. Did you mean to write 'color'?
// let mySquare = createSquare({ colour: "red", width: 100 });

// 使用类型断言来解决这个类型检查
mySquare = createSquare({ width: 100, opacity: 0.5 } as SquareConfig);
// 也可以像前面一样使用变量来定义来避开额外属性检查

// ------------------------ interface describe function -----------------------------
// 使用接口来描述函数
interface SearchFunc {
    (sourceString: string, substring: string): boolean;
}

let search: SearchFunc;
// 类型自动推导
search = (source, sub) => {
    return source.includes(sub);
};

// ------------------------ indexable type -----------------------------
// 可索引类型，什么叫可索引类型，即用于任意数量相同索引类型和相同索引返回值类型的一类对象, 很像字典，Map
interface PointArray {
    [index: number]: Point;
}

const pArr = [{ x: 1, y: 1 }];

// ts 中索引类型有 string 和 number 两种类型，俩是可以共存的
// 但是由于 javascript 中索引其实只有字符串 arr = [1, 2, 3]。 我们可以 arr[1] 来访问元素，也可以 arr['1'] 来访问元素，
// 所以数字索引返回值类型必须和字符串索引返回值类型一致：数字索引返回值类型必须和字符串类型相同或者是子类型
class Animal {
    name?: string;
}
class Dog extends Animal {
    breed?: string;
}

interface NotOkay {
    // [x: number]: Animal; // => Numeric index type 'Animal' is not assignable to string index type 'Dog'
    [x: string]: Dog;
}

// 只要是属性咱就可以 readonly
interface ReadonlyStringArray {
    readonly [index: number]: string;
}
let myArray: ReadonlyStringArray = ['Alice', 'Bob'];
// myArray[2] = "Mallory"; // => Index signature in type 'ReadonlyStringArray' only permits reading

// ------------------------ class with interface -----------------------------
// 接口在其它语言如 java, C# 中一般用来约束子类比如实现哪些属性或者方法
interface People {
    name: string;
    // 方法属性，描述方式像定义一个方法一样，不过没有函数体
    run(): void;
}
class Employer implements People {
    constructor(public name: string) {}
    run(): void {}
}
// !: 由于 ts 中接口不能使用权限修饰符修饰，所以接口只能约束 class 实现哪些 public 方法

// ------------------------ implements -----------------------------
// ts 中 class 分两部分：实例部分，即实例上会存在的那部分属性，静态部分，即实例上不会存在的那部分属性如 constructor
// 在 ts implements 关键字表示 class 的实例部分应满足 interface 约束

// interface ClockConstructor {
//     // 声明了一个方法，构造方法，这个构造方法也是一个方法无法被直接实现
//     new (hour: number, minute: number): void;
// }

// // Type 'Clock' provides no match for the signature 'new (hour: number, minute: number): void'
// // 不能直接实现，直接实现就必须把上面的接口中的方法当成一个属性来看
// class Clock implements ClockConstructor {
//     currentTime?: Date;
//     constructor(h: number, m: number) {}
// }

interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick(): void;
}

// 使用函数参数来校验
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

/**
// 使用 class 表达式更简单
interface ClockConstructor {
  new (hour: number, minute: number);
}

interface ClockInterface {
  tick();
}

const Clock: ClockConstructor = class Clock implements ClockInterface {
  constructor(h: number, m: number) {}
  tick() {
      console.log("beep beep");
  }
}
 */

 // ------------------------ interface extends -----------------------------
 // 接口继承接口，效果上时子接口声明了父接口中的成员
 interface Shape {
    color: string;
}

interface Square extends Shape {
    sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;

// 接口可以多继承，使用逗号隔开多个父接口
interface PenStroke {
    penWidth: number;
}

// 接口可以重复声明
interface Square extends Shape, PenStroke {
    sideLength: number;
}

square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0

// ------------------------ repeat declaration -----------------------------
interface I {}
// const a: I = {}; // 接口类型会直接以最终声明的为准
interface I { a: number}
// 接口重复声明后面声明的会覆盖之前的
// const a: I  = {}; // => Property 'a' is missing in type '{}' but required in type 'I'

class B{}
// class B{}

// ------------------------ Hybrid -----------------------------
// 混合类型
// 函数就是混合类型，函数既是对象又可以被调用
interface Counter {
    (start: number): string;
    interval: number;
    reset(): void;
}

function getCounter(): Counter {
    let counter = (function (start: number) { }) as Counter;
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;


