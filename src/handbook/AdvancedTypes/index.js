/**
 * 高级类型
 */
// ------------------------ Intersection Types -----------------------------
// 交叉类型 A & B
// 实现一个简单的 mixin 模式
function extend(first, second) {
    // Partial<T> 返回一个将 T 类型中所以属性变为可选属性的类型
    const result = {};
    for (const prop in first) {
        if (first.hasOwnProperty(prop)) {
            result[prop] = first[prop];
        }
    }
    for (const prop in second) {
        if (second.hasOwnProperty(prop)) {
            result[prop] = second[prop];
        }
    }
    return result;
}
class Person {
    constructor(name) {
        this.name = name;
    }
}
class ConsoleLogger {
    log(name) {
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
function padLeft(value, padding) {
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
const unionObj = { swim() { }, layEggs() { } };
unionObj.layEggs(); // ok
// unionObj.fly(); // property 'fly' does not exist on type 'Fish'
// ------------------------ Type Guards and Differentiating Types -----------------------------
// 类型守卫和区分类型
// 联合类型只能访问公共成员，那么如果我们确切的知道一个变量是 Fish 类型，并且要访问 Fish 类独有的属性咋办
// 首先想到的是使用类型断言
unionObj.swim();
// A type guard is some expression that performs a runtime check that guarantees the type in some scope
// 方式一：使用类型谓词
// pet is Fish 就是类型谓词
function isFish(pet) {
    // 检查类型其实用的是运行时语句
    return pet.swim !== undefined;
}
function typePredicates(pet) {
    if (isFish(pet)) {
        // 不需要强转了
        pet.swim();
    }
    else {
        // 另一个分支 uniObj 的类型也被 tsc 推断出来了
        pet.layEggs();
    }
}
