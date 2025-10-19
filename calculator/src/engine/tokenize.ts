export type Token = 
  | { type: 'number'; value: string }
  | { type: 'op'; value: '+' | '-' | '*' | '/' | '×' | '÷' | 'u-' | '%' }
  | { type: 'paren'; value: '(' | ')' };

const isDigit = (ch: string) => /[0-9]/.test(ch);

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const ch = input[i];
    if (ch === ' ') { i++; continue; }

    // numbers (support single '.')
    if (isDigit(ch) || (ch === '.')) {
      let num = '';
      let dotCount = 0;
      while (i < input.length && (isDigit(input[i]) || input[i] === '.')) {
        if (input[i] === '.') {
          dotCount++;
          if (dotCount > 1) break;
        }
        num += input[i];
        i++;
      }
      if (num === '.' || num === '') {
        // treat lone '.' as 0.
        num = '0.';
      }
      tokens.push({ type: 'number', value: num });
      continue;
    }

    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '(' || ch === ')' ) {
      if (ch === '(' || ch === ')') {
        tokens.push({ type: 'paren', value: ch });
      } else {
        tokens.push({ type: 'op', value: ch as any });
      }
      i++;
      continue;
    }

    // Multiplication/Division symbols
    if (ch === '×' || ch === '÷') {
      tokens.push({ type: 'op', value: ch });
      i++;
      continue;
    }

    // Percent postfix
    if (ch === '%') {
      tokens.push({ type: 'op', value: '%' });
      i++;
      continue;
    }

    // ignore unknowns
    i++;
  }

  // Insert explicit unary minus tokens where needed
  const final: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    const t = tokens[j];
    if (t.type === 'op' && t.value === '-') {
      const prev = final[final.length - 1];
      if (!prev || (prev.type === 'op' && prev.value !== '%') || (prev.type === 'paren' && prev.value === '(')) {
        final.push({ type: 'op', value: 'u-' });
        continue;
      }
    }
    final.push(t);
  }

  return final;
}
