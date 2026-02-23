export interface Prize {
  id: number;
  text: string;
  color: string;
  probability: number;
  isSpecial?: boolean;
  isZonk?: boolean;
  textColor?: string;
  glowColor?: string;
}

// ZONK: 85%
// Others: 15% / 8 = 0.01875 each
const OTHER_PROB = 0.15 / 8;

export const PRIZES: Prize[] = [
  { id: 1, text: "500 Baht", color: "#1A1A1A", textColor: "#F7E7CE", glowColor: "rgba(247, 231, 206, 0.4)", probability: OTHER_PROB },
  { id: 2, text: "1000 Baht", color: "#FDFBF7", textColor: "#0E0F12", glowColor: "rgba(212, 175, 55, 0.3)", probability: OTHER_PROB },
  { id: 3, text: "500 Baht", color: "#1A1A1A", textColor: "#F7E7CE", glowColor: "rgba(247, 231, 206, 0.4)", probability: OTHER_PROB },
  { id: 4, text: "1500 Baht", color: "#FDFBF7", textColor: "#0E0F12", glowColor: "rgba(212, 175, 55, 0.3)", probability: OTHER_PROB },
  { id: 5, text: "100$ (SPECIAL)", color: "#D4AF37", textColor: "#000000", glowColor: "rgba(255, 255, 255, 0.6)", probability: OTHER_PROB, isSpecial: true },
  { id: 6, text: "2000 Baht", color: "#FDFBF7", textColor: "#0E0F12", glowColor: "rgba(212, 175, 55, 0.3)", probability: OTHER_PROB },
  { id: 7, text: "ZONK", color: "#450a0a", textColor: "#F7E7CE", glowColor: "rgba(255, 0, 0, 0.3)", probability: 0.85, isZonk: true },
  { id: 8, text: "1000 Baht", color: "#FDFBF7", textColor: "#0E0F12", glowColor: "rgba(212, 175, 55, 0.3)", probability: OTHER_PROB },
  { id: 9, text: "1500 Baht", color: "#1A1A1A", textColor: "#F7E7CE", glowColor: "rgba(247, 231, 206, 0.4)", probability: OTHER_PROB },
];
