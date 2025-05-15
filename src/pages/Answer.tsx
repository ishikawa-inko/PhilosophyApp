import { useLocation } from 'react-router-dom';
import '../styles/Answer.css';

// 哲学者ごとのアドバイス一覧
const philosopherAdviceMap: Record<string, string> = {
  ソクラテス: '無知の自覚こそ、知のはじまりじゃ。',
  ニーチェ: 'お前が地獄を見てきたなら、それは力になる。',
  カント: '理性によって道を切り開け。',
  ベンサム: '幸せが最大になる道を選べばいいんだよ！',
  エピクロス: '苦しみを減らす選択こそが賢明だよ。',
  サルトル: '人間は自分で意味を作る自由に投げ込まれている。',
  老子: '流れに身を任せるのも道だよ〜。',
};

export default function Answer() {
  const location = useLocation();

  // どこから来たかに応じて哲学者名を取得（state優先 → localStorage）
  const statePhilosopher = location.state?.philosopher;
  const localPhilosopher = localStorage.getItem('finalPhilosopher');
  const philosopher = statePhilosopher || localPhilosopher || 'ソクラテス';

  // アドバイス文、解決策、元の返答
  const advice = philosopherAdviceMap[philosopher] || '考え続けることが大事だよ。';
  const solution = localStorage.getItem('finalSolution') || '';

  return (
    <div className="answer-container">
      <h1>君に寄り添う哲学者は…</h1>

      <div className="philosopher-card">
        <h2>{philosopher}</h2>
        <p className="advice-text">💬 {advice}</p>
      </div>

      {solution && (
        <div className="solution-box">
          <h3>あなたの悩みに対するひとこと解決策</h3>
          <p className="solution-text">✅ {solution}</p>
        </div>
      )}
    </div>
  );
}
