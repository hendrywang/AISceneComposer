// 紧凑 JSON:把「纯基本类型」数组(size/pos/footprint/tags…)折叠成单行,
// 含对象的数组(parts)仍展开 → meta.json 既规整又一看就懂。
export function compactJson(obj: unknown): string {
  const s = JSON.stringify(obj, null, 2);
  // 匹配最内层、不含括号/花括号(即只含数字/字符串)的数组,折叠成单行
  return s.replace(/\[\n\s*([^[\]{}]+?)\n\s*\]/g, (_m, inner: string) => {
    const items = inner
      .split(/,\s*\n\s*/)
      .map((x) => x.trim())
      .filter(Boolean);
    return '[' + items.join(', ') + ']';
  });
}
