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
 * 3. 不要再模块中使用 namespace，namespace 目前存在的意义貌似只有再声明文件中用来描述对象
 */
export default undefined;

// ------------------------ import 关键字 -----------------------------
const name = 'ly';
// import nameAlias = name; // Cannot find namespace 'name'

class A {}
// import B = A; // 'A' only refers to a type, but is being used as a namespace here

namespace testSpace {
    let a = 999;
    export let age = 22;
    export const obj = { work: 'FE' };
    export const log = () => {
        console.log('age:', age, 'work:', obj.work);
    };
    export class TestClass {}
    export namespace innerSpace {
        const v = '666';
    }
}

import age = testSpace.age;
import obj = testSpace.obj;
import log = testSpace.log;
import TestClass = testSpace.TestClass;
import innerSpace = testSpace.innerSpace;
log();
// age = 23; // Cannot assign to 'age' because it is not a variable
obj.work = 'BE';
log();

let ageVar = testSpace.age;
let objVar = testSpace.obj;
const TestClassVar = testSpace.TestClass;
const innerSpaceVar = testSpace.innerSpace;

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
