import Decimal from 'decimal.js-light';
import type { RPN } from './parse';
import type { Token } from './tokenize';

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP });

function fmt(d: Decimal): string {
  // Normalize trailing zeros and small exponents
  const s = d.toSignificantDigits(34).toString();
  if (s.indexOf('e') !== -1) return d.toString();
  if (s.includes('.')) return s.replace(/\.0+$/, '').replace(/(\.[0-9]*?)0+$/, '$1');
  return s;
}

export function evalRPN(rpn: RPN): string {
  const stack: Decimal[] = [];

  for (const t of rpn) {
    if ((t as Token).type === 'number') {
      const num = new Decimal((t as any).value);
      if (!num.isFinite()) throw new Error('Error');
      stack.push(num);
      continue;
    }

    const op = (t as any).value as string;

    if (op === 'u-') {
      const a = stack.pop();
      if (!a) throw new Error('Error');
      stack.push(a.neg());
      continue;
    }
    if (op === '%') {
      const a = stack.pop();
      if (!a) throw new Error('Error');
      stack.push(a.div(100));
      continue;
    }

    const b = stack.pop();
    const a = stack.pop();
    if (!a || !b) throw new Error('Error');

    switch (op) {
      case '+': stack.push(a.add(b)); break;
      case '-': stack.push(a.sub(b)); break;
      case '*':
      case '×': stack.push(a.mul(b)); break;
      case '/':
      case '÷': {
        if (b.isZero()) throw new Error('Error');
        stack.push(a.div(b));
        break;
      }
      default:
        throw new Error('Error');
    }
  }

  if (stack.length !== 1) throw new Error('Error');
  return fmt(stack[0]);
}
