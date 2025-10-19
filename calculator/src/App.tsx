import React, { useEffect, useMemo, useState } from 'react';
import Display from './components/Display';
import Keypad from './components/Keypad';
import HistoryPanel, { type HistoryItem } from './components/HistoryPanel';
import { evaluateExpression } from './engine';

function isOperator(ch: string) {
  return ['+', '-', '*', '/', '×', '÷'].includes(ch);
}

function mapKeyToInput(k: string): string | null {
  switch (k) {
    case '×': return '*';
    case '÷': return '/';
    case '−': return '-';
    default: return k;
  }
}

export default function App() {
  const [expr, setExpr] = useState('');
  const [result, setResult] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const clearLabel = useMemo(() => (expr.length > 0 ? 'C' : 'AC'), [expr]);

  const recalc = (next: string) => {
    if (!next) { setResult('0'); return; }
    const out = evaluateExpression(next.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-'));
    setResult(out);
  };

  const append = (val: string) => {
    // Map keypad display tokens to internal
    const v = mapKeyToInput(val) ?? val;

    if (v === 'AC' || v === 'C') { setExpr(''); setResult('0'); return; }
    if (v === '⌫') { if (expr.length > 0) { const n = expr.slice(0, -1); setExpr(n); recalc(n); } return; }
    if (v === '=') {
      if (!expr) return;
      const res = evaluateExpression(expr);
      if (res === 'Error') { setResult('Error'); return; }
      setResult(res);
      setHistory([{ expr, res }, ...history].slice(0, 20));
      setExpr(res); // continue from result
      return;
    }
    if (v === '±') {
      // Toggle sign on the last number segment
      const m = expr.match(/(\d*\.?\d+)(?!.*\d)/);
      if (!m) { setExpr(expr); return; }
      const idx = m.index ?? 0;
      const before = expr.slice(0, idx);
      const num = m[0];
      const after = expr.slice(idx + num.length);

      // Determine if there is a unary minus directly preceding the number
      const unary = before.endsWith('(-') || before.endsWith('(') || before === '' || isOperator(before.slice(-1));
      if (unary) {
        // Insert a unary minus before the number via wrapping in ( -num ) to keep parsing simple
        const next = `${before}(-${num})${after}`;
        setExpr(next);
        recalc(next);
      } else {
        // If there's an explicit '-' just before the number and before that is operator or '('
        if (before.endsWith('-')) {
          const pre = before.slice(0, -1);
          const next = `${pre}${num}${after}`;
          setExpr(next);
          recalc(next);
        } else {
          const next = `${before}-${num}${after}`;
          setExpr(next);
          recalc(next);
        }
      }
      return;
    }

    if (v === '.') {
      // prevent two dots in the current number
      const last = expr.match(/(\d*\.?\d*)(?!.*\d)/)?.[0] ?? '';
      if (last.includes('.')) return;
    }

    if (v === '(') {
      // If previous is number or ')', insert multiplication
      if (expr && (/[0-9)]$/.test(expr))) {
        const n = expr + '*' + v;
        setExpr(n); recalc(n); return;
      }
    }
    if (v === ')') {
      // Avoid closing more than opened
      const open = (expr.match(/\(/g) || []).length;
      const close = (expr.match(/\)/g) || []).length;
      if (close >= open) return;
    }

    let next = expr + v;

    // Avoid two operators in a row (replace last)
    if (expr && isOperator(expr.slice(-1)) && isOperator(v)) {
      next = expr.slice(0, -1) + v;
    }

    setExpr(next);
    recalc(next);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const { key } = e;
      if (/^[0-9]$/.test(key)) { append(key); return; }
      if (key === '.') { append('.'); return; }
      if (key === '+') { append('+'); return; }
      if (key === '-') { append('−'); return; }
      if (key === '*') { append('×'); return; }
      if (key === '/') { append('÷'); return; }
      if (key === '%') { append('%'); return; }
      if (key === '(') { append('('); return; }
      if (key === ')') { append(')'); return; }
      if (key === 'Enter' || key === '=') { e.preventDefault(); append('='); return; }
      if (key === 'Escape') { append(clearLabel); return; }
      if (key === 'Backspace') { append('⌫'); return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expr, clearLabel]);

  return (
    <div className="container app">
      <header className="header" role="banner">
        <h1>Standard Calculator</h1>
        <div className="meta">Precision arithmetic with Decimal.js</div>
      </header>

      <div className="history-toggle">
        <button className="history-btn" onClick={() => setShowHistory(s => !s)} aria-expanded={showHistory} aria-controls="history-panel">{showHistory ? 'Hide' : 'Show'} history</button>
      </div>

      <main className="main" role="main">
        <section aria-label="Calculator" className="calc">
          <Display expression={expr} result={result} />
          <Keypad clearLabel={clearLabel as 'AC' | 'C'} onKeyPress={(label) => {
            if (label === 'AC' || label === 'C') { append(label); } else { append(label); }
          }} />
        </section>
        <aside id="history-panel" style={{ display: showHistory ? 'block' : undefined }}>
          <HistoryPanel
            history={history}
            onSelect={(h) => { setExpr(h.res); setResult(h.res); }}
            onClear={() => setHistory([])}
          />
        </aside>
      </main>
    </div>
  );
}
