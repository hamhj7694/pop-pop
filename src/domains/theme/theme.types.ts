export interface BubbleThemeColors {
  appBackground: string;
  appText: string;
  boardBackground: string;
  boardBorder: string;
  bubbleBackground: string;
  bubbleBorder: string;
  bubbleHighlight: string;
  bubbleShadow: string;
  poppedBackground: string;
  poppedBorder: string;
  particle: string;
  boxBackground: string;
  boxBorder: string;
  boxText: string;
  feverAppBackground: string;
  feverBoardBackground: string;
  feverBoardBorder: string;
  feverBubbleBackground: string;
  feverBubbleBorder: string;
  feverParticle: string;
}

export interface BubbleTheme {
  id: string;
  name: string;
  description: string;
  swatches: string[];
  colors: BubbleThemeColors;
}
