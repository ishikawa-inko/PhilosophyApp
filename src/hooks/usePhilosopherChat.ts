import { useEffect, useRef, useState } from 'react';
import { philosopherPrompts } from '@/prompts/prompts';

type Message = { sender: string; text: string };
type Response = { name: string; text: string };

export function usePhilosopherChat() {
  const [chatLog, setChatLog] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<Response[]>([]);
  const [showOpinionSelector, setShowOpinionSelector] = useState(false);
  const [loopCount, setLoopCount] = useState(1);
  const hasFetched = useRef(false);

  const concern = localStorage.getItem('userConcern') ?? '';
  const selectedPhilosophers: string[] = JSON.parse(localStorage.getItem('selectedPhilosophers') || '[]');
  const selectedPhilosopher = selectedPhilosophers[0];
  const otherPhilosophers = selectedPhilosophers.slice(1);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    startConversation();
  }, [loopCount]);

  const startConversation = async () => {
    const firstPrompt = `${philosopherPrompts[selectedPhilosopher].replace('{{concern}}', concern)}\n※返答は2〜3行以内で簡潔にまとめてください。例え話や長い補足は避けてください。`;

    const otherPrompts = otherPhilosophers.map(name => {
      const base = philosopherPrompts[name] || '';
      return {
        name,
        prompt: `${base}\n以下のユーザーの悩みに対して、${selectedPhilosopher}が以下のように答えました。\n\n[悩み]：\n${concern}\n\n[${selectedPhilosopher}の返答]：\n{{firstReply}}\n\nこれを踏まえて、あなた自身の立場から新しい視点で意見を述べてください。\n※返答は2〜3行に簡潔にまとめてください。`
      };
    });

    setChatLog([{ sender: 'user', text: concern }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: firstPrompt }),
      });
      const data = await res.json();
      const firstReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '返答が取得できませんでした。';
      setChatLog(prev => [...prev, { sender: selectedPhilosopher, text: firstReply }]);
      setResponses(prev => [...prev, { name: selectedPhilosopher, text: firstReply }]);

      for (const p of otherPrompts) {
        const prompt = p.prompt.replace('{{firstReply}}', firstReply);
        const res = await fetch('http://localhost:8000/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '返答が取得できませんでした。';
        setChatLog(prev => [...prev, { sender: p.name, text }]);
        setResponses(prev => [...prev, { name: p.name, text }]);
        await new Promise(r => setTimeout(r, 500));
      }

      const reactions = [
        'みんな違っておもしろいね！さて、あなたはどれに共感できた？',
        '意見が分かれたようだね。あなたの気持ちはどう？',
        'どれもなるほど…でも、あなたはどの考えに近い？',
        'さて、心に残った意見はどれかな？教えて！'
      ];
      const reaction = reactions[Math.floor(Math.random() * reactions.length)];
      await new Promise(r => setTimeout(r, 1000));
      setChatLog(prev => [...prev, { sender: '鳥', text: reaction }]);
      setShowOpinionSelector(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpinionSubmit = async (selected: string, comment: string) => {
    setShowOpinionSelector(false);
    setLoopCount(prev => prev + 1);

    setChatLog(prev => [...prev, {
      sender: 'あなた',
      text: `【${loopCount}回目】私は「${selected}」の意見に共感しました。\n自分の考え：${comment}`
    }]);

    const target = responses.find(r => r.name === selected);
    if (!target) return;

    const base = (philosopherPrompts[target.name] || '').replace('{{concern}}', concern);
    const prompt = `${base}\n\nユーザーは以下のあなたの意見に共感しました：\n「${target.text}」\n\nただし、こう感じたようです：\n「${comment}」\n\nそれをふまえて、さらに深めるような返答を2〜3行で簡潔にまとめてください。`;

    const res = await fetch('http://localhost:8000/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || '返答が取得できませんでした。';
    setChatLog(prev => [...prev, { sender: target.name, text: reply }]);

    for (const r of responses.filter(r => r.name !== selected)) {
      const base = (philosopherPrompts[r.name] || '').replace('{{concern}}', concern);
      const counterPrompt = `${base}\n\n以下は${target.name}の意見です：\n「${target.text}」\n\nこれに対して、あなた自身の立場から反対意見を述べてください。\n※返答は2〜3行に簡潔にまとめてください。`;

      try {
        const res = await fetch('http://localhost:8000/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: counterPrompt }),
        });
        const data = await res.json();
        const counter = data.candidates?.[0]?.content?.parts?.[0]?.text || '反論が取得できませんでした。';
        setChatLog(prev => [...prev, { sender: r.name, text: counter }]);
        await new Promise(r => setTimeout(r, 500));
      } catch {
        setChatLog(prev => [...prev, { sender: r.name, text: '反論中にエラーが発生しました。' }]);
      }
    }

    const others = responses.filter(r => r.name !== selected).map(r => r.name).join('と');
    setChatLog(prev => [...prev, {
      sender: '鳥',
      text: `${target.name}の考えをふまえて深掘りされたね。\nでも${others}は異なる立場から反論してきたよ。\nさて、ここまで聞いて、君はどう思った？`
    }]);

    setTimeout(() => setShowOpinionSelector(true), 500);
  };

  return {
    chatLog,
    loading,
    showOpinionSelector,
    responses,
    handleOpinionSubmit,
  };
}
