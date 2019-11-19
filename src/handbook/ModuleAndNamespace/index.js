'use strict';
exports.__esModule = true;
/// <reference path="./externalMod.d.ts" />
/**
 * TypeScript 出现的比 ES6 还早，ES6 出现以前 TypeScript 就已经有自己的模块化解决方案了
 * 早期的 ts 中有两种模块
 * 1. 外部模块， 也就是基于文件的模块系统, import module = require() 和 export = module
 * 2. 内部模块，使用 module 关键字定义一个独立的作用域
 *
 * ESM 中我们一般我们使用 module 来描述的模块，也就是描述外部模块，内部模块使用 module 来声明很容易和外部模块混淆，所以改名叫 namespace
 *
 * 一些总结：
 * 1. 建议平时开发使用 ESM，抛弃其它模块化方案，什么 AMD, UMD 见鬼去
 * 2. 根据实际需求合理使用 ESM, 默认导出就应该用 export default, 导出多个变量就应该用 export {}
 * 3. 不要在模块中使用 namespace，namespace 目前存在的意义貌似只有再声明文件中用来描述对象
 *
 * 这个章节的内容我太熟悉了，只是对 handbook 中一些感兴趣的部分就行测试
 */
exports['default'] = undefined;
// ------------------------ import 关键字 -----------------------------
// import 关键字能在哪些地方使用？
var name = 'ly';
// import nameAlias = name; // Cannot find namespace 'name'
var A = /** @class */ (function() {
    function A() {}
    return A;
})();
// import B = A; // 'A' only refers to a type, but is being used as a namespace here
// 根据提示貌似只能对模块和 namespace 使用
var testSpace;
(function(testSpace) {
    var a = 999;
    testSpace.age = 22;
    testSpace.obj = { work: 'FE' };
    testSpace.log = function() {
        console.log('age:', testSpace.age, 'work:', testSpace.obj.work);
    };
    var TestClass = /** @class */ (function() {
        function TestClass() {}
        return TestClass;
    })();
    testSpace.TestClass = TestClass;
    var innerSpace;
    (function(innerSpace) {
        innerSpace.v = '666';
    })((innerSpace = testSpace.innerSpace || (testSpace.innerSpace = {})));
})(testSpace || (testSpace = {}));
console.log(testSpace.innerSpace.v); // => 666
var obj = testSpace.obj;
var log = testSpace.log;
log();
// age = 23; // Cannot assign to 'age' because it is not a variable
obj.work = 'BE';
log();
// 也可以直接定义一个变量，和使用 import 定义有区别吗？
var ageVar = testSpace.age;
var objVar = testSpace.obj;
var TestClassVar = testSpace.TestClass;
var innerSpaceVar = testSpace.innerSpace;
/*
编译到 es5 产出的文件
var name = 'ly';
var A =  (function () {
    function A() {
    }
    return A;
}());

var testSpace;
(function (testSpace) {
    var a = 999;
    testSpace.age = 22;
    testSpace.obj = { work: 'FE' };
    testSpace.log = function () {
        console.log('age:', testSpace.age, 'work:', testSpace.obj.work);
    };
    var TestClass =  (function () {
        function TestClass() {
        }
        return TestClass;
    }());
    testSpace.TestClass = TestClass;
    var innerSpace;
    (function (innerSpace) {
        var v = '666';
    })(innerSpace = testSpace.innerSpace || (testSpace.innerSpace = {}));
})(testSpace || (testSpace = {}));
var obj = testSpace.obj;
var log = testSpace.log;
log();
obj.work = 'BE';
log();

var ageVar = testSpace.age;
var objVar = testSpace.obj;
var TestClassVar = testSpace.TestClass;
var innerSpaceVar = testSpace.innerSpace;
*/
// 可以看出使用 import 或者 const 声明 namespace 内部成员在编译出的 js 中没有任何区别
// 从上面的使用也可以看出，我发现的唯一区别就是 import 导入的成员不能被修改
// 其实 import mod = require() 基本等同于 const mod = require()，只不过有这套模块化方案时没有 const，所以用 import 来实现不可修改
// 使用 export = module 来导出模块， import module = require('module_path') 这是 ESM 出来以前的模块化方案
var add = require('./add');
console.log(add(1, 1)); // => 2
// 能不能混用？
var str1 = require('./esm');
console.log(str1); // => { default: 'default export' }
// 强烈不建议混用
if (true) {
    // import 不能在块作用域中使用
    // import str2 from './esm;'// An import declaration can only be used in a namespace or module
    var str3 = require('./esm');
}
var testI = { name: 'ly' };
