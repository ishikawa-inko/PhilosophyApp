import OpinionSelector from '@/components/OpinionSelector';
import { usePhilosopherChat } from '@/hooks/usePhilosopherChat';
import '../styles/Chat.css';

export default function Chat() {
  const {
    chatLog,
    loading,
    showOpinionSelector,
    responses,
    handleOpinionSubmit,
  } = usePhilosopherChat();

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

      {showOpinionSelector && (
        <OpinionSelector summaries={responses} onSubmit={handleOpinionSubmit} />
      )}
    </div>
  );
}
