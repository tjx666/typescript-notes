/**
 * 类型推断
 */
export default undefined

// ------------------------ 思考 -----------------------------
// 类型推论在一些比较现代的带类型的语言中比较常见例如 go，像 java 这种比较古老的语言就没有，这也是 java 为什么会被诟病繁琐的原因之一吧。
// 类型推论是个好东西，可以让编译器自动推断出一些场景下的类型，让我们减少很多无用代码。一定程度上增强可读性
// 例如
let num = 996
// 这里的 num 明显就没必要声明一个 number 类型
// 其实类型推断是一种去类型的做法，即减少了类型在开发者眼中的存在感，换来的是代码的精简

// 不应该滥用类型推论，该声明类型的时候还是要声明，举个例子：
// 这里的返回值类型不建议省略，因为有时候别人看 plus 函数就是想看它的函数类型
// 你不写返回值类型还要人家去看代码实现来分析返回值类型或者把光标挪到函数上利用 IDE 提示来查看函数类型，这就没利用到 TypeScript 类型注解的优势了
const plus = (operand1: number, operand2: number): number => operand1 + operand2

// ------------------------ 初始化时的类型推论 -----------------------------
// 变量初始化，这里 str 被推断成 字符串
let str = 'hello'

class TypeInference {
    // 成员初始化的时候，这里 age 被推断成 number
    age = 21
}
// lyrics 这里被推断成 string，返回值被推断成 void 类型
const sing = (lyrics = '我承认都是月亮惹的祸，偏偏似糖如蜜成绕指柔') => {
    console.log(lyrics)
}

// ------------------------ 最佳公共类型 -----------------------------
// 当一个类型可能由好几个候选类型的时候，tsc 会推测出一个最佳公共类型
// 例一：
const workTime = [955, 995, 996, null, 11116, true]
// 这里的数组元素候选类型有 number，null, true 类型

class Shape {}
class Circle extends Shape {}
class Rectangle extends Shape {}

// 这里的的 shapes 被推断成 Circle | Rectangle 类型，tsc 可不会将其推断成 SHape 类型，它们和 Shape 没有必然关系
const shapes = [new Circle(), new Rectangle()]
// 如果需要定义成 Shape 类型，必须手动指定 shapes 的类型，
const shapes1: Shape[] = [new Circle(), new Rectangle()]

// 看一个比较理想的情况，这里 shapes 中的元素被推断成 Shape
const shapes2 = [new Circle(), new Rectangle(), new Shape()]

// 再看一种采用最佳公共类型推断策略的情况
// 这里的函数返回值被推断成了 boolean | 1，因为候选类型也有很多种，但是不是被推断成 boolean | number 有点出乎意料
function testBestCommonType() {
    if (Math.random() > 0.5) {
        return true
    } else {
        return 1
        // 如果是下面这种情况会被推断成 boolean | number
        // return Math.random();
    }
}

// ------------------------ 上下文类型 -----------------------------
// 简单来说就是类型由上下文已有类型推导出来的，看几个例子
const unionTypeVar: number | null = 666
// 赋值的时候由已有类型 number 推断出来, unionTypeVar 这里被推断出 number 类型
const count: number = unionTypeVar
console.log(unionTypeVar)

// 类型强转也算
let anyTypeVar: any
anyTypeVar = 996
// anyTypeVar 的类型由上下文即强转提供的类型推导出来
const nnn = <number>anyTypeVar

// 函数表达式
// 这里的 p1 类型由上下文类型函数类型声明推断得出
const fn: (p1: number) => void = function(p1) {}

// 形式上一般都是右边的表达式中的类型由左边的类型推出
