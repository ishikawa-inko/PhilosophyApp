import '../styles/Home.css'; // CSSインポート
import birdImage from '../assets/photo/bird.png';

export default function Home() {
  return (
    <div className="container">
      <h2 className="subtitle">哲学者にお悩み相談？！</h2>
      <h1 className="title">思想家に訊け！お悩み相談会</h1>

      <button className="button" onClick={() => window.location.href = '/input'}>
        悩みを入力
      </button>

{/* モデレーター テツピヨ */}
<div className="inco-wrapper">
  <div className="inco-name">テツピヨ</div>
  <div className="inco-row">
    <img src={birdImage} alt="テツピヨ" className="inco-image" />
    <div className="inco-speech">
      ぼくはテツピヨ、哲学の世界へようこそ！
    </div>
  </div>
    </div> 
    </div>

  );
}
