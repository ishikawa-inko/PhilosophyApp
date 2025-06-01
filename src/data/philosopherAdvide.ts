// src/data/philosopherAdvice.ts
import socrates from '../assets/photo/sokuratesu.png';
import nietzsche from '../assets/photo/ni-tye.png';
import kant from '../assets/photo/kanto.png';
import bentham from '../assets/photo/bennsamu.png';
import epicurus from '../assets/photo/epikurosu.png';
import sartre from '../assets/photo/sarutoru.png';
import laozi from '../assets/photo/rousi.png';

export const philosopherAdvices: Record<string, { advice: string; icon: string }> = {
  ソクラテス: {
    advice: '無知の自覚こそ、知のはじまりじゃ。',
    icon: socrates,
  },
  ニーチェ: {
    advice: 'お前が地獄を見てきたなら、それは力になる。',
    icon: nietzsche,
  },
  カント: {
    advice: '理性によって道を切り開け。',
    icon: kant,
  },
  ベンサム: {
    advice: '最大多数の最大幸福をめざせ！',
    icon: bentham,
  },
  エピクロス: {
    advice: '静かな喜びこそ、最高の幸せだよ。',
    icon: epicurus,
  },
  サルトル: {
    advice: '自由には責任が伴う。それが人間の本質だ。',
    icon: sartre,
  },
  老子: {
    advice: '無為自然に従えば、道はひらける。',
    icon: laozi,
  },
};
