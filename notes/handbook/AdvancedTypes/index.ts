/**
 * 高级类型
 */
 export default undefined;

// ------------------------ Intersection Types -----------------------------
// 交叉类型 A & B
// 实现一个简单的 mixin 模式
function extend<First extends Object, Second extends Object>(first: First, second: Second): First & Second {
    // Partial<T> 返回一个将 T 类型中所以属性变为可选属性的类型
    const result: Partial<First & Second> = {};
    for (const prop in first) {
        if (first.hasOwnProperty(prop)) {
            ((result as unknown) as First)[prop] = first[prop];
        }
    }
    for (const prop in second) {
        if (second.hasOwnProperty(prop)) {
            ((result as unknown) as Second)[prop] = second[prop];
        }
    }
    return (result as unknown) as First & Second;
}

class Person {
    constructor(public name: string) {}
}

interface Loggable {
    log(name: string): void;
}

class ConsoleLogger implements Loggable {
    log(name: string) {
        console.log(`Hello, I'm ${name}.`);
    }
}

const jim = extend(new Person('Jim'), ConsoleLogger.prototype);
// jim.log(jim.name); // jim.log is not a function
// handbook 这个例子是有问题的

const mixinObj = extend({ name: 'ly' }, { age: 21 });
console.log(`${mixinObj.name} is ${mixinObj.age} years old this year`); // => ly is 21 years old this

