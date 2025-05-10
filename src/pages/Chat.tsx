import { useEffect, useRef, useState } from 'react';
import { philosopherPrompts } from '@/prompts/prompts';
import './Chat.css';

type Message = {
  sender: 'user' | '哲学者';
  text: string;
};

export default function Chat() {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const hasFetched = useRef(false); // 1回だけ実行するためのフラグ

  const selectedPhilosopher = 'ニーチェ'; // ← あとで動的に切り替え可能に
  const concern = localStorage.getItem('userConcern') || '将来が不安です';

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const prompt = philosopherPrompts[selectedPhilosopher].replace('{{concern}}', concern);

    // ユーザーの悩みを最初に表示
    setChatLog([{ sender: 'user', text: concern }]);
    setLoading(true);

    // Gemini API に送信
    fetch('http://localhost:8000/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '返答が取得できませんでした。';
        setChatLog((prev) => [...prev, { sender: '哲学者', text: reply }]);
      })
      .catch(() => {
        setChatLog((prev) => [...prev, { sender: '哲学者', text: 'エラーが発生しました。' }]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
  <div className="chat-container">
    <h2>哲学チャットルーム</h2>

    <div>
      {chatLog.map((msg, idx) => (
        <div key={idx} className={`message ${msg.sender === 'user' ? 'user' : 'philosopher'}`}>
          <div className="message-bubble">
            <strong>{msg.sender === 'user' ? 'あなた' : selectedPhilosopher}：</strong><br />
            {msg.text}
          </div>
        </div>
      ))}
    </div>

    {loading && <p>考え中...</p>}
  </div>
  );
}
