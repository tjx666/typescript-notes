/**
 * Class 类
 * ES6 以前 Javascript 的 OO 是基于原型的
 * ES6 引入了 CLass，使得从别的语言迁移到 Javascript 的程序员更容易编写 OO 的代码
 * Class 本质上就是构造器的语法糖，JS 中的一切函数都可以看做是构造器，只要你用 new 调用它即可
 * JS 中处理 null 以外所有对象默认都有一个不可枚举属性 __proto__，表示其原型，
 * 当然你可以可以构造一个没有原型的对象：Object.create(null, { name: 'ly' })
 * JS 任何一个函数都有一个属性 prototype，即原型，会在 new 一个构造器的时候将构造的对象的原型指向它
 * Class 可以认为就是构造器，定义在 Class 中的实例方法默认是不可枚举的，而且都定义在构造器的原型上
 */
 export default undefined;
 
// ------------------------ gettingStarted -----------------------------
// 看一个简单的 🌰，假设我们需要使用 Canvas 去画很多的点，我们可以抽象一个 Point 类
// 基于 class 的 OOP (object oriented programming)
// 面向对象的两大精髓：封装和继承。封装达到高内聚低耦合，继承衍生出多态的设计思想
class Point {
    // 抽象属性：坐标 x 和 y
    x: number;
    // private 权限修饰符，加强封装
    private y: number;
    public color?: string;

    //构造器
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        console.log('create a point');
    }

    // 抽象行为：draw
    draw() {
        // 使用 this 来访问实例的属性
        console.log(`draw a point which coordinate is (${this.x}, ${this.y})`);
    }
}
// 使用 new 来构造一个 Point 实例，实际上
const point = new Point(0, 0);
point.draw();
console.log('color' in point); // => false
// 以上代码编译结果除掉注释为，可以看出其实就是利用 IIFE 定义了个构造器，实例方法都绑定到了 构造器原型上
//
/*
var Point = (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
        console.log('create a point');
    }

    Point.prototype.draw = function () {
        console.log("draw a point which coordinate is (" + this.x + ", " + this.y + ")");
    };
    return Point;
}());

var point = new Point(0, 0);
point.draw();
console.log('color' in point);
*/

// ------------------------ inheritance -----------------------------
// 继承, 继承提高了复用性
class People {
    name: string = 'default name';

    eat() {
        console.log('eat something...');
    }
}

class Teacher extends People {
    title?: string;
    teach() {
        console.log('teach students...');
    }
}

const teacher = new Teacher();
// 继承了父类上的属性和方法
console.log(teacher.name); // => default name

// 多态
// 子类重写了父类中的方法
class Animal {
    name: string;
    constructor(theName: string) {
        this.name = theName;
    }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 5) {
        console.log('Slithering...');
        super.move(distanceInMeters);
    }
}

class Horse extends Animal {
    constructor(name: string) {
        super(name);
    }
    move(distanceInMeters = 45) {
        console.log('Galloping...');
        super.move(distanceInMeters);
    }

    run() {
        console.log('running...');
    }
}

let sam = new Snake('Sammy the Python');
let tom: Animal = new Horse('Tommy the Palomino');

sam.move(); // => Sammy the Python moved 5m.
// 此时 tom 虽然是 Animal 类型，但是值指向 Horse 类型，所以调用的是子类的 move
tom.move(34); // => Tommy the Palomino moved 34m.
// 此时 tom 被视为 Horse 类型
// Property 'run' does not exist on type 'Animal'
// tom.run();
// 使用类型断言来调用
(tom as Horse).run(); // running...

// ------------------------ 权限修饰符 -----------------------------
// ts 中只有 public, protected, private 三种权限修饰符
// 权限修饰符是一种封装手段，可以有效开闭属性
class Student {
    // 默认就是 public 的
    private id?: number;
    name?: string;
    public age?: number;
}

const student = new Student();
student.name;
// Property 'id' is private and only accessible within class 'Student'.
// student.id;

// private
// ts 是结构化的类型，我们说是要两个对象无论它们是如何构造的，只要成员相同，那么它们就是兼容的
// 但是在比较两个含有私有属性的对象时略有不同，相同的私有属性必须声明自同一处，换句话说，只有父子类的实例私有属性才有可能相同

class Base {
    // 之内在 Base 类内部访问 a
    private a = 123;

    go() {
        this.a;
    }
}

class Derived extends Base {
    play() {
        // Property 'a' is private and only accessible within class 'Base'
        // this.a;
    }
}

class SomeClass {
    private a = 666;
}

let base = new Base();
// Property 'a' is private and only accessible within class 'Base'
// base.a;
let derived = new Derived();
let some = new SomeClass();
base = derived;
// base.a 和 some.a 不是相同性质的, protected 也一样
// base = some; // => ypes have separate declarations of a private property 'a'