// ------------------------ union type -----------------------------
// 联合类型 A | B
// 表示类型是 A, B 之一
// 下面是一个字符串填充工具函数，除了 union type 也可以用函数重载，显然使用联合类型更省事
function padLeft(value: string, padding: string | number) {
    // 如果 padding 是数字，就在左边填充 padding 个空格
    if (typeof padding === 'number') {
        return Array(padding + 1).join(' ') + value;
    }

    // 是字符串就直接拼接就好
    if (typeof padding === 'string') {
        return padding + value;
    }

    throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft('Hello world', 4); // returns "    Hello world"

// 联合类型默认只能访问联合元素的公共属性
interface Bird {
    fly(): void;
    layEggs(): void;
}

interface Fish {
    swim(): void;
    layEggs(): void;
}

const unionObj: Bird | Fish = { swim() {}, layEggs() {} };
unionObj.layEggs(); // ok
// unionObj.fly(); // property 'fly' does not exist on type 'Fish'

// ------------------------ Type Guards and Differentiating Types -----------------------------
// 类型守卫和区分类型

// 联合类型只能访问公共成员，那么如果我们确切的知道一个变量是 Fish 类型，并且要访问 Fish 类独有的属性咋办
// 首先想到的是使用类型断言
(unionObj as Fish).swim();

// A type guard is some expression that performs a runtime check that guarantees the type in some scope

// 方式一：使用类型谓词
// pet is Fish 就是类型谓词
function isFish(pet: Bird | Fish): pet is Fish {
    // 检查类型其实用的是运行时语句
    return (pet as Fish).swim !== undefined;
}

function typePredicates1(pet: Bird | Fish) {
    if (isFish(pet)) {
        // 不需要强转了
        pet.swim();
    } else {
        // 另一个分支 uniObj 的类型也被 tsc 推断出来了
        pet.layEggs();
    }
}

// 第一种方式比较复杂，但是可读性比较好
// 第二种：in 操作符也会触发类型守卫
function typePredicates2(pet: Bird | Fish) {
    // 表达式为 true 分支会被推断成包含 swim 可选或必选属性的的类型
    if ('swim' in pet) {
        pet.swim();
        // 为 假的分支被推断为包含 swim 可选属性的类型或者不包含 swim 属性的类型
    } else {
        pet.layEggs();
    }
}

// 第三种：typeof
// 需要注意的时 typescript 使用 typeof v === typename 或者 typeof v !== typename 方式来触发类型守卫时
// 只支持 typename 为 "number", "string", "boolean", or "symbol"
// 其它类型当然可以用来判断，但是不会触发类型守卫
// 例子就不写了，就前面那个 padLeft 就是

// 第四种：instanceof
interface Padder {
    getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
    constructor(private numSpaces: number) {}
    getPaddingString() {
        return Array(this.numSpaces + 1).join(' ');
    }
}

class StringPadder implements Padder {
    constructor(private value: string) {}
    getPaddingString() {
        return this.value;
    }
}

function getRandomPadder() {
    return Math.random() < 0.5 ? new SpaceRepeatingPadder(4) : new StringPadder('  ');
}

// Type is 'SpaceRepeatingPadder | StringPadder'
let padder: Padder = getRandomPadder();

if (padder instanceof SpaceRepeatingPadder) {
    padder; // type narrowed to 'SpaceRepeatingPadder'
}
if (padder instanceof StringPadder) {
    padder; // type narrowed to 'StringPadder'
}

// ------------------------ nullable type -----------------------------
// 可以为 null 的类型

// 在 --strictNullChecks 为 false 的情况下，null 和 undefined 类型是可以赋值给任何类型变量的， 当然除了 never
// let n: number = null; // Type 'null' is not assignable to type 'number'
// let u: string = undefined;
// let nev: never = null;

// 既然用了 ts，我们就应该尽量利用类型系统的的好处，把类型搞得越严格越好
// 如果一个变量需要同时可以赋值为 null，可以使用联合类型
let sn: string | null = null;
sn = 'ly';
// 在 javascript 中 null 和 undefined 就不等价
// sn = undefined; // Type 'null' is not assignable to type 'number'

// 可选参数和可选属性
// 对于可选参数 y tsc 会自动添加 undefined 类型即 y: number | undefined
const pow = (x: number, y?: number) => {
    return Math.pow(x, y || 2);
};
// 再次申明一边：null 和 undefined 不可以相互赋值
pow(2, undefined);
// pow(3, null); // Argument of type 'null' is not assignable to parameter of type 'number | undefined'

// 可选属性
interface OptionalProperty {
    // 实际上是： OptionalProperty.name?: string | undefined
    name?: string;
}

// class 实例成员如果没有使用 undefined 联合类型，必须在声明时初始化或者构造器初始化，还可以使用参数属性
// 总之还是就一句话，null 类型和 undefined 不能赋值给任意类型了，会严格检查
class TestNullable {
    public legsCount = 2; // 声明时初始化
    public name: string;
    // private gf: boolean; // 假设不初始化那不是就是 undefined 了？ 但是 boolean 和 undefined 类型时不兼容的

    constructor(public age: number) {
        this.name = 'man';
    }
}

// null 类型守卫
function f(sn: string | null): string {
    // 和 js 一样直接用等号判断即可
    if (sn === null) {
        return 'default';
    } else {
        return sn;
    }
}

// 消除 null，使用 ||，其实这里也算触发了类型守卫
function f1(sn: string | null): string {
    return sn || 'default';
}

// 内嵌的函数有无
function broken(name: string | null): string {
    function postfix(epithet: string) {
        // 内嵌的函数中 name 的 null 不会被消除，因为 postfix 鬼知道啥时候执行
        // return name.charAt(0) + '.  the ' + epithet; // error, 'name' is possibly null
    }
    name = name || 'Bob';
    // return postfix('great');
    return '';
}

function fixed(name: string | null): string {
    function postfix(epithet: string) {
        // 如果你确定 name 不会是 null, 可以使用类型断言操作符，即变量名后面加个 !，将移除变量的 null 和 undefined 类型
        return name!.charAt(0) + '.  the ' + epithet; // ok
    }
    name = name || 'Bob';
    return postfix('great');
}

// ------------------------ type alias -----------------------------
// 类型别名，面试的时候经常会被问到说 type 和 interface 有什么区别
// 本质上的区别就是 type 只是给已有的类型取了一个别名，而 interface 是新建了一个类型
// 类型别名在错误信息中是不会出现的，而接口名会


// ------------------------ 索引类型 -----------------------------
// 不是可索引类型
// 索引类型指的是是值是一个对象的索引组成的字符串字面量枚举类型
// 看个简单的例子
type IndexesType = keyof { name: 'ly '; age: 21 };
// IndexesType 其实就是 "name" | "age" 类型
const a: IndexesType = 'name'; 

// keyof 叫 索引类型查询操作符（index type query）
// 前面的例子可以看出对一个普通对象使用 keyof 返回的就是对象索引字符串字面量的联合类型
// 索引类型查询其实就是返回索引的类型嘛，再看一个例子
interface MyArray<T> {
    [index: number]: T;
}
// MyArrayIndexType 其实就是 number 类型
type MyArrayIndexType = keyof MyArray<number>;

// 还有一个操作符叫做 
