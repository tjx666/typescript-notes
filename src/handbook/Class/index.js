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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// ------------------------ gettingStarted -----------------------------
// 看一个简单的 🌰，假设我们需要使用 Canvas 去画很多的点，我们可以抽象一个 Point 类
// 基于 class 的 OOP (object oriented programming)
// 面向对象的两大精髓：封装和继承。封装达到高内聚低耦合，继承衍生出多态的设计思想
var Point = /** @class */ (function () {
    //构造器
    function Point(x, y) {
        this.x = x;
        this.y = y;
        console.log('create a point');
    }
    // 抽象行为：draw
    Point.prototype.draw = function () {
        // 使用 this 来访问实例的属性
        console.log("draw a point which coordinate is (" + this.x + ", " + this.y + ")");
    };
    return Point;
}());
// 使用 new 来构造一个 Point 实例，实际上
var point = new Point(0, 0);
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
var People = /** @class */ (function () {
    function People() {
        this.name = 'default name';
    }
    People.prototype.eat = function () {
        console.log('eat something...');
    };
    return People;
}());
var Teacher = /** @class */ (function (_super) {
    __extends(Teacher, _super);
    function Teacher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Teacher.prototype.teach = function () {
        console.log('teach students...');
    };
    return Teacher;
}(People));
var teacher = new Teacher();
// 继承了父类上的属性和方法
console.log(teacher.name); // => default name
// 多态
// 子类重写了父类中的方法
var Animal = /** @class */ (function () {
    function Animal(theName) {
        this.name = theName;
    }
    Animal.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 0; }
        console.log(this.name + " moved " + distanceInMeters + "m.");
    };
    return Animal;
}());
var Snake = /** @class */ (function (_super) {
    __extends(Snake, _super);
    function Snake(name) {
        return _super.call(this, name) || this;
    }
    Snake.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 5; }
        console.log('Slithering...');
        _super.prototype.move.call(this, distanceInMeters);
    };
    return Snake;
}(Animal));
var Horse = /** @class */ (function (_super) {
    __extends(Horse, _super);
    function Horse(name) {
        return _super.call(this, name) || this;
    }
    Horse.prototype.move = function (distanceInMeters) {
        if (distanceInMeters === void 0) { distanceInMeters = 45; }
        console.log('Galloping...');
        _super.prototype.move.call(this, distanceInMeters);
    };
    Horse.prototype.run = function () {
        console.log('running...');
    };
    return Horse;
}(Animal));
var sam = new Snake('Sammy the Python');
var tom = new Horse('Tommy the Palomino');
sam.move(); // => Sammy the Python moved 5m.
// 此时 tom 虽然是 Animal 类型，但是值指向 Horse 类型，所以调用的是子类的 move
tom.move(34); // => Tommy the Palomino moved 34m.
// 此时 tom 被视为 Horse 类型
// Property 'run' does not exist on type 'Animal'
// tom.run();
// 使用类型断言来调用
tom.run(); // running...
// ------------------------ 权限修饰符 -----------------------------
// ts 中只有 public, protected, private 三种权限修饰符
// 权限修饰符是一种封装手段，可以有效开闭属性
var Student = /** @class */ (function () {
    function Student() {
    }
    return Student;
}());
var student = new Student();
student.name;
// Property 'id' is private and only accessible within class 'Student'.
// student.id;
// private
// ts 是结构化的类型，我们说是要两个对象无论它们是如何构造的，只要成员相同，那么它们就是兼容的
// 但是在比较两个含有私有属性的对象时略有不同，相同的私有属性必须声明自同一处，换句话说，只有父子类的实例私有属性才有可能相同
var Base = /** @class */ (function () {
    function Base() {
        this.a = 123;
    }
    return Base;
}());
var Derived = /** @class */ (function (_super) {
    __extends(Derived, _super);
    function Derived() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Derived;
}(Base));
var SomeClass = /** @class */ (function () {
    function SomeClass() {
        this.a = 666;
    }
    return SomeClass;
}());
var base = new Base();
var derived = new Derived();
var some = new SomeClass();
base = derived;
base = some;
