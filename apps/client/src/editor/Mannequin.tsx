import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import * as THREE from 'three';
import { POSES, type JointName } from './poses';

/** 人体参数:用倍数控制体型,实现高矮胖瘦/男女/儿童等变体 */
export interface BodyParams {
  height: number; // 身高 m
  build: number; // 围度(胖瘦)倍数:0.8 瘦 ~ 1.4 胖
  shoulder: number; // 肩宽倍数
  hip: number; // 髋宽倍数
  head: number; // 头大小倍数(儿童偏大)
  hair?: string; // 发色(可选)
  hairStyle?: 'short' | 'long'; // 发型:短发 / 长发(默认短)
  bust?: number; // 胸部大小(女性特征;省略/0 = 平)
}

function proportions(b: BodyParams) {
  const H = b.height;
  return {
    H,
    hip: 0.52 * H,
    thigh: 0.26 * H,
    shin: 0.26 * H,
    torso: 0.28 * H,
    neck: 0.03 * H,
    headR: 0.075 * H * b.head,
    torsoW: 0.27 * H * b.shoulder,
    torsoD: 0.17 * H * b.build,
    shoulderX: 0.16 * H * b.shoulder,
    hipX: 0.085 * H * b.hip,
    upperArm: 0.16 * H,
    lowerArm: 0.15 * H,
    armW: 0.055 * H * b.build,
    legW: 0.08 * H * b.build,
    footLen: 0.14 * H,
  };
}

/** 一段肢体:盒子从关节(原点)向下延伸 length;末端再挂下一关节(children) */
function Segment({
  length,
  w,
  color,
  rotation,
  children,
}: {
  length: number;
  w: number;
  color: string;
  rotation: [number, number, number];
  children?: ReactNode;
}) {
  return (
    <group rotation={rotation}>
      <mesh position={[0, -length / 2, 0]}>
        <boxGeometry args={[w, length, w]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <group position={[0, -length, 0]}>{children}</group>
    </group>
  );
}

/**
 * 程序化人体代理:由图元 + 关节层级组成,姿势靠关节旋转(前向运动学)。
 * **自动落地**:渲染后用包围盒量出最低点,整体平移到脚底=本地 y=0。
 * 这样任意姿势(站/坐/走…)都脚着地,无需逐姿势手调高度。
 */
export function Mannequin({
  body,
  pose,
  color,
}: {
  body: BodyParams;
  pose: string;
  color: string;
}) {
  const p = proportions(body);
  const P = POSES[pose] ?? {};
  const j = (n: JointName): [number, number, number] => P[n] ?? [0, 0, 0];

  const figureRef = useRef<THREE.Group>(null);
  const [offY, setOffY] = useState(0);

  useLayoutEffect(() => {
    const g = figureRef.current;
    if (!g) return;
    const box = new THREE.Box3().setFromObject(g);
    // box.min.y = 本地最低点 + 当前 offY;令最低点对齐到 0 → 新 offY = 旧 offY - box.min.y
    if (Number.isFinite(box.min.y) && Math.abs(box.min.y) > 1e-4) {
      setOffY((prev) => prev - box.min.y);
    }
    // 仅在体型/姿势变化时重算(位置/旋转不影响竖直落地)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pose, body.height, body.build, body.shoulder, body.hip, body.head]);

  const foot = (
    <mesh position={[0, -0.03, p.footLen / 2 - p.legW / 2]}>
      <boxGeometry args={[p.legW, 0.06, p.footLen]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );

  return (
    <group position={[0, offY, 0]}>
      <group ref={figureRef}>
        {/* 右腿 / 左腿 */}
        <group position={[p.hipX, p.hip, 0]}>
          <Segment length={p.thigh} w={p.legW} color={color} rotation={j('hipR')}>
            <Segment length={p.shin} w={p.legW * 0.9} color={color} rotation={j('kneeR')}>
              {foot}
            </Segment>
          </Segment>
        </group>
        <group position={[-p.hipX, p.hip, 0]}>
          <Segment length={p.thigh} w={p.legW} color={color} rotation={j('hipL')}>
            <Segment length={p.shin} w={p.legW * 0.9} color={color} rotation={j('kneeL')}>
              {foot}
            </Segment>
          </Segment>
        </group>

        {/* 躯干 → 颈头 + 双臂 */}
        <group position={[0, p.hip, 0]} rotation={j('spine')}>
          <mesh position={[0, p.torso / 2, 0]}>
            <boxGeometry args={[p.torsoW, p.torso, p.torsoD]} />
            <meshStandardMaterial color={color} />
          </mesh>

          {/* 胸部(女性特征) */}
          {body.bust ? (
            <>
              <mesh position={[p.torsoW * 0.22, p.torso * 0.64, p.torsoD * 0.5]}>
                <sphereGeometry args={[0.06 * p.H * body.bust, 12, 12]} />
                <meshStandardMaterial color={color} />
              </mesh>
              <mesh position={[-p.torsoW * 0.22, p.torso * 0.64, p.torsoD * 0.5]}>
                <sphereGeometry args={[0.06 * p.H * body.bust, 12, 12]} />
                <meshStandardMaterial color={color} />
              </mesh>
            </>
          ) : null}

          <group position={[0, p.torso, 0]}>
            <group rotation={j('neck')}>
              <mesh position={[0, p.neck + p.headR, 0]}>
                <sphereGeometry args={[p.headR, 16, 16]} />
                <meshStandardMaterial color={color} />
              </mesh>
              {body.hair && (
                <>
                  {/* 顶部头发 */}
                  <mesh position={[0, p.neck + p.headR * 1.5, -p.headR * 0.1]}>
                    <boxGeometry args={[p.headR * 2.1, p.headR * 0.9, p.headR * 2.1]} />
                    <meshStandardMaterial color={body.hair} />
                  </mesh>
                  {/* 长发:脑后垂至肩 */}
                  {body.hairStyle === 'long' && (
                    <mesh position={[0, p.neck + p.headR * 0.4, -p.headR * 0.78]}>
                      <boxGeometry args={[p.headR * 1.9, p.headR * 3.2, p.headR * 0.7]} />
                      <meshStandardMaterial color={body.hair} />
                    </mesh>
                  )}
                </>
              )}
            </group>

            <group position={[p.shoulderX, -0.02 * p.H, 0]}>
              <Segment length={p.upperArm} w={p.armW} color={color} rotation={j('shoulderR')}>
                <Segment length={p.lowerArm} w={p.armW * 0.9} color={color} rotation={j('elbowR')} />
              </Segment>
            </group>
            <group position={[-p.shoulderX, -0.02 * p.H, 0]}>
              <Segment length={p.upperArm} w={p.armW} color={color} rotation={j('shoulderL')}>
                <Segment length={p.lowerArm} w={p.armW * 0.9} color={color} rotation={j('elbowL')} />
              </Segment>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}
