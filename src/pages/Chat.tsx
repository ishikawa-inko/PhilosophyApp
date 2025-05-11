import { useEffect, useRef, useState } from 'react';
import { philosopherPrompts } from '@/prompts/prompts';
import './Chat.css';

type Message = {
  sender: 'user' | string;
  text: string;
};

export default function Chat() {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [firstReply, setFirstReply] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const concern = localStorage.getItem('userConcern') ?? '';
  const selectedPhilosophers = JSON.parse(localStorage.getItem('selectedPhilosophers') || '["ニーチェ"]');
  const selectedPhilosopher = selectedPhilosophers[0];
  const otherPhilosophers = selectedPhilosophers.slice(1);

  // 最初の哲学者の返答
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const prompt = `${philosopherPrompts[selectedPhilosopher]
      .replace('{{concern}}', concern)
    }\n※返答は2〜3行に簡潔にまとめてください。`;

    setChatLog([{ sender: 'user', text: concern }]);
    setLoading(true);

    fetch('http://localhost:8000/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '返答が取得できませんでした。';
        setChatLog((prev) => [...prev, { sender: selectedPhilosopher, text: reply }]);
        setFirstReply(reply);
      })
      .catch(() => {
        setChatLog((prev) => [...prev, { sender: selectedPhilosopher, text: 'エラーが発生しました。' }]);
      })
      .finally(() => setLoading(false));
  }, []);

  // 他の哲学者の返答
  useEffect(() => {
    if (!firstReply) return;

    const fetchOtherPhilosophers = async () => {
      for (const name of otherPhilosophers) {
        const basePrompt = philosopherPrompts[name] || '';
        const followUpPrompt = `
${basePrompt}

以下のユーザーの悩みに対して、${selectedPhilosopher}が以下のように答えました。

[悩み]：
${concern}

[${selectedPhilosopher}の返答]：
${firstReply}

これを踏まえて、あなた自身の立場から新しい視点で意見を述べてください。
※返答は2〜3行に簡潔にまとめてください。
`;

        setLoading(true);
        try {
          const res = await fetch('http://localhost:8000/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: followUpPrompt }),
          });
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '返答が取得できませんでした。';
          setChatLog((prev) => [...prev, { sender: name, text: reply }]);
        } catch {
          setChatLog((prev) => [...prev, { sender: name, text: '返答中にエラーが発生しました。' }]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOtherPhilosophers();
  }, [firstReply]);

  return (
    <div className="chat-container">
      <h2>哲学チャットルーム</h2>

      <div>
        {chatLog.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender === 'user' ? 'user' : 'philosopher'}`}>
            <div className="message-bubble">
              <strong>{msg.sender === 'user' ? 'あなた' : msg.sender}：</strong><br />
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {loading && <p>考え中...</p>}
    </div>
  );
}
