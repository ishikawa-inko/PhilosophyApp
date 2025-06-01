import { useLocation } from 'react-router-dom';
import '../styles/Answer.css';
import { philosopherAdvices } from '../data/philosopherAdvide';

export default function Answer() {
  const location = useLocation();

  const statePhilosopher = location.state?.philosopher;
  const localPhilosopher = localStorage.getItem('finalPhilosopher');
  const philosopher = statePhilosopher || localPhilosopher || 'ソクラテス';

  const advice = philosopherAdvices[philosopher]?.advice || '考え続けることが大事だよ。';
  const icon = philosopherAdvices[philosopher]?.icon;
  const solution = localStorage.getItem('finalSolution') || '';

  return (
    <div className="answer-container">
      <h1>君に寄り添う哲学者は…</h1>

      {icon && (
        <div className="philosopher-block">
          <div className="philosopher-name">{philosopher}</div>
          <img src={icon} alt={philosopher} className="philosopher-image" />
          <div className="advice-text">「{advice}」</div>
        </div>
      )}

      {solution && (
        <div className="solution-box">
          <h3>あなたの悩みに対するひとこと解決策</h3>
          <p className="solution-text">✅ {solution}</p>
        </div>
      )}
    </div>
  );
}
