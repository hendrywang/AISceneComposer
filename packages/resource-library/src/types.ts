/**
 * 资源库的全部类型契约。纯数据,不依赖 React / three。
 *
 * 心智模型:一个「模型」= 库面板里的一张卡片(ModelDef)。
 *   - 改一个模型 = 改一条数据;
 *   - 新增一个模型 = 在 models/ 里对应文件加一条;
 *   - 新增一个类别 = 加一个 models/*.ts 并在 models/index.ts 汇总。
 * 这里没有任何渲染代码 —— 渲染由前端 editor/ModelView 按 source.kind 分发。
 */

/** 模型在编辑器里的角色:演员(可摆姿势)/ 道具 / 环境(房间,单例) */
export type ModelType = 'actor' | 'prop' | 'environment';

/** 房间外壳尺寸(虚拟布景:单面内向反向盒)。environments 模型与 RoomShell 渲染共用。 */
export const RW = 6; // 宽 (x)
export const RH = 3; // 高 (y)
export const RD = 6; // 深 (z)

/** 图元部件:一个 box(默认),或单面朝内薄片(flat,门窗挂饰用)。部件原点在脚底(y=0)。 */
export interface Part {
  /** [宽, 高, 深];flat 时取 [宽, 高] */
  size: [number, number, number];
  /** 部件中心相对底部中心 */
  pos: [number, number, number];
  /** 覆盖模型默认色 */
  color?: string;
  /** 单面朝 +Z 的平面(经各自 rotationY 后朝室内;背面剔除 → 随近墙一起隐藏) */
  flat?: boolean;
}

/** 人体参数:用倍数控制体型,实现高矮胖瘦 / 男女 / 儿童等变体 */
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

/** 关节名(程序化人体的可旋转关节) */
export type JointName =
  | 'hipL'
  | 'hipR'
  | 'kneeL'
  | 'kneeR'
  | 'shoulderL'
  | 'shoulderR'
  | 'elbowL'
  | 'elbowR'
  | 'spine'
  | 'neck';

/** 一个姿势 = 若干关节的欧拉角(弧度);未列出的关节为 [0,0,0](默认直立) */
export type Pose = Partial<Record<JointName, [number, number, number]>>;

/**
 * 模型来源:决定 ModelView 怎么渲染。新增一种渲染方式 = 在这里加一个 kind,并在
 * editor/ModelView 加一条分支。
 *   - human:       参数化人体(Mannequin)
 *   - primitive:   若干 box/薄片拼装(PrimitiveModel),自包含、可序列化
 *   - roomShell:   单面内向反向盒房间(RoomShell)
 *   - outdoorShell:室外环境(OutdoorShell):大地面 + 渐变天空穹 + 可选远景剪影
 *   - gltf:        真实 3D 资产(GltfModel);poses 为「姿势名 → 该姿势的静态 glTF url」(D4)
 */
export type ModelSource =
  | { kind: 'human'; body: BodyParams }
  | { kind: 'primitive'; parts: Part[] }
  | { kind: 'roomShell'; variant: 'plain' | 'balcony' }
  | {
      kind: 'outdoorShell';
      /** 地面质感(取色);默认 grass */
      ground?: 'grass' | 'stone' | 'paving' | 'sand';
      /** 天空调性(渐变 + 室外光);默认 day */
      sky?: 'day' | 'dusk' | 'night' | 'overcast';
      /** 远景剪影(纵深/地平线参照);默认 none */
      backdrop?: 'none' | 'cityline' | 'treeline' | 'wall';
    }
  /**
   * 真实 3D 资产。`file` / `poses` 的值是「服务相对路径」,如 `models/<id>/model.glb`
   * (生成器从模型文件夹展开而来);前端 `resolveModelUri()` 把它解析成可加载 URI
   * (dev = /models/...,prod = Cloud Storage)。poses:姿势名 → 该姿势的静态 glTF(D4)。
   */
  | { kind: 'gltf'; file: string; poses?: Record<string, string> };

/** 许可与署名。gltf 真实资产**必填**(开源再分发的命脉);本仓自产的图元可省。 */
export interface ModelLicense {
  /** 如 'CC0' / 'CC-BY-4.0' / 'Apache-2.0' */
  license: string;
  /** 来源,如 'Kenney' / 'Poly Haven' / 'original' */
  source?: string;
  author?: string;
  /** 写进 CREDITS 的署名文本 */
  attribution?: string;
}

/** 一个模型 = 库面板的一张卡片 + 怎么渲染 + 取景尺寸。这是贡献者要填的唯一结构(一个 meta.json)。 */
export interface ModelDef {
  /** 全局唯一,kebab-case,稳定(场景/存档按此引用,勿随意改名) */
  id: string;
  /** 显示名 */
  name: string;
  type: ModelType;
  /** 库面板的分类 Tab(如「家具」);改它即换分组 */
  category: string;
  /** 搜索/筛选标签(可选) */
  tags?: string[];
  /** 道具默认色(part 未单独指定颜色时用) */
  defaultColor?: string;
  /** 取景/选择圈尺寸 [宽 x, 深 z];human 可省 → 用默认 [0.55, 0.4] */
  footprint?: [number, number];
  /** 取景高度;human 可省 → 用 body.height */
  height?: number;
  /** 许可/署名;gltf 必填 */
  license?: ModelLicense;
  source: ModelSource;
}

/** 场景预设里的一次摆位 */
export interface Placement {
  /** 引用任意 CATALOG 条目的 id */
  modelId: string;
  position: [number, number, number];
  rotationY?: number;
  /** 仅 actor:预摆姿势(POSES 的 key);省略 = 'stand' */
  poseId?: string;
  /** 仅 actor:固定配色序号(ACTOR_COLORS 下标),用于区分身份;省略 = 按出场顺序自动轮换 */
  colorIndex?: number;
}

/** 场景预设 = 房间壳 + 一组家具/门窗摆位 */
export interface ScenePreset {
  id: string;
  name: string;
  placements: Placement[];
}
