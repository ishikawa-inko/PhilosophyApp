import '../styles/Home.css'; //CSSファイルをインポート

//Homeコンポーネントを定義
export default function Home() {
  return (
    <div className="container">
      <h2 className="subtitle">哲学者にお悩み相談？！</h2>
      <h1 className="title">思想家に訊け！お悩み相談会</h1>
      
      //ボタンをクリックすると'/input'に遷移
      <button className="button" onClick={() => window.location.href = '/input'}>
        悩みを入力
      </button>

      {/* モデレーターインコ */}
      <div className="inco-wrapper">
        <div className="inco-speech">ようこそ、悩める魂よ！</div>
      </div>
      
    </div>
  );
}
