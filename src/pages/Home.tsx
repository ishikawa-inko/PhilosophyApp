import './Home.css'; // 相対パスで読み込む

export default function Home() {
  return (
    <div className="container">
      <h2 className="subtitle">
        哲学者にお悩み相談？！<br />
      </h2>
      <h1 className="title">哲学の部屋</h1>
      <button className="button" onClick={() => window.location.href = '/input'}>
        悩みを入力
      </button>
    </div>
  );
}
