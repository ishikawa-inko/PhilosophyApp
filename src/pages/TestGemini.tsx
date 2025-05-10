import { useState } from 'react';

function TestGemini() {
  const [response, setResponse] = useState('');

  const handleClick = async () => {
    const res = await fetch('http://localhost:8000/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: "ソクラテスとして、人生の意味について語ってください。"
      })
    });
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    setResponse(text || '返答なし');
  };

  return (
    <div>
      <button onClick={handleClick}>Geminiに聞く</button>
      <p>{response}</p>
    </div>
  );
}

export default TestGemini;
