import React from 'react';

export type HistoryItem = { expr: string; res: string };

type HistoryProps = {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
};

export default function HistoryPanel({ history, onSelect, onClear }: HistoryProps) {
  return (
    <div className="panel history" role="region" aria-label="Calculation history">
      <header>
        <h2>History</h2>
        <button className="history-btn" onClick={onClear} aria-label="Clear history">Clear</button>
      </header>
      <div className="list">
        {history.length === 0 && (
          <div className="item" aria-disabled>Empty</div>
        )}
        {history.map((h, i) => (
          <div key={i} className="item" onClick={() => onSelect(h)} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(h)} aria-label={`Use result ${h.res}`}>
            <div className="expr">{h.expr}</div>
            <div className="res">{h.res}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
