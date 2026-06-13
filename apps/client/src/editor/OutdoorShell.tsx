import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useEditor } from '../store/editorStore';

type Ground = 'grass' | 'stone' | 'paving' | 'sand';
type Sky = 'day' | 'dusk' | 'night' | 'overcast';
type Backdrop = 'none' | 'cityline' | 'treeline' | 'wall';

// 渲染常量(与 SceneLighting 的室外调性同源)。地面取色 + 天空顶/地平线渐变色。
const GROUND_C: Record<Ground, string> = {
  grass: '#5f7a43',
  stone: '#9a948a',
  paving: '#b8b2a6',
  sand: '#cdbd92',
};
const SKY_C: Record<Sky, { top: string; horizon: string }> = {
  day: { top: '#5a8fc7', horizon: '#cfe2f2' },
  dusk: { top: '#3a3a6a', horizon: '#f0b07a' },
  night: { top: '#0b1020', horizon: '#2a3550' },
  overcast: { top: '#9aa6ad', horizon: '#d8dde0' },
};
const SKY_R = 40;

/** 渐变天空穹:反向球(BackSide)+ 顶点色竖直渐变。用顶点色而非 ShaderMaterial,避免 sRGB 输出色管坑。 */
function SkyDome({ sky }: { sky: Sky }) {
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(SKY_R, 32, 16);
    const { top, horizon } = SKY_C[sky] ?? SKY_C.day;
    const cTop = new THREE.Color(top);
    const cHor = new THREE.Color(horizon);
    const pos = g.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const h = Math.min(1, Math.max(0, (pos.getY(i) / SKY_R) * 0.5 + 0.5));
      tmp.copy(cHor).lerp(cTop, Math.pow(h, 0.55));
      colors[i * 3] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return g;
  }, [sky]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} renderOrder={-1} frustumCulled={false}>
      <meshBasicMaterial vertexColors side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

/** 远景剪影:粗模盒子环,给纵深/地平线参照(不求写实,只为构图)。 */
function Backdrop({ kind }: { kind: Backdrop }) {
  const items = useMemo(() => {
    const out: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [];
    if (kind === 'cityline') {
      const colors = ['#2f3640', '#39414d', '#2a3038'];
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * Math.PI * 2;
        const hgt = 3 + ((i * 37) % 9); // 伪随机高度 3..11(不用 Math.random)
        out.push({
          pos: [Math.cos(a) * 22, hgt / 2, Math.sin(a) * 22],
          size: [2.4, hgt, 2.4],
          color: colors[i % 3]!,
        });
      }
    } else if (kind === 'treeline') {
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2;
        out.push({
          pos: [Math.cos(a) * 18, 1.6, Math.sin(a) * 18],
          size: [3, 3.2, 3],
          color: i % 2 ? '#3c5a32' : '#47683a',
        });
      }
    }
    return out;
  }, [kind]);

  if (kind === 'none') return null;
  if (kind === 'wall') {
    return (
      <mesh position={[0, 1.5, -16]}>
        <boxGeometry args={[40, 3, 0.6]} />
        <meshStandardMaterial color="#8c8378" />
      </mesh>
    );
  }
  return (
    <group>
      {items.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color={b.color} />
        </mesh>
      ))}
    </group>
  );
}

/**
 * 室外环境壳:大地面 + 渐变天空穹 + 可选远景剪影。作为 environment 模型经 ModelView 渲染,
 * 主视图与预览/导出画布天然一致(WYSIWYG)。上传参考照片时隐藏天空/剪影(让照片当背景),保留地面供人物落脚。
 */
export function OutdoorShell({
  ground = 'grass',
  sky = 'day',
  backdrop = 'none',
}: {
  ground?: Ground;
  sky?: Sky;
  backdrop?: Backdrop;
}) {
  const hideSky = useEditor((s) => !!s.bgImageUrl);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color={GROUND_C[ground] ?? GROUND_C.grass} />
      </mesh>
      {!hideSky && <SkyDome sky={sky} />}
      {!hideSky && <Backdrop kind={backdrop} />}
    </group>
  );
}
