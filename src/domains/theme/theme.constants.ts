import type { BubbleTheme } from './theme.types';

export const DEFAULT_THEME_ID = 'sky-pop';

export const BUBBLE_THEMES: BubbleTheme[] = [
  {
    id: 'sky-pop',
    name: '스카이 팝',
    description: '밝은 하늘색 배경에 선명한 청록 뽁뽁이',
    swatches: ['#f7fbff', '#eaf7ff', '#76d7f2', '#ff7aa2'],
    colors: {
      appBackground: '#f7fbff',
      appText: '#1f2933',
      boardBackground: '#eaf7ff',
      boardBorder: '#bae6fd',
      bubbleBackground: '#76d7f2',
      bubbleBorder: '#22a6c7',
      bubbleHighlight: 'rgba(255,255,255,0.78)',
      bubbleShadow:
        'inset 0 7px 14px rgba(255,255,255,0.72), inset 0 -8px 16px rgba(14,116,144,0.22), 0 8px 18px rgba(8,145,178,0.24)',
      poppedBackground: '#d9e2ec',
      poppedBorder: '#bcccdc',
      particle: '#ff7aa2',
      boxBackground: '#fff7d6',
      boxBorder: '#f2b84b',
      boxText: '#5f3b00',
      feverAppBackground: '#fff8e8',
      feverBoardBackground: '#fff1c7',
      feverBoardBorder: '#f6c453',
      feverBubbleBackground: '#ffd166',
      feverBubbleBorder: '#d99000',
      feverParticle: '#f59e0b',
    },
  },
  {
    id: 'jelly-mint',
    name: '젤리 민트',
    description: '민트 젤리처럼 통통한 초록빛 테마',
    swatches: ['#f2fff9', '#d8f8ec', '#45d0a8', '#ff7fa8'],
    colors: {
      appBackground: '#f2fff9',
      appText: '#1f2933',
      boardBackground: '#d8f8ec',
      boardBorder: '#7be0c4',
      bubbleBackground: '#45d0a8',
      bubbleBorder: '#12936f',
      bubbleHighlight: 'rgba(255,255,255,0.76)',
      bubbleShadow:
        'inset 0 7px 14px rgba(255,255,255,0.72), inset 0 -8px 16px rgba(4,120,87,0.24), 0 8px 18px rgba(6,148,115,0.24)',
      poppedBackground: '#d8eee6',
      poppedBorder: '#a7d8c9',
      particle: '#ff7fa8',
      boxBackground: '#fff4c2',
      boxBorder: '#e7a832',
      boxText: '#5e4300',
      feverAppBackground: '#fff8df',
      feverBoardBackground: '#ffedaa',
      feverBoardBorder: '#f0b429',
      feverBubbleBackground: '#ffc857',
      feverBubbleBorder: '#c47f00',
      feverParticle: '#f59e0b',
    },
  },
  {
    id: 'candy-pop',
    name: '캔디 팝',
    description: '핑크와 블루가 섞인 달콤한 캔디 테마',
    swatches: ['#fff6fb', '#ffe1ef', '#ff79b0', '#51b7ff'],
    colors: {
      appBackground: '#fff6fb',
      appText: '#1f2933',
      boardBackground: '#ffe1ef',
      boardBorder: '#ff9cc5',
      bubbleBackground: '#ff79b0',
      bubbleBorder: '#d62f78',
      bubbleHighlight: 'rgba(255,255,255,0.76)',
      bubbleShadow:
        'inset 0 7px 14px rgba(255,255,255,0.72), inset 0 -8px 16px rgba(190,24,93,0.22), 0 8px 18px rgba(219,39,119,0.23)',
      poppedBackground: '#ead5df',
      poppedBorder: '#d8a9be',
      particle: '#51b7ff',
      boxBackground: '#fff0b8',
      boxBorder: '#f1a935',
      boxText: '#663700',
      feverAppBackground: '#fff6dd',
      feverBoardBackground: '#ffeba6',
      feverBoardBorder: '#f0b429',
      feverBubbleBackground: '#ffc857',
      feverBubbleBorder: '#c47f00',
      feverParticle: '#f59e0b',
    },
  },
  {
    id: 'night-glow',
    name: '나이트 글로우',
    description: '어두운 배경에서 뽁뽁이가 또렷하게 빛나는 테마',
    swatches: ['#131a2a', '#1f2a44', '#68e1fd', '#ffd166'],
    colors: {
      appBackground: '#131a2a',
      appText: '#f8fafc',
      boardBackground: '#1f2a44',
      boardBorder: '#46617f',
      bubbleBackground: '#68e1fd',
      bubbleBorder: '#22b8cf',
      bubbleHighlight: 'rgba(255,255,255,0.74)',
      bubbleShadow:
        'inset 0 7px 14px rgba(255,255,255,0.68), inset 0 -8px 16px rgba(8,47,73,0.34), 0 8px 22px rgba(104,225,253,0.28)',
      poppedBackground: '#334155',
      poppedBorder: '#475569',
      particle: '#ffd166',
      boxBackground: '#2b3552',
      boxBorder: '#ffd166',
      boxText: '#fff4c2',
      feverAppBackground: '#271d08',
      feverBoardBackground: '#47350d',
      feverBoardBorder: '#f59e0b',
      feverBubbleBackground: '#ffd166',
      feverBubbleBorder: '#f59e0b',
      feverParticle: '#ffe8a3',
    },
  },
];

export function getBubbleTheme(themeId: string) {
  return (
    BUBBLE_THEMES.find((theme) => theme.id === themeId) ??
    BUBBLE_THEMES.find((theme) => theme.id === DEFAULT_THEME_ID) ??
    BUBBLE_THEMES[0]
  );
}
