import { useState } from 'react';
import OpinionSelector from '@/components/OpinionSelector';
import { usePhilosopherChat } from '@/hooks/usePhilosopherChat';
import { philosopherIcons } from '@/data/philosopherIcons';
import '../styles/Chat.css';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const navigate = useNavigate();
  const [selectedPhilosopher, setSelectedPhilosopher] = useState('');

  const {
    chatLog,
    loading,
    showOpinionSelector,
    responses,
    handleOpinionSubmit,
  } = usePhilosopherChat();

  const handleOpinion = async (selected: string, comment: string) => {
    setSelectedPhilosopher(selected);
    localStorage.setItem('finalPhilosopher', selected);

    const response = responses.find((r) => r.name === selected);
    if (response) {
      localStorage.setItem('finalAdviceText', response.text);

      const concern = localStorage.getItem('userConcern') || '';
      const prompt = `
あなたは哲学者です。
以下のユーザーの悩みと、ある哲学者の回答をもとに、
その悩みを解決に導く「1行の実用的なアドバイス」を生成してください。

[悩み]
${concern}

[哲学者の返答]
${response.text}

※日本語で、端的に。「〜するといい」など、具体的かつやさしい言葉でお願いします。
`;

      try {
        const res = await fetch('http://localhost:8000/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        const summary = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        localStorage.setItem('finalSolution', summary.trim());
      } catch (err) {
        console.error('Geminiへのリクエスト失敗', err);
        localStorage.setItem('finalSolution', 'まずは心を落ち着けて、自分を大切にしよう。');
      }
    }

    handleOpinionSubmit(selected, comment);
  };

  const handleEnd = () => {
    navigate('/answer', {
      state: {
        philosopher: selectedPhilosopher,
      },
    });
  };

  return (
    <div className="chat-container">
      <h2>哲学チャットルーム</h2>

      <div>
        {chatLog.map((msg, idx) => {
          const isUser = msg.sender === 'user';
          const isBird = msg.sender === '鳥';

          return (
            <div key={idx} className={`message ${isUser ? 'user' : 'philosopher'}`}>
              {isUser ? (
                <>
                  <div className="message-name user-name">あなた</div>
                  <div className="message-user-wrapper">
                    <div className="message-bubble">{msg.text}</div>
                    <img
                      src={philosopherIcons['user'] || ''}
                      alt="user icon"
                      className="message-user-icon"
                    />
                  </div>
                </>
              ) : (
                <>
                  <img
                    src={philosopherIcons[msg.sender] || ''}
                    alt="icon"
                    className="icon-image"
                  />
                  <div className="message-content">
                    <div className="message-name">
                      <strong>{isBird ? 'テツピヨ' : msg.sender}</strong>
                    </div>
                    <div className="message-bubble">{msg.text}</div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {loading && <p>考え中...</p>}

      {showOpinionSelector && (
        <OpinionSelector summaries={responses} onSubmit={handleOpinion} />
      )}

      <button className="end-chat-button" onClick={handleEnd}>
        会話を終了する
      </button>
    </div>
  );
}
