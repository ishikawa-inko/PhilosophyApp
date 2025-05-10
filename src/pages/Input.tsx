import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Input.css';

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

  const handleSubmit = () => {
    const allConcerns = [];
    if (selectedExample) allConcerns.push(selectedExample);
    if (customInput.trim()) allConcerns.push(customInput.trim());

    if (allConcerns.length === 0) {
      alert('悩みを1つ以上選択または記入してください。');
      return;
    }

     const concernText = allConcerns.join('、'); // 例と自由記入を結合
        localStorage.setItem('userConcern', concernText); // ここで保存！
    navigate('/chat');
  };

  return (
  <div className="input-container">
    <h2>あなたのお悩みは？</h2>

    {/* ジャンル選択 */}
    <div style={{ marginBottom: '1rem' }}>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setSelectedCategory(cat);
            setSelectedExample(null);
          }}
          className={`category-button ${selectedCategory === cat ? 'selected' : ''}`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* 例の表示（ラジオボタン） */}
    {selectedCategory && (
      <div className="examples">
        <h4>例（1つ選んでください）:</h4>
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
      <h4>もっと詳しく書きたい方はこちら（任意）:</h4>
      <textarea
        rows={4}
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        className="textarea"
        placeholder="自由に悩みを記入してください"
      />
    </div>

    {/* 送信ボタン */}
    <div style={{ textAlign: 'right' }}>
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
