import React, { useState } from 'react';

type Props = {
  summaries: { name: string; text: string }[];
  onSubmit: (selected: string, comment: string) => void;
};

export default function OpinionSelector({ summaries, onSubmit }: Props) {
  const [selected, setSelected] = useState('');
  const [comment, setComment] = useState('');

  return (
    <div className="opinion-box">
      <h4>どの意見に共感しましたか？</h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {summaries.map(({ name, text }) => (
          <label key={name} style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
            <input
              type="radio"
              name="opinion"
              value={name}
              checked={selected === name}
              onChange={() => setSelected(name)}
              style={{ marginRight: '0.5rem', marginTop: '0.2rem' }}
            />
            <span><strong>{name}：</strong> {text.split('。')[0]}。</span>
          </label>
        ))}

        <label style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <input
            type="radio"
            name="opinion"
            value="none"
            checked={selected === 'none'}
            onChange={() => setSelected('none')}
            style={{ marginRight: '0.5rem', marginTop: '0.2rem' }}
          />
          <span>どれにも共感できなかった</span>
        </label>
      </div>

      <h4>あなたの考えもぜひ教えてください（任意）</h4>
      <textarea
        rows={3}
        placeholder="自分の考えを書いてみよう"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button disabled={!selected} onClick={() => onSubmit(selected, comment)}>
        送信
      </button>
    </div>
  );
}
