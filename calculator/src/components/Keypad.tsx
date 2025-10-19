import React from 'react';
import Key from './Key';

type KeypadProps = {
  onKeyPress: (label: string) => void;
  clearLabel: 'AC' | 'C';
};

export default function Keypad({ onKeyPress, clearLabel }: KeypadProps) {
  const keys: Array<{ label: string; aria?: string; variant?: 'op' | 'equal'; wide?: boolean }> = [
    { label: clearLabel, aria: clearLabel === 'AC' ? 'All clear' : 'Clear entry' },
    { label: '⌫', aria: 'Backspace' },
    { label: '%', variant: 'op' },
    { label: '÷', variant: 'op' },

    { label: '7' }, { label: '8' }, { label: '9' }, { label: '×', variant: 'op' },
    { label: '4' }, { label: '5' }, { label: '6' }, { label: '−', variant: 'op' },
    { label: '1' }, { label: '2' }, { label: '3' }, { label: '+', variant: 'op' },
    { label: '(' }, { label: ')' }, { label: '±', aria: 'Toggle sign' }, { label: '', aria: '' },
    { label: '0', wide: true }, { label: '.' }, { label: '=', variant: 'equal' }
  ];

  // Filter out empty placeholder cell if any
  const actualKeys = keys.filter(k => k.label !== '');

  return (
    <div className="panel keypad" role="group" aria-label="Calculator keys">
      <div className="keygrid">
        {actualKeys.map((k, idx) => (
          <Key key={idx} label={k.label} ariaLabel={k.aria} variant={k.variant === 'op' ? 'op' : (k.variant === 'equal' ? 'equal' : 'default')} wide={k.wide} onPress={onKeyPress} />
        ))}
      </div>
    </div>
  );
}
