// ⚠️ 自动生成,请勿手改。改模型 = 改 models/<id>/meta.json,然后 `pnpm gen`。
import type { ModelDef } from '../types';

export const CATALOG: ModelDef[] = [
  {
    "id": "kid",
    "name": "儿童",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.2,
        "build": 0.95,
        "shoulder": 0.9,
        "hip": 0.95,
        "head": 1.25,
        "hair": "#2a2a2a"
      }
    }
  },
  {
    "id": "man-heavy",
    "name": "壮硕男",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.75,
        "build": 1.35,
        "shoulder": 1.15,
        "hip": 1.1,
        "head": 1,
        "hair": "#2a2a2a"
      }
    }
  },
  {
    "id": "man-slim",
    "name": "瘦高男",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.78,
        "build": 0.82,
        "shoulder": 1,
        "hip": 0.9,
        "head": 1,
        "hair": "#2a2a2a"
      }
    }
  },
  {
    "id": "man-tall",
    "name": "高个男",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.85,
        "build": 1,
        "shoulder": 1.1,
        "hip": 0.95,
        "head": 1,
        "hair": "#2a2a2a"
      }
    }
  },
  {
    "id": "woman",
    "name": "女性",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.66,
        "build": 0.95,
        "shoulder": 0.9,
        "hip": 1.05,
        "head": 1,
        "hair": "#3a2a1a",
        "hairStyle": "long",
        "bust": 0.55
      }
    }
  },
  {
    "id": "woman-curvy",
    "name": "丰满女",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.64,
        "build": 1.15,
        "shoulder": 0.88,
        "hip": 1.2,
        "head": 1,
        "hair": "#3a2a1a",
        "hairStyle": "long",
        "bust": 0.75
      }
    }
  },
  {
    "id": "bed",
    "name": "床",
    "type": "prop",
    "category": "家具",
    "defaultColor": "#b08d57",
    "footprint": [1.5, 2.1],
    "height": 0.6,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.5, 0.3, 2.1],
          "pos": [0, 0.15, 0],
          "color": "#b08d57"
        },
        {
          "size": [1.4, 0.18, 1.95],
          "pos": [0, 0.39, 0],
          "color": "#d9d2c5"
        },
        {
          "size": [1.2, 0.12, 0.35],
          "pos": [0, 0.5, -0.75],
          "color": "#eeeae0"
        }
      ]
    }
  },
  {
    "id": "blackboard",
    "name": "黑板",
    "type": "prop",
    "category": "家具",
    "footprint": [2, 0.2],
    "height": 1.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2, 1, 0.05],
          "pos": [0, 1.3, 0],
          "color": "#1f3b2f"
        },
        {
          "size": [0.06, 1.3, 0.06],
          "pos": [-0.95, 0.65, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.06, 1.3, 0.06],
          "pos": [0.95, 0.65, 0],
          "color": "#b08d57"
        }
      ]
    }
  },
  {
    "id": "bookshelf",
    "name": "书架",
    "type": "prop",
    "category": "家具",
    "footprint": [0.9, 0.3],
    "height": 1.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.9, 1.8, 0.3],
          "pos": [0, 0.9, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.82, 0.03, 0.26],
          "pos": [0, 0.6, 0],
          "color": "#8a6e44"
        },
        {
          "size": [0.82, 0.03, 0.26],
          "pos": [0, 1.2, 0],
          "color": "#8a6e44"
        }
      ]
    }
  },
  {
    "id": "chair",
    "name": "椅子",
    "type": "prop",
    "category": "家具",
    "footprint": [0.45, 0.45],
    "height": 0.95,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.45, 0.06, 0.45],
          "pos": [0, 0.45, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.45, 0.5, 0.06],
          "pos": [0, 0.7, -0.2],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.45, 0.05],
          "pos": [-0.18, 0.225, -0.18],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.45, 0.05],
          "pos": [0.18, 0.225, -0.18],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.45, 0.05],
          "pos": [-0.18, 0.225, 0.18],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.45, 0.05],
          "pos": [0.18, 0.225, 0.18],
          "color": "#b08d57"
        }
      ]
    }
  },
  {
    "id": "coffeeTable",
    "name": "茶几",
    "type": "prop",
    "category": "家具",
    "footprint": [1, 0.55],
    "height": 0.45,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1, 0.05, 0.55],
          "pos": [0, 0.4, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.4, 0.05],
          "pos": [-0.45, 0.2, -0.23],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.4, 0.05],
          "pos": [0.45, 0.2, -0.23],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.4, 0.05],
          "pos": [-0.45, 0.2, 0.23],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.4, 0.05],
          "pos": [0.45, 0.2, 0.23],
          "color": "#b08d57"
        }
      ]
    }
  },
  {
    "id": "desk",
    "name": "书桌",
    "type": "prop",
    "category": "家具",
    "footprint": [1.2, 0.6],
    "height": 0.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.2, 0.05, 0.6],
          "pos": [0, 0.75, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.75, 0.05],
          "pos": [-0.55, 0.375, -0.27],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.75, 0.05],
          "pos": [0.55, 0.375, -0.27],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.75, 0.05],
          "pos": [-0.55, 0.375, 0.27],
          "color": "#b08d57"
        },
        {
          "size": [0.05, 0.75, 0.05],
          "pos": [0.55, 0.375, 0.27],
          "color": "#b08d57"
        }
      ]
    }
  },
  {
    "id": "lamp",
    "name": "落地灯",
    "type": "prop",
    "category": "家具",
    "footprint": [0.32, 0.32],
    "height": 1.7,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.3, 0.05, 0.3],
          "pos": [0, 0.025, 0],
          "color": "#1f2937"
        },
        {
          "size": [0.05, 1.5, 0.05],
          "pos": [0, 0.75, 0],
          "color": "#1f2937"
        },
        {
          "size": [0.32, 0.25, 0.32],
          "pos": [0, 1.6, 0],
          "color": "#f5e9c8"
        }
      ]
    }
  },
  {
    "id": "nightstand",
    "name": "床头柜",
    "type": "prop",
    "category": "家具",
    "footprint": [0.45, 0.4],
    "height": 0.5,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.45, 0.5, 0.4],
          "pos": [0, 0.25, 0],
          "color": "#b08d57"
        }
      ]
    }
  },
  {
    "id": "pendant",
    "name": "吊灯",
    "type": "prop",
    "category": "家具",
    "footprint": [0.5, 0.5],
    "height": 2.95,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.03, 0.62, 0.03],
          "pos": [0, 2.64, 0],
          "color": "#1f2937"
        },
        {
          "size": [0.48, 0.26, 0.48],
          "pos": [0, 2.32, 0],
          "color": "#f3e7c4"
        },
        {
          "size": [0.3, 0.06, 0.3],
          "pos": [0, 2.18, 0],
          "color": "#fff4d6"
        }
      ]
    }
  },
  {
    "id": "plant",
    "name": "绿植",
    "type": "prop",
    "category": "家具",
    "footprint": [0.6, 0.6],
    "height": 1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.3, 0.3, 0.3],
          "pos": [0, 0.15, 0],
          "color": "#8a5a3a"
        },
        {
          "size": [0.6, 0.7, 0.6],
          "pos": [0, 0.65, 0],
          "color": "#3f7d3f"
        }
      ]
    }
  },
  {
    "id": "sample-crate",
    "name": "样例木箱",
    "type": "prop",
    "category": "家具",
    "tags": ["sample", "gltf", "crate"],
    "footprint": [1, 1],
    "height": 1,
    "license": {
      "license": "CC0-1.0",
      "source": "Khronos glTF Sample Assets",
      "author": "Public",
      "attribution": "BoxVertexColors (CC0 1.0 Universal)"
    },
    "source": {
      "kind": "gltf",
      "file": "models/sample-crate/model.glb"
    }
  },
  {
    "id": "sideboard",
    "name": "矮柜",
    "type": "prop",
    "category": "家具",
    "footprint": [1.6, 0.45],
    "height": 0.75,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.6, 0.7, 0.45],
          "pos": [0, 0.35, 0],
          "color": "#b08d57"
        },
        {
          "size": [1.66, 0.05, 0.5],
          "pos": [0, 0.72, 0],
          "color": "#8a6e44"
        },
        {
          "size": [0.5, 0.5, 0.02],
          "pos": [-0.38, 0.35, 0.23],
          "color": "#9a7b4d"
        },
        {
          "size": [0.5, 0.5, 0.02],
          "pos": [0.38, 0.35, 0.23],
          "color": "#9a7b4d"
        }
      ]
    }
  },
  {
    "id": "sofa",
    "name": "沙发",
    "type": "prop",
    "category": "家具",
    "footprint": [1.8, 0.85],
    "height": 0.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.8, 0.4, 0.85],
          "pos": [0, 0.2, 0],
          "color": "#6b7280"
        },
        {
          "size": [1.5, 0.15, 0.7],
          "pos": [0, 0.47, 0.03],
          "color": "#7c8595"
        },
        {
          "size": [1.8, 0.5, 0.2],
          "pos": [0, 0.55, -0.32],
          "color": "#6b7280"
        },
        {
          "size": [0.2, 0.5, 0.85],
          "pos": [-0.8, 0.45, 0],
          "color": "#6b7280"
        },
        {
          "size": [0.2, 0.5, 0.85],
          "pos": [0.8, 0.45, 0],
          "color": "#6b7280"
        }
      ]
    }
  },
  {
    "id": "studentDesk",
    "name": "课桌",
    "type": "prop",
    "category": "家具",
    "footprint": [0.6, 0.45],
    "height": 0.74,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.6, 0.04, 0.45],
          "pos": [0, 0.7, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.04, 0.7, 0.04],
          "pos": [-0.26, 0.35, -0.18],
          "color": "#888"
        },
        {
          "size": [0.04, 0.7, 0.04],
          "pos": [0.26, 0.35, -0.18],
          "color": "#888"
        },
        {
          "size": [0.04, 0.7, 0.04],
          "pos": [-0.26, 0.35, 0.18],
          "color": "#888"
        },
        {
          "size": [0.04, 0.7, 0.04],
          "pos": [0.26, 0.35, 0.18],
          "color": "#888"
        }
      ]
    }
  },
  {
    "id": "tvStand",
    "name": "电视柜",
    "type": "prop",
    "category": "家具",
    "footprint": [1.4, 0.4],
    "height": 1.1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.4, 0.4, 0.4],
          "pos": [0, 0.2, 0],
          "color": "#b08d57"
        },
        {
          "size": [1.1, 0.65, 0.05],
          "pos": [0, 0.75, -0.1],
          "color": "#1f2937"
        }
      ]
    }
  },
  {
    "id": "wardrobe",
    "name": "衣柜",
    "type": "prop",
    "category": "家具",
    "footprint": [1, 0.6],
    "height": 2,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1, 2, 0.6],
          "pos": [0, 1, 0],
          "color": "#b08d57"
        }
      ]
    }
  },
  {
    "id": "door",
    "name": "门",
    "type": "prop",
    "category": "装饰",
    "footprint": [0.95, 0.14],
    "height": 2.05,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [0.95, 2.05, 0],
          "pos": [0, 1.025, 0],
          "color": "#7a5a3a"
        },
        {
          "flat": true,
          "size": [0.82, 1.9, 0],
          "pos": [0, 1.03, 0.01],
          "color": "#8a6a44"
        },
        {
          "flat": true,
          "size": [0.1, 0.1, 0],
          "pos": [0.34, 1, 0.02],
          "color": "#d9c27a"
        }
      ]
    }
  },
  {
    "id": "painting",
    "name": "壁画",
    "type": "prop",
    "category": "装饰",
    "footprint": [1.2, 0.1],
    "height": 1.95,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [1.2, 0.85, 0],
          "pos": [0, 1.5, 0],
          "color": "#6b5036"
        },
        {
          "flat": true,
          "size": [1.05, 0.7, 0],
          "pos": [0, 1.5, 0.01],
          "color": "#8aa9b8"
        }
      ]
    }
  },
  {
    "id": "rug",
    "name": "地毯",
    "type": "prop",
    "category": "装饰",
    "footprint": [2.4, 1.7],
    "height": 0.03,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2.4, 0.03, 1.7],
          "pos": [0, 0.015, 0],
          "color": "#9e6b6b"
        }
      ]
    }
  },
  {
    "id": "wallClock",
    "name": "挂钟",
    "type": "prop",
    "category": "装饰",
    "footprint": [0.5, 0.1],
    "height": 1.95,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [0.52, 0.52, 0],
          "pos": [0, 1.7, 0],
          "color": "#3a3a40"
        },
        {
          "flat": true,
          "size": [0.42, 0.42, 0],
          "pos": [0, 1.7, 0.01],
          "color": "#efece4"
        },
        {
          "flat": true,
          "size": [0.04, 0.18, 0],
          "pos": [0, 1.74, 0.02],
          "color": "#222"
        },
        {
          "flat": true,
          "size": [0.13, 0.04, 0],
          "pos": [0.04, 1.7, 0.02],
          "color": "#222"
        }
      ]
    }
  },
  {
    "id": "wallTV",
    "name": "壁挂电视",
    "type": "prop",
    "category": "装饰",
    "footprint": [1.6, 0.1],
    "height": 1.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [1.6, 0.95, 0],
          "pos": [0, 1.4, 0],
          "color": "#15171c"
        },
        {
          "flat": true,
          "size": [1.5, 0.85, 0],
          "pos": [0, 1.4, 0.01],
          "color": "#2b3340"
        }
      ]
    }
  },
  {
    "id": "window",
    "name": "窗户",
    "type": "prop",
    "category": "装饰",
    "footprint": [1.4, 0.14],
    "height": 2.15,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [1.4, 1.3, 0],
          "pos": [0, 1.5, 0],
          "color": "#cfcabd"
        },
        {
          "flat": true,
          "size": [1.2, 1.1, 0],
          "pos": [0, 1.5, 0.01],
          "color": "#bcd4e6"
        },
        {
          "flat": true,
          "size": [1.24, 0.06, 0],
          "pos": [0, 1.5, 0.02],
          "color": "#cfcabd"
        },
        {
          "flat": true,
          "size": [0.06, 1.12, 0],
          "pos": [0, 1.5, 0.02],
          "color": "#cfcabd"
        }
      ]
    }
  },
  {
    "id": "room",
    "name": "空房间",
    "type": "environment",
    "category": "场景",
    "footprint": [6, 6],
    "height": 3,
    "source": {
      "kind": "roomShell",
      "variant": "plain"
    }
  },
  {
    "id": "roomBalcony",
    "name": "阳台房间",
    "type": "environment",
    "category": "场景",
    "footprint": [6, 6],
    "height": 3,
    "source": {
      "kind": "roomShell",
      "variant": "balcony"
    }
  }
];
