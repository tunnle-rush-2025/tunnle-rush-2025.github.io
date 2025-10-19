import { tokenize } from './tokenize';
import { toRPN } from './parse';
import { evalRPN } from './evaluate';

export function evaluateExpression(expr: string): string {
  try {
    const tokens = tokenize(expr);
    const rpn = toRPN(tokens);
    const res = evalRPN(rpn);
    return res;
  } catch (e) {
    return 'Error';
  }
}

export { tokenize } from './tokenize';
export { toRPN } from './parse';
export { evalRPN } from './evaluate';
