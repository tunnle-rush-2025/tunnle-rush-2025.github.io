import { describe, it, expect } from 'vitest';
import { evaluateExpression } from './index';

describe('engine arithmetic', () => {
  it('adds with decimal precision', () => {
    expect(evaluateExpression('0.1+0.2')).toBe('0.3');
  });
  it('multiplies with precision', () => {
    expect(evaluateExpression('2.3*3')).toBe('6.9');
  });
  it('handles subtraction and negative numbers', () => {
    expect(evaluateExpression('5-8')).toBe('-3');
    expect(evaluateExpression('-3+5')).toBe('2');
    expect(evaluateExpression('(-3)+5')).toBe('2');
  });
  it('handles division', () => {
    expect(evaluateExpression('7/2')).toBe('3.5');
  });
  it('handles parentheses', () => {
    expect(evaluateExpression('(2+3)*4')).toBe('20');
  });
  it('handles percent (unary postfix)', () => {
    expect(evaluateExpression('50%')).toBe('0.5');
    expect(evaluateExpression('200*10%')).toBe('20');
  });
  it('divide by zero -> Error', () => {
    expect(evaluateExpression('5/0')).toBe('Error');
  });
});
