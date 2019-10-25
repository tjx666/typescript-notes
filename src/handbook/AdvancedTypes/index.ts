/**
 * 高级类型
 */

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
