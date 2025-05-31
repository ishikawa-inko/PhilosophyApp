import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Input.css';
import socratesImg from '../assets/photo/sokuratesu.png';
import nietzscheImg from '../assets/photo/ni-tye.png';
import kantImg from '../assets/photo/kanto.png';
import sartreImg from '../assets/photo/sarutoru.png';
import benthamImg from '../assets/photo/bennsamu.png';
import epicurusImg from '../assets/photo/epikurosu.png';
import laoziImg from '../assets/photo/rousi.png';

export default function Input() {
  const navigate = useNavigate();

  const categories = [
    "人間関係",
    "将来・キャリア",
    "人生の意味",
    "自己肯定感",
    "不安・ストレス",
    "努力と目標"
  ];

  
  const templates: { [key: string]: string[] } = {
    "人間関係": ["友達とうまくいかない", "教授が怖い", "みんなと仲良くなれない"],
    "将来・キャリア": ["やりたい仕事が見つからない", "将来が不安", "進路が決められない"],
    "人生の意味": ["生きてる意味が分からない", "何のために頑張るのか", "このままでいいのか不安"],
    "自己肯定感": ["自分に自信が持てない", "失敗ばかりに感じる", "他人と比べてしまう"],
    "不安・ストレス": ["漠然とした不安がある", "焦りを感じてしまう", "常にストレスを感じる"],
    "努力と目標": ["目標を立てても続かない", "努力が報われない気がする", "サボってしまう自分が嫌"]
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState('');
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>([]);

  const handleSubmit = () => {
    const allConcerns = [];
    if (selectedExample) allConcerns.push(selectedExample);
    if (customInput.trim()) allConcerns.push(customInput.trim());

    if (allConcerns.length === 0) {
      alert('悩みを1つ以上選択または記入してください。');
      return;
    }

    if (selectedPhilosophers.length === 0) {
      alert('哲学者を1人以上選んでください。');
      return;
    }

    const concernText = allConcerns.join('、');
    localStorage.setItem('userConcern', concernText);
    localStorage.setItem('selectedPhilosophers', JSON.stringify(selectedPhilosophers));

    navigate('/chat');
  };
const philosophers = [
  { name: 'ソクラテス', image: socratesImg, character: 'しつこい質問おじさん' },
  { name: 'ニーチェ', image: nietzscheImg, character: '熱血ポエマー' },
  { name: 'カント', image: kantImg, character: 'マジメ理論マン' },
  { name: 'サルトル', image: sartreImg, character: '重めの思想おじさん' },
  { name: 'ベンサム', image: benthamImg, character: '幸せ陽キャ' },
  { name: 'エピクロス', image: epicurusImg, character: '静かに生きたい系' },
  { name: '老子', image: laoziImg, character: 'ゆる仙人' },
];


  return (
    
    <div className="input-container">
      <h2>君のお悩みは？</h2>

      <div className="category-list">
  {categories.map((cat) => (
    <div
      key={cat}
      className={`category-card ${selectedCategory === cat ? 'selected' : ''}`}
      onClick={() => {
        setSelectedCategory(cat);
        setSelectedExample(null);
      }}
    >
      <div className="category-name">{cat}</div>
    </div>
  ))}
</div>


      {/* 例の表示（ラジオボタン） */}
      {selectedCategory && (
        <div className="examples">
          <h4>例（1つ選んでみよう）:</h4>
          {templates[selectedCategory]?.map((example, idx) => (
            <div key={idx}>
              <label>
                <input
                  type="radio"
                  name="example"
                  value={example}
                  checked={selectedExample === example}
                  onChange={() => setSelectedExample(example)}
                />
                {` ${example}`}
              </label>
            </div>
          ))}
        </div>
      )}

      {/* 自由入力欄 */}
      <div style={{ marginBottom: '1rem' }}>
        <h4>もっと詳しく教えて！（任意）:</h4>
        <textarea
          rows={4}
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          className="textarea"
          placeholder="自由に悩みを記入してください"
        />
      </div>

      {/* 哲学者選択欄 */}
      <h3>気になる哲学者を最大3人まで選んでね！</h3>
      <div className="philosopher-list">
  {philosophers.map(({ name, image, character }) => {
    const isSelected = selectedPhilosophers.includes(name);

    return (
      <div
        key={name}
        className={`philosopher-card ${isSelected ? 'selected' : ''}`}
        onClick={() => {
          if (isSelected) {
            setSelectedPhilosophers(selectedPhilosophers.filter(n => n !== name));
          } else if (selectedPhilosophers.length < 3) {
            setSelectedPhilosophers([...selectedPhilosophers, name]);
          }
        }}
      >
        <div className="philosopher-name">{name}</div>
        <img src={image} alt={name} className="philosopher-image" />
        <div className="philosopher-character">{character}</div>
      </div>
    );
  })}
</div>
{/* 送信ボタン */}
<div>
  <button
    onClick={handleSubmit}
    className="submit-button"
  >
    会話を始める
  </button>
</div>

    </div>
  );
}
