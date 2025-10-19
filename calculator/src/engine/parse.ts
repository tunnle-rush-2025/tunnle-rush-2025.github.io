import type { Token } from './tokenize';

export type RPN = (Token | { type: 'op'; value: 'u-' | '+' | '-' | '*' | '/' | '×' | '÷' | '%' })[];

type OpInfo = { prec: number; assoc: 'L' | 'R'; arity: 1 | 2; postfix?: boolean };

const OP: Record<string, OpInfo> = {
  '%': { prec: 4, assoc: 'L', arity: 1, postfix: true },
  'u-': { prec: 3, assoc: 'R', arity: 1 },
  '*': { prec: 2, assoc: 'L', arity: 2 },
  '×': { prec: 2, assoc: 'L', arity: 2 },
  '/': { prec: 2, assoc: 'L', arity: 2 },
  '÷': { prec: 2, assoc: 'L', arity: 2 },
  '+': { prec: 1, assoc: 'L', arity: 2 },
  '-': { prec: 1, assoc: 'L', arity: 2 }
};

export function toRPN(tokens: Token[]): RPN {
  const output: RPN = [];
  const ops: Token[] = [];

  for (const t of tokens) {
    if (t.type === 'number') {
      output.push(t);
      continue;
    }
    if (t.type === 'op') {
      const info = OP[t.value];

      if (info?.postfix) {
        // Postfix operator immediately flushes operators with higher precedence
        while (ops.length) {
          const top = ops[ops.length - 1] as Token;
          if (top.type === 'op') {
            const topInfo = OP[top.value];
            if (topInfo && (topInfo.prec > info.prec || (topInfo.prec === info.prec && info.assoc === 'L'))) {
              output.push(ops.pop() as any);
              continue;
            }
          }
          break;
        }
        ops.push(t);
        continue;
      }

      while (ops.length) {
        const top = ops[ops.length - 1] as Token;
        if (top.type === 'op') {
          const topInfo = OP[top.value];
          if (!topInfo) break;
          if ((topInfo.prec > info.prec) || (topInfo.prec === info.prec && info.assoc === 'L')) {
            output.push(ops.pop() as any);
            continue;
          }
        }
        break;
      }
      ops.push(t);
      continue;
    }
    if (t.type === 'paren') {
      if (t.value === '(') {
        ops.push(t);
      } else {
        // ')'
        while (ops.length) {
          const top = ops.pop() as Token;
          if (top.type === 'paren' && top.value === '(') break;
          output.push(top as any);
        }
      }
    }
  }

  while (ops.length) output.push(ops.pop() as any);
  return output;
}