// protected
// protected 和其它强类型语言一样，只允许其子类访问
class A {
    protected a: number = 666;
}

class B extends A {
    play() {
        this.a;
    }
}

// 构造器也可以是 private 和 protected 的
// 简单实现一个单例模式
class C {
    static singleInstanceC: C | null = null;
    // 可以通过工厂方法返回
    static buildCFactory(): C {
        if (C.singleInstanceC) {
            return C.singleInstanceC as C;
        } else {
            C.singleInstanceC = new C();
            return C.singleInstanceC as C;
        }
    }

    // private 修饰构造器外界就不能构造 C 的实例了
    private constructor() {}
}

// Constructor of class 'C' is private and only accessible within the class declaration
// const c = new C();
const c: C = C.buildCFactory();

class Fruit {
    protected constructor() {}
}

class Apple extends Fruit {
    constructor() {
        // 不能直接构造，但是可以用于继承
        super();
    }
}

// const fruit = new Fruit(); // => Constructor of class 'Fruit' is protected and only accessible within the class declaratio

// ------------------------ readonly property -----------------------------
class Octopus {
    // readonly 有点像 Java 的 final
    // readonly 声明的变量只能在声明语句或者构造器中被初始化
    readonly name: string;
    readonly numberOfLegs: number = 8;

    constructor(theName: string) {
        this.name = theName;
    }
}

let dad = new Octopus('Man with the 8 strong legs');
// Cannot assign to 'name' because it is a read-only property
// dad.name = 'Man with the 3-piece suit'; // error! name is readonly

// ------------------------ parameter property -----------------------------
// 参数属性
// 将参数的声明和使用构造器参数初始化结合在一起
// 语言一直在进步，这功能非常实用，java 就一直没支持...
class User {
    // 在构造器参数前使用权限修饰符或者 readonly 就可以声明一个参数属性
    constructor(private id: number, public name: string, readonly age: number) {}
}
const user = new User(1, 'ly', 21);
console.log(Object.keys(user)); // => [ 'id', 'name', 'age' ]

// ------------------------ accessor -----------------------------
// 访问器或者说存取器
// 很多高级语言都有这一特性，使用存取器可以让我们拦截对对象的存取操作
// 存取器有两点需要注意一下
// 1. ts 中如果想要使用存取器必须将编译级别设置为 es5 或者更高，es3 不支持
// 2. 如果只声明了 getter 没有设置 setter， ts 将会认为你在声明一个 readonly 属性
(function() {
    const fullNameMaxLength = 10;

    class Employee {
        private _fullName?: string;

        // 编译目标设置为 es3 将会报下面的错误
        // Accessors are only available when targeting ECMAScript 5 and higher
        get fullName(): string {
            return this._fullName as string;
        }

        set fullName(newName: string) {
            if (newName && newName.length > fullNameMaxLength) {
                throw new Error('fullName has a max length of ' + fullNameMaxLength);
            }

            this._fullName = newName;
        }
    }

    let employee = new Employee();
    employee.fullName = 'Bob Smith';
    if (employee.fullName) {
        console.log(employee.fullName);
    }
})();

class D {
    private _state = { showModal: false };

    get state() {
        return this._state;
    }
}

const d = new D();
console.log(d.state);
console.log(Object.keys(d)); // => ['_state']
// d.state = { showModal: true }; // => Cannot assign to 'state' because it is a read-only property


// ------------------------ static property -----------------------------
// 静态属性是类的静态成员，是定义在类本身的，我们可以通过类名加 . 来访问
// 有些时候一个和类相关的属性我们只需要定义一份即可，可以使用 static 定义成静态属性
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        // 这里通过 Grid. 来访问 static 属性
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));

// ------------------------ abstract class -----------------------------
// 抽象类是可能被其它类继承的基类
// 对比普通类：抽象类不能被实例化，只能被继承
// 对比接口：抽象类可以拥有被实现的成员
// 什么时候使用抽象类呢？当你发现你有抽象方法的时候，没必要一开始就过度设计哪些类该是抽象类

abstract class Department {

    constructor(public name: string) {
    }

    printName(): void {
        console.log("Department name: " + this.name);
    }

    abstract printMeeting(): void; // must be implemented in derived classes
}

class AccountingDepartment extends Department {

    constructor() {
        super("Accounting and Auditing"); // constructors in derived classes must call super()
    }

    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }

    generateReports(): void {
        console.log("Generating accounting reports...");
    }
}

let department: Department; // ok to create a reference to an abstract type
// department = new Department(); // error: cannot create an instance of an abstract class
department = new AccountingDepartment(); // ok to create and assign a non-abstract subclass
department.printName();
department.printMeeting();
// 此时 department 是 Department 类型
// department.generateReports(); // error: method doesn't exist on declared abstract type

