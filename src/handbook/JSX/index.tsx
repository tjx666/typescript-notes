/**
 * 虽然我已经用 ts 写过不少 react 项目了，但是对其中的类型检测原理却一点都不清楚
 *
 * tsx 中 元素分两种类型
 * 1. 固有元素 也就是 HTML 标签
 * 2. 值元素 react 中指代 函数组件和类组件
 *
 */

export default undefined;
import * as React from 'react';

// tsx 中类型转换只能用 as，因为尖括号和标签在解析上冲突
const age: any = 22;
const ageNun = age as number;

// React 规范中规定小写字母开头的标签被识别未固有元素, 以大写字母开头的元素被识别为值元素
// 小写开头
const box = <div />;
const Box = () => <div />;
const boxComponent = <Box />;
