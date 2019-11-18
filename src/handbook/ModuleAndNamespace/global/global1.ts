/** 没有顶级的 import/export 声明的文件不会被视为模块，而是全局作用域的代码 */

// global2.ts 中已经声明过 Product 类了
// class Product {
//     id?: number;
// }

/*
报错如下，相同作用域不允许重复声明同一个类名
Duplicate identifier 'Product'.ts(2300)
global1.ts(4, 7): 'Product' was also declared here.
*/
