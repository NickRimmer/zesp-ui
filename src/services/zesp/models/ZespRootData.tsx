export type ZespRootData = {
  on: 0 | 1,
  R: number,
  G: number,
  B: number,
  // X: number,
  // Y: number,
  level: number,
  // rgb_bgr: number,
  sound: {
    volume: number,
    current_path: string,
    play: "OFF" | "ON"
  },
  radio: string[],
}
