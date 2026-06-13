/** 画幅比例 + 预览框尺寸推导 —— PreviewMount(画布)与 InspectorPanel(spacer)共用,保证对齐一致。 */

export const RATIOS: { id: string; w: number; h: number }[] = [
  { id: '16:9', w: 16, h: 9 },
  { id: '4:3', w: 4, h: 3 },
  { id: '1:1', w: 1, h: 1 },
  { id: '3:4', w: 3, h: 4 },
  { id: '9:16', w: 9, h: 16 },
];

export const RATIO_IDS = RATIOS.map((r) => r.id);

/** 由画幅 id(底图存在时用底图比例)+ 长边像素,推出预览框宽高与宽高比。 */
export function previewBox(
  aspectId: string,
  bgImageUrl: string | null,
  bgAspect: number | null,
  longEdge: number,
) {
  const ratio = RATIOS.find((r) => r.id === aspectId) ?? RATIOS[0]!;
  const ar = bgImageUrl && bgAspect ? bgAspect : ratio.w / ratio.h;
  const boxW = ar >= 1 ? longEdge : Math.round(longEdge * ar);
  const boxH = ar >= 1 ? Math.round(longEdge / ar) : longEdge;
  return { boxW, boxH, ar };
}
