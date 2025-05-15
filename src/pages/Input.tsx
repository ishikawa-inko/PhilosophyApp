import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Input.css';

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

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null); // 選択されたジャンル
  const [selectedExample, setSelectedExample] = useState<string | null>(null); // 選択された例
  const [customInput, setCustomInput] = useState(''); // 自由入力欄の内容
  const [selectedPhilosophers, setSelectedPhilosophers] = useState<string[]>([]); // 選択された哲学者

  // 送信ボタンの処理の関数
  const handleSubmit = () => {
    const allConcerns = []; // 選択された悩みを格納する配列
    if (selectedExample) allConcerns.push(selectedExample); // 選択された例を追加
    if (customInput.trim()) allConcerns.push(customInput.trim()); // 自由入力欄の内容を追加

    //入力漏れ時のアラート
    if (allConcerns.length === 0) {
      alert('悩みを1つ以上選択または記入してください。');
      return;
    }
    if (selectedPhilosophers.length === 0) {
      alert('哲学者を1人以上選んでください。');
      return;
    }

    const concernText = allConcerns.join('、'); // 選択された悩みを、区切りで結合
    localStorage.setItem('userConcern', concernText);  // ユーザーの悩みをlocalStorageに保存
    localStorage.setItem('selectedPhilosophers', JSON.stringify(selectedPhilosophers)); // 選択された哲学者をlocalStorageに保存

    navigate('/chat');// チャット画面に遷移
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
              setSelectedCategory(cat);  // 選択されたジャンルをセット
              setSelectedExample(null); // 選択された例をリセット
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

      {/* 哲学者選択欄 */}
      <h3>相談したい哲学者を最大3人まで選んでください</h3>
      <div className="philosopher-list">
        {['ソクラテス','ニーチェ', 'カント', 'サルトル', 'ベンサム', 'エピクロス', '老子'].map((name) => (
          <label key={name} className="checkbox-item">
            <input
              type="checkbox"
              checked={selectedPhilosophers.includes(name)}
              onChange={() => {
                if (selectedPhilosophers.includes(name)) {
                  setSelectedPhilosophers(selectedPhilosophers.filter(n => n !== name));
                } else if (selectedPhilosophers.length < 3) {
                  setSelectedPhilosophers([...selectedPhilosophers, name]);
                }
              }}
              disabled={!selectedPhilosophers.includes(name) && selectedPhilosophers.length >= 3}
            />
            {name}
          </label>
        ))}
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
