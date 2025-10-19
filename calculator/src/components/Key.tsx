import React from 'react';

type KeyProps = {
  label: string;
  ariaLabel?: string;
  variant?: 'default' | 'op' | 'equal';
  wide?: boolean;
  onPress: (label: string) => void;
};

export default function Key({ label, ariaLabel, variant = 'default', wide, onPress }: KeyProps) {
  return (
    <button
      type="button"
      className={`key ${variant !== 'default' ? variant : ''} ${wide ? 'wide' : ''}`.trim()}
      onClick={() => onPress(label)}
      aria-label={ariaLabel || label}
    >
      {label}
    </button>
  );
}
