/**
 * generic 泛型
 * 泛型不是范型，范型指的是 OOP，FP等编程范式
 * 泛型其实就是类型变量来给我们的函数，类型添加类型约束
 * 声明一个泛型一般都是在标识符后面使用尖括号列出泛型变量
 * ! 使用泛型声明的变量，只有编译器编译到使用泛型声明的类型时才能确定类型，说白了，泛型还是编译期间的语法，和运行期无关
 *
 * 总结下泛型的好处：让你使用任意类型的同时还有类型约束
 */
export default undefined;

// ------------------------ generic function -----------------------------
// 下面的函数使用泛型变量 T 声明了一个泛型变量，约束了参数类型和返回值类型必须一致
const identity = <T>(arg: T): T => {
    return arg;
};

// 泛型非常的灵活，我们可以将泛型变量当做一个普通类型，普通类型可以怎么用，泛型变量就可以怎么用
// 下面就是把泛型声明为类型的一部份
const loggingIdentity = <T>(arg: Array<T>): Array<T> => {
    console.log(arg.length);
    return arg;
};

// 下面的交换函数演示了使用多个泛型变量，并且使用泛型声明了元组
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]

// 这里只是为了演示下怎样声明一个泛型函数的类型声明，一般情况下我们都不会去声明函数类型，可读性很差
// 其实我们这里声明了一个函数类型，这个函数类型使用了泛型，也就是说我们声明了个泛型类型
const getTuple: <T, U>(x: T, y: U) => [T, U] = <T, U>(x: T, y: U): [T, U] => {
    return [x, y];
};

// ------------------------ generic interface -----------------------------
// 泛型接口
// 我们可以使用接口来表示一个函数，本质上函数也是对象，只不过函数对象可以使用调用符调用而已
interface Plus {
    // 声明函数的调用签名
    (op1: number, op2: number): number;
}

// 声明下上面 getTuple 函数的接口形式
interface IGetTuple {
    <T, U>(x: T, y: U): [T, U];
}

// 进一步我们可以吧泛型变量声明提到接口名后面声明一个泛型接口
interface IGetTuple1<T, U> {
    (x: T, y: U): [T, U];
}

(function() {
    interface GenericIdentityFn<T> {
        (arg: T): T;
    }

    function identity<T>(arg: T): T {
        return arg;
    }

    /*
    给 GenericIdentityFn 指定类型后 number 泛型后，GenericIdentityFn 已经得到了其最终的类型是
    interface GenericIdentityFn{
        (arg: number): number;
    }
    */
    let myIdentity: GenericIdentityFn<number> = identity;
    // console.log(myIdentity('abc'));

    // 在对函数类型使用泛型时，把泛型直接放在调用签名和放在接口上有什么区别？
    // error: Type 'IGetTuple' is not generic
    // let _getTuple: IGetTuple<number, number>;
    // 结论是：泛型放接口你是在泛化函数类型，放接口里面的调用签名上你是在泛化它的调用签名，无法指定泛型类型
    // 严格来讲就像上面错误提示所说 IGetTuple 本省不是泛型类型
})();

// ------------------------ generic class -----------------------------
// 泛型类
// 泛型变量声明的位置都在标识符后面，class 也不例外
// 使用泛型来约束类中成员之间的类型关系
class MyIterator<T> {
    size: number = 0;
    index: number = -1;
    elements: T[] = [];

    // 泛型是约束类的实例部分，静态属性不能使用泛型，因为静态属性本就应该是确定的值
    // error: Static members cannot reference class type parameters
    // static MAX_SIZE: T;

    constructor(array: T[]) {
        this.elements = array;
    }

    next(): T {
        return this.elements[++this.index];
    }
}

const it = new MyIterator(['a', 'b', 'c']);
console.log(it.next()); // => 'a'

// ------------------------ generic constraint -----------------------------
// 泛型约束
// 泛型变量默认有可能是任意类型，因此你不能再泛型变量调用一个不确定是否有的属性
function readPropFromGenericVariable<T>(arg: T): T {
    // Property 'length' does not exist on type 'T'
    // console.log(arg.length);
    return arg;
}

// 可以使用 extends 关键字约束泛型的类型必须是被 extends 的类型或者子类
interface Lengthwise {
    length: number;
}

function loggingIdentity1<T extends Lengthwise>(arg: T): T {
    console.log(arg.length); // Now we know it has a .length property, so no more error
    return arg;
}

// error: Argument of type '3' is not assignable to parameter of type 'Lengthwise'
// loggingIdentity1(3);
loggingIdentity1({ length: 6, uselessArg: 'lala' });

class X {}

class XX extends X {}

function testGenericConstraint<T extends X>(arg: T): T {
    return arg;
}

// 传子类也 ok
testGenericConstraint(XX);

// ------------------------ Using Type Parameters in Generic Constraints -----------------------------
// 类型参数之间的泛型约束，比如你要约束一个类型参数必须是
// 下面这个泛型约束规定了 K 必须是 T 的 key
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}

let x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, 'a'); // okay
// getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'

// 看一个更简单的🌰
// 约束 K 类型兼容 T 类型
function genericConstraintINTypeParameter<T, K extends T>(
    arg1: T,
    arg2: K
): [T, K] {
    return [arg1, arg2];
}

// TODO: 关于工厂模式的应用等我学习完设计模式回过头再来看
