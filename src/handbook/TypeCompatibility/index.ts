/**
 * 类型兼容论
 */
export default undefined;

// ------------------------ 结构类型兼容  -----------------------------
// typescript 的类型系统是结构化的类型系统，也叫鸭子类型 duck type
// 结构化类型系统的基本规则是，如果x要兼容y，那么y至少具有与x相同的属性
class A {
    name = 'lyreal666';
}

class B {
    name = 'YuTengjing';
}

// 因为 B 中的实例部分成员和 A 是一样的，所以 B 是可以赋值给 A 类型的变量
const a: A = new B();

class C {
    a: A = new A();
}

const tempC = { a: { name: 'ly' }, extraB: null };

// tsc 会将目标对象中的属性一样检查是否包含源对象，这个比较过程是递归进行的，检查每个成员及子成员
const c: C = tempC;

// ------------------------ 函数比较 -----------------------------
// 函数兼容性比较考虑两方面，参数和返回值
// 比较参数时，源函数的参数个数允许比目标参数个数少

let forEachCallback: (value: number, index: number, self: number[]) => void;
// 考虑一下为什么编译器会允许两种类型上并不等价的函数相互赋值
/**
 * 我们知道子类型可以赋值给父类型是因为赋值后并不会产生任何不稳定的影响，即你在子类型变量上访问父类型的属性都能访问的到，行为就和父类型一样。
 * 同样的 X 函数类型的变量你传给他 Y 类型的函数，参数个数少于 X 类型，会对程序的稳定性造成印象吗，并不会，你调用 X 类型的函数时是会多传给 Y 类型函数参数的，
 * 但是 Y 类型的参数个数之所以没有定义的和 X 一样多是因为压根不需要那些参数，就像这里举的 forEach 回调的例子，正真调用这个回调的时候你多传的参数其实会被忽略但是功能和返回值没有影响
 * 所以目标函数的参数个数没必要和源函数一致的
 */
forEachCallback = (value: number) => console.log(value);

// 比较函数返回值，那就是纯粹的赋值兼容性一样没啥区别
let x = () => ({ name: 'Alice' });
let y = () => ({ name: 'Alice', location: 'Seattle' });

x = y; // OK
// y = x; // Type '() => { name: string; }' is not assignable to type '() => { name: string; location: string; }'

// ------------------------ 枚举类型和数字类型 -----------------------------
// 枚举类型和数字类型相互兼容
const enum Direction {
    EAST,
    SOUTH,
    WEST,
    NORTH,
}

const direction: number = Direction.NORTH;
const east: Direction = 0;
const west: Direction.WEST = 2;

const enum Align {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

// 不同枚举之间是不兼容的
// const align: Align = Direction.NORTH;  //=>Type 'Direction.NORTH' is not assignable to type 'Align'

// ------------------------ 类的兼容性 -----------------------------
// 类也是结构化类型，两个类的实例在比较的时候
// 1. 只比较实例部分，换句话说就是构造器和静态属性不比较
// 2. private 和 protected 属性只有当声明自同一个地方类时才视为相同

class D {
    private age = 21;
}

class E {
    private age = 21;
}

// const d: D = new E(); //Type 'E' is not assignable to type 'D'. Types have separate declarations of a private property 'age'

// ------------------------ 类型兼容性和泛型 -----------------------------
// 只有当泛型作为类型的一部分时才会影响兼容性
interface F<T> {}
const f1: F<number> = {};
const f2: F<string> = f1;

interface G<T> {
    prop: T;
}

const g1: G<number> = { prop: 123 };
// const g2: G<string> = g1; // Type 'G<number>' is not assignable to type 'G<string>'. Type 'number' is not assignable to type 'string'
