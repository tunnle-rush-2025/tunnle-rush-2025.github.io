import React from 'react';

type DisplayProps = {
  expression: string;
  result: string;
};

export default function Display({ expression, result }: DisplayProps) {
  return (
    <div className="panel display" role="region" aria-label="Calculator display">
      <div className="expression" aria-live="polite">{expression || '\u00A0'}</div>
      <div className="result" aria-live="polite">{result || '0'}</div>
    </div>
  );
}
