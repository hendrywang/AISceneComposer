// ⚠️ 自动生成,请勿手改。改模型 = 改 models/<id>/meta.json,然后 `pnpm gen`。
import type { ModelDef } from '../types';

export const CATALOG: ModelDef[] = [
  {
    "id": "elder",
    "name": "长者",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.62,
        "build": 1.1,
        "shoulder": 0.95,
        "hip": 1.05,
        "head": 1,
        "hair": "#cfcfcf",
        "hairStyle": "short"
      }
    }
  },
  {
    "id": "guard",
    "name": "卫士",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.9,
        "build": 1.2,
        "shoulder": 1.25,
        "hip": 1,
        "head": 0.98,
        "hair": "#1c1c1c",
        "hairStyle": "short"
      }
    }
  },
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
    "id": "woman-tall",
    "name": "高个女",
    "type": "actor",
    "category": "人物",
    "source": {
      "kind": "human",
      "body": {
        "height": 1.78,
        "build": 0.92,
        "shoulder": 0.95,
        "hip": 1.02,
        "head": 1,
        "hair": "#3a2a1c",
        "hairStyle": "long",
        "bust": 0.55
      }
    }
  },
  {
    "id": "bar-counter",
    "name": "吧台",
    "type": "prop",
    "category": "家具",
    "footprint": [2, 0.6],
    "height": 1.1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2, 1, 0.55],
          "pos": [0, 0.5, -0.02],
          "color": "#4a3324"
        },
        {
          "size": [2.1, 0.08, 0.7],
          "pos": [0, 1.06, 0.02],
          "color": "#8d8a85"
        },
        {
          "size": [1.98, 0.7, 0.02],
          "pos": [0, 0.55, 0.26],
          "color": "#5a4030"
        },
        {
          "size": [2, 0.05, 0.05],
          "pos": [0, 0.15, 0.3],
          "color": "#b8b2a6"
        }
      ]
    }
  },
  {
    "id": "bar-stool",
    "name": "吧凳",
    "type": "prop",
    "category": "家具",
    "footprint": [0.4, 0.4],
    "height": 0.75,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.38, 0.07, 0.38],
          "pos": [0, 0.71, 0],
          "color": "#3a3f47"
        },
        {
          "size": [0.04, 0.68, 0.04],
          "pos": [-0.15, 0.34, -0.15],
          "color": "#8b9197"
        },
        {
          "size": [0.04, 0.68, 0.04],
          "pos": [0.15, 0.34, -0.15],
          "color": "#8b9197"
        },
        {
          "size": [0.04, 0.68, 0.04],
          "pos": [-0.15, 0.34, 0.15],
          "color": "#8b9197"
        },
        {
          "size": [0.04, 0.68, 0.04],
          "pos": [0.15, 0.34, 0.15],
          "color": "#8b9197"
        },
        {
          "size": [0.38, 0.03, 0.38],
          "pos": [0, 0.25, 0],
          "color": "#6f757b"
        }
      ]
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
    "id": "booth",
    "name": "卡座",
    "type": "prop",
    "category": "家具",
    "footprint": [1.6, 0.7],
    "height": 1.2,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.6, 0.18, 0.7],
          "pos": [0, 0.16, 0],
          "color": "#6e4a3a"
        },
        {
          "size": [1.6, 0.16, 0.6],
          "pos": [0, 0.33, 0],
          "color": "#9c6f56"
        },
        {
          "size": [1.6, 0.78, 0.16],
          "pos": [0, 0.81, -0.27],
          "color": "#9c6f56"
        },
        {
          "size": [1.6, 0.08, 0.18],
          "pos": [0, 1.16, -0.26],
          "color": "#7d5641"
        }
      ]
    }
  },
  {
    "id": "cafe-table",
    "name": "咖啡桌",
    "type": "prop",
    "category": "家具",
    "footprint": [0.7, 0.7],
    "height": 0.74,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.68, 0.05, 0.68],
          "pos": [0, 0.715, 0],
          "color": "#c9b79b"
        },
        {
          "size": [0.09, 0.66, 0.09],
          "pos": [0, 0.36, 0],
          "color": "#5a5550"
        },
        {
          "size": [0.4, 0.04, 0.4],
          "pos": [0, 0.02, 0],
          "color": "#46423d"
        }
      ]
    }
  },
  {
    "id": "car-interior",
    "name": "车内",
    "type": "prop",
    "category": "家具",
    "tags": ["车辆"],
    "footprint": [1.7, 2.6],
    "height": 1.4,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.7, 0.06, 2.6],
          "pos": [0, 0.03, 0],
          "color": "#2c2f36"
        },
        {
          "size": [1.7, 0.45, 0.3],
          "pos": [0, 0.7, -1.15],
          "color": "#2c2f36"
        },
        {
          "size": [0.04, 0.4, 0.4],
          "pos": [-0.45, 0.62, -0.85],
          "color": "#1a1c20"
        },
        {
          "size": [0.5, 0.12, 0.55],
          "pos": [-0.45, 0.45, -0.4],
          "color": "#3b3f47"
        },
        {
          "size": [0.5, 0.6, 0.12],
          "pos": [-0.45, 0.8, -0.65],
          "color": "#3b3f47"
        },
        {
          "size": [0.5, 0.12, 0.55],
          "pos": [0.45, 0.45, -0.4],
          "color": "#3b3f47"
        },
        {
          "size": [0.5, 0.6, 0.12],
          "pos": [0.45, 0.8, -0.65],
          "color": "#3b3f47"
        },
        {
          "size": [1.5, 0.12, 0.55],
          "pos": [0, 0.45, 0.75],
          "color": "#3b3f47"
        },
        {
          "size": [1.5, 0.55, 0.12],
          "pos": [0, 0.78, 1],
          "color": "#3b3f47"
        },
        {
          "size": [0.1, 1, 2.4],
          "pos": [-0.85, 0.5, 0],
          "color": "#2c2f36"
        },
        {
          "size": [0.1, 1, 2.4],
          "pos": [0.85, 0.5, 0],
          "color": "#2c2f36"
        },
        {
          "size": [0.08, 0.08, 2.4],
          "pos": [-0.85, 1.36, 0],
          "color": "#1a1c20"
        },
        {
          "size": [0.08, 0.08, 2.4],
          "pos": [0.85, 1.36, 0],
          "color": "#1a1c20"
        },
        {
          "size": [1.7, 0.08, 0.1],
          "pos": [0, 1.36, -1.2],
          "color": "#1a1c20"
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
    "id": "checkout",
    "name": "结账台",
    "type": "prop",
    "category": "家具",
    "footprint": [0.9, 0.6],
    "height": 1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.9, 0.9, 0.6],
          "pos": [0, 0.45, 0],
          "color": "#c2c6cb"
        },
        {
          "size": [0.86, 0.05, 0.5],
          "pos": [0, 0.94, 0.02],
          "color": "#3a4046"
        },
        {
          "size": [0.7, 0.03, 0.3],
          "pos": [-0.05, 0.98, 0.04],
          "color": "#54606b"
        },
        {
          "size": [0.26, 0.16, 0.24],
          "pos": [0.28, 1.05, -0.04],
          "color": "#2b3138"
        },
        {
          "size": [0.2, 0.12, 0.02],
          "pos": [0.28, 1.1, 0.08],
          "color": "#566270"
        },
        {
          "size": [0.06, 0.34, 0.06],
          "pos": [-0.3, 1.14, -0.1],
          "color": "#6b7280"
        },
        {
          "size": [0.12, 0.1, 0.04],
          "pos": [-0.3, 1.28, -0.06],
          "color": "#33373c"
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
    "id": "conference-table",
    "name": "会议桌",
    "type": "prop",
    "category": "家具",
    "footprint": [2.8, 1.2],
    "height": 0.75,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2.8, 0.08, 1.2],
          "pos": [0, 0.71, 0],
          "color": "#6e5a40"
        },
        {
          "size": [0.12, 0.67, 0.9],
          "pos": [-1.1, 0.335, 0],
          "color": "#5a4933"
        },
        {
          "size": [0.12, 0.67, 0.9],
          "pos": [1.1, 0.335, 0],
          "color": "#5a4933"
        },
        {
          "size": [1.9, 0.1, 0.12],
          "pos": [0, 0.2, 0],
          "color": "#4a3c2a"
        }
      ]
    }
  },
  {
    "id": "dais",
    "name": "高台",
    "type": "prop",
    "category": "家具",
    "tags": ["古风"],
    "footprint": [3, 2.2],
    "height": 0.5,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [3, 0.18, 2.2],
          "pos": [0, 0.09, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [2.5, 0.16, 1.8],
          "pos": [0, 0.26, 0],
          "color": "#9c3b2e"
        },
        {
          "size": [2, 0.16, 1.4],
          "pos": [0, 0.42, 0],
          "color": "#b9b2a4"
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
    "id": "dining-table",
    "name": "餐桌",
    "type": "prop",
    "category": "家具",
    "footprint": [1.4, 0.9],
    "height": 0.75,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.4, 0.06, 0.9],
          "pos": [0, 0.72, 0],
          "color": "#b08d57"
        },
        {
          "size": [0.07, 0.69, 0.07],
          "pos": [-0.63, 0.345, -0.39],
          "color": "#8a6e44"
        },
        {
          "size": [0.07, 0.69, 0.07],
          "pos": [0.63, 0.345, -0.39],
          "color": "#8a6e44"
        },
        {
          "size": [0.07, 0.69, 0.07],
          "pos": [-0.63, 0.345, 0.39],
          "color": "#8a6e44"
        },
        {
          "size": [0.07, 0.69, 0.07],
          "pos": [0.63, 0.345, 0.39],
          "color": "#8a6e44"
        }
      ]
    }
  },
  {
    "id": "exam-table",
    "name": "诊查床",
    "type": "prop",
    "category": "家具",
    "footprint": [0.7, 1.9],
    "height": 0.7,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.6, 0.55, 1.7],
          "pos": [0, 0.275, 0],
          "color": "#e3e7ea"
        },
        {
          "size": [0.7, 0.16, 1.9],
          "pos": [0, 0.62, 0],
          "color": "#6f93b0"
        },
        {
          "size": [0.66, 0.04, 1.86],
          "pos": [0, 0.71, 0],
          "color": "#83a6c2"
        },
        {
          "size": [0.62, 0.06, 0.4],
          "pos": [0, 0.5, -0.75],
          "color": "#cfd4d8"
        }
      ]
    }
  },
  {
    "id": "filing-cabinet",
    "name": "文件柜",
    "type": "prop",
    "category": "家具",
    "footprint": [0.5, 0.6],
    "height": 1.3,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.5, 1.3, 0.6],
          "pos": [0, 0.65, 0],
          "color": "#c2c6cb"
        },
        {
          "size": [0.42, 0.26, 0.02],
          "pos": [0, 1.08, 0.3],
          "color": "#aab0b6"
        },
        {
          "size": [0.42, 0.26, 0.02],
          "pos": [0, 0.78, 0.3],
          "color": "#aab0b6"
        },
        {
          "size": [0.42, 0.26, 0.02],
          "pos": [0, 0.48, 0.3],
          "color": "#aab0b6"
        },
        {
          "size": [0.42, 0.26, 0.02],
          "pos": [0, 0.18, 0.3],
          "color": "#aab0b6"
        },
        {
          "size": [0.12, 0.03, 0.02],
          "pos": [0, 1.16, 0.31],
          "color": "#71767c"
        },
        {
          "size": [0.12, 0.03, 0.02],
          "pos": [0, 0.86, 0.31],
          "color": "#71767c"
        }
      ]
    }
  },
  {
    "id": "fridge",
    "name": "冰箱",
    "type": "prop",
    "category": "家具",
    "footprint": [0.7, 0.7],
    "height": 1.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.7, 1.8, 0.7],
          "pos": [0, 0.9, 0],
          "color": "#cdd2d6"
        },
        {
          "size": [0.66, 0.62, 0.02],
          "pos": [0, 1.42, 0.35],
          "color": "#bcc2c7"
        },
        {
          "size": [0.66, 1.06, 0.02],
          "pos": [0, 0.55, 0.35],
          "color": "#bcc2c7"
        },
        {
          "size": [0.04, 0.5, 0.04],
          "pos": [0.26, 1.42, 0.37],
          "color": "#8b9197"
        },
        {
          "size": [0.04, 0.9, 0.04],
          "pos": [0.26, 0.55, 0.37],
          "color": "#8b9197"
        }
      ]
    }
  },
  {
    "id": "hospital-bed",
    "name": "病床",
    "type": "prop",
    "category": "家具",
    "footprint": [1, 2.1],
    "height": 0.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.06, 0.5, 0.06],
          "pos": [-0.42, 0.25, -0.92],
          "color": "#9aa1a8"
        },
        {
          "size": [0.06, 0.5, 0.06],
          "pos": [0.42, 0.25, -0.92],
          "color": "#9aa1a8"
        },
        {
          "size": [0.06, 0.5, 0.06],
          "pos": [-0.42, 0.25, 0.92],
          "color": "#9aa1a8"
        },
        {
          "size": [0.06, 0.5, 0.06],
          "pos": [0.42, 0.25, 0.92],
          "color": "#9aa1a8"
        },
        {
          "size": [0.98, 0.1, 2],
          "pos": [0, 0.55, 0],
          "color": "#e8edf1"
        },
        {
          "size": [0.92, 0.14, 1.3],
          "pos": [0, 0.67, 0.3],
          "color": "#f4f7fa"
        },
        {
          "size": [0.92, 0.14, 0.65],
          "pos": [0, 0.78, -0.62],
          "color": "#cdd9e3"
        },
        {
          "size": [0.06, 0.16, 1.95],
          "pos": [-0.48, 0.66, 0.05],
          "color": "#6f93b0"
        },
        {
          "size": [0.06, 0.16, 1.95],
          "pos": [0.48, 0.66, 0.05],
          "color": "#6f93b0"
        }
      ]
    }
  },
  {
    "id": "iv-stand",
    "name": "输液架",
    "type": "prop",
    "category": "家具",
    "footprint": [0.4, 0.4],
    "height": 1.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.38, 0.04, 0.06],
          "pos": [0, 0.02, 0],
          "color": "#9aa1a8"
        },
        {
          "size": [0.06, 0.04, 0.38],
          "pos": [0, 0.02, 0],
          "color": "#9aa1a8"
        },
        {
          "size": [0.04, 1.8, 0.04],
          "pos": [0, 0.9, 0],
          "color": "#c2c6cb"
        },
        {
          "size": [0.3, 0.04, 0.04],
          "pos": [0, 1.86, 0],
          "color": "#9aa1a8"
        },
        {
          "size": [0.05, 0.1, 0.05],
          "pos": [0.13, 1.78, 0],
          "color": "#6b7280"
        },
        {
          "size": [0.16, 0.3, 0.05],
          "pos": [0.13, 1.56, 0],
          "color": "#cceeff"
        }
      ]
    }
  },
  {
    "id": "kitchen-counter",
    "name": "灶台柜",
    "type": "prop",
    "category": "家具",
    "footprint": [1.6, 0.6],
    "height": 0.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.6, 0.82, 0.6],
          "pos": [0, 0.41, 0],
          "color": "#d9d4c8"
        },
        {
          "size": [1.66, 0.06, 0.64],
          "pos": [0, 0.87, 0],
          "color": "#8a8378"
        },
        {
          "size": [0.74, 0.74, 0.02],
          "pos": [-0.4, 0.42, 0.31],
          "color": "#cbc6ba"
        },
        {
          "size": [0.74, 0.74, 0.02],
          "pos": [0.4, 0.42, 0.31],
          "color": "#cbc6ba"
        }
      ]
    }
  },
  {
    "id": "kitchen-island",
    "name": "中岛",
    "type": "prop",
    "category": "家具",
    "footprint": [1.6, 0.9],
    "height": 0.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.5, 0.82, 0.8],
          "pos": [0, 0.41, 0],
          "color": "#a9784d"
        },
        {
          "size": [1.72, 0.07, 1],
          "pos": [0, 0.87, 0],
          "color": "#e3ddd1"
        },
        {
          "size": [0.66, 0.7, 0.02],
          "pos": [-0.36, 0.42, 0.41],
          "color": "#956a44"
        },
        {
          "size": [0.66, 0.7, 0.02],
          "pos": [0.36, 0.42, 0.41],
          "color": "#956a44"
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
    "id": "office-chair",
    "name": "办公椅",
    "type": "prop",
    "category": "家具",
    "footprint": [0.6, 0.6],
    "height": 1.05,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.56, 0.08, 0.56],
          "pos": [0, 0.04, 0],
          "color": "#2a2c31"
        },
        {
          "size": [0.08, 0.34, 0.08],
          "pos": [0, 0.25, 0],
          "color": "#5a5d63"
        },
        {
          "size": [0.5, 0.1, 0.48],
          "pos": [0, 0.47, 0.02],
          "color": "#3a3d44"
        },
        {
          "size": [0.46, 0.5, 0.08],
          "pos": [0, 0.78, -0.22],
          "color": "#3a3d44"
        },
        {
          "size": [0.42, 0.06, 0.4],
          "pos": [0.27, 0.6, 0.02],
          "color": "#2a2c31"
        },
        {
          "size": [0.42, 0.06, 0.4],
          "pos": [-0.27, 0.6, 0.02],
          "color": "#2a2c31"
        }
      ]
    }
  },
  {
    "id": "office-desk",
    "name": "办公桌",
    "type": "prop",
    "category": "家具",
    "footprint": [1.4, 0.7],
    "height": 0.75,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.4, 0.05, 0.7],
          "pos": [0, 0.73, 0],
          "color": "#cdb892"
        },
        {
          "size": [0.42, 0.66, 0.62],
          "pos": [0.46, 0.33, 0],
          "color": "#7d6a4f"
        },
        {
          "size": [0.36, 0.03, 0.5],
          "pos": [0.46, 0.52, 0],
          "color": "#5e4f3a"
        },
        {
          "size": [0.06, 0.7, 0.06],
          "pos": [-0.64, 0.35, -0.3],
          "color": "#4a4f57"
        },
        {
          "size": [0.06, 0.7, 0.06],
          "pos": [-0.64, 0.35, 0.3],
          "color": "#4a4f57"
        },
        {
          "size": [0.42, 0.32, 0.04],
          "pos": [-0.2, 1.06, -0.18],
          "color": "#15171c"
        },
        {
          "size": [0.36, 0.26, 0.01],
          "pos": [-0.2, 1.07, -0.16],
          "color": "#2b3340"
        },
        {
          "size": [0.06, 0.16, 0.06],
          "pos": [-0.2, 0.84, -0.18],
          "color": "#3a3d44"
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
    "id": "pillar",
    "name": "立柱",
    "type": "prop",
    "category": "家具",
    "tags": ["古风"],
    "footprint": [0.5, 0.5],
    "height": 3,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.5, 0.18, 0.5],
          "pos": [0, 0.09, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [0.38, 0.08, 0.38],
          "pos": [0, 0.22, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [0.32, 2.5, 0.32],
          "pos": [0, 1.51, 0],
          "color": "#9c3b2e"
        },
        {
          "size": [0.42, 0.16, 0.42],
          "pos": [0, 2.84, 0],
          "color": "#c8a24a"
        },
        {
          "size": [0.5, 0.08, 0.5],
          "pos": [0, 2.96, 0],
          "color": "#c8a24a"
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
    "id": "reception-desk",
    "name": "接待台",
    "type": "prop",
    "category": "家具",
    "footprint": [1.6, 0.7],
    "height": 1.1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.6, 0.74, 0.5],
          "pos": [0, 0.37, -0.1],
          "color": "#b08d57"
        },
        {
          "size": [1.56, 0.05, 0.5],
          "pos": [0, 0.78, -0.1],
          "color": "#d9d2c5"
        },
        {
          "size": [1.6, 0.34, 0.2],
          "pos": [0, 0.93, 0.25],
          "color": "#9a7b4d"
        },
        {
          "size": [1.66, 0.05, 0.3],
          "pos": [0, 1.08, 0.22],
          "color": "#eeeae0"
        },
        {
          "size": [0.5, 0.5, 0.02],
          "pos": [-0.45, 0.37, 0.16],
          "color": "#9a7b4d"
        },
        {
          "size": [0.5, 0.5, 0.02],
          "pos": [0.45, 0.37, 0.16],
          "color": "#9a7b4d"
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
    "id": "shop-counter",
    "name": "收银台",
    "type": "prop",
    "category": "家具",
    "footprint": [1.4, 0.6],
    "height": 1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.4, 0.92, 0.6],
          "pos": [0, 0.46, 0],
          "color": "#b08d57"
        },
        {
          "size": [1.46, 0.06, 0.66],
          "pos": [0, 0.95, 0],
          "color": "#d9d2c5"
        },
        {
          "size": [0.3, 0.18, 0.28],
          "pos": [0.38, 1.07, 0],
          "color": "#33373c"
        },
        {
          "size": [0.22, 0.14, 0.02],
          "pos": [0.38, 1.13, 0.14],
          "color": "#566270"
        },
        {
          "size": [0.26, 0.2, 0.02],
          "pos": [-0.35, 1.16, 0.05],
          "color": "#2b3138"
        },
        {
          "size": [0.04, 0.16, 0.04],
          "pos": [-0.35, 1.06, 0.05],
          "color": "#6b7280"
        }
      ]
    }
  },
  {
    "id": "shop-shelf",
    "name": "货架",
    "type": "prop",
    "category": "家具",
    "footprint": [1.2, 0.4],
    "height": 1.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.05, 1.8, 0.4],
          "pos": [-0.575, 0.9, 0],
          "color": "#9aa1a8"
        },
        {
          "size": [0.05, 1.8, 0.4],
          "pos": [0.575, 0.9, 0],
          "color": "#9aa1a8"
        },
        {
          "size": [1.1, 1.78, 0.04],
          "pos": [0, 0.9, -0.18],
          "color": "#b6bcc2"
        },
        {
          "size": [1.1, 0.04, 0.38],
          "pos": [0, 0.45, 0],
          "color": "#c2c6cb"
        },
        {
          "size": [1.1, 0.04, 0.38],
          "pos": [0, 0.9, 0],
          "color": "#c2c6cb"
        },
        {
          "size": [1.1, 0.04, 0.38],
          "pos": [0, 1.35, 0],
          "color": "#c2c6cb"
        },
        {
          "size": [0.22, 0.22, 0.22],
          "pos": [-0.32, 0.58, 0.05],
          "color": "#d65a5a"
        },
        {
          "size": [0.18, 0.2, 0.2],
          "pos": [0.28, 1.03, 0.05],
          "color": "#5a9bd6"
        },
        {
          "size": [0.2, 0.18, 0.2],
          "pos": [0.05, 1.47, 0.05],
          "color": "#5fae73"
        }
      ]
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
    "id": "sink",
    "name": "水槽柜",
    "type": "prop",
    "category": "家具",
    "footprint": [0.7, 0.6],
    "height": 0.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.7, 0.82, 0.6],
          "pos": [0, 0.41, 0],
          "color": "#d9d4c8"
        },
        {
          "size": [0.74, 0.06, 0.64],
          "pos": [0, 0.87, 0],
          "color": "#8a8378"
        },
        {
          "size": [0.42, 0.08, 0.34],
          "pos": [0, 0.86, 0.02],
          "color": "#6f6a60"
        },
        {
          "size": [0.34, 0.06, 0.26],
          "pos": [0, 0.88, 0.02],
          "color": "#4f4b44"
        },
        {
          "size": [0.05, 0.22, 0.05],
          "pos": [0, 1, -0.2],
          "color": "#9aa0a6"
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
    "id": "stove",
    "name": "灶具",
    "type": "prop",
    "category": "家具",
    "footprint": [0.6, 0.6],
    "height": 0.9,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.6, 0.82, 0.6],
          "pos": [0, 0.41, 0],
          "color": "#d9d4c8"
        },
        {
          "size": [0.62, 0.04, 0.62],
          "pos": [0, 0.84, 0],
          "color": "#23262b"
        },
        {
          "size": [0.18, 0.02, 0.18],
          "pos": [-0.14, 0.87, 0.12],
          "color": "#3a3f47"
        },
        {
          "size": [0.18, 0.02, 0.18],
          "pos": [0.14, 0.87, 0.12],
          "color": "#3a3f47"
        },
        {
          "size": [0.18, 0.02, 0.18],
          "pos": [-0.14, 0.87, -0.12],
          "color": "#3a3f47"
        },
        {
          "size": [0.18, 0.02, 0.18],
          "pos": [0.14, 0.87, -0.12],
          "color": "#3a3f47"
        },
        {
          "size": [0.6, 0.12, 0.05],
          "pos": [0, 0.92, -0.27],
          "color": "#1f2227"
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
    "id": "throne",
    "name": "宝座",
    "type": "prop",
    "category": "家具",
    "tags": ["古风"],
    "footprint": [1.2, 1],
    "height": 1.7,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.2, 0.3, 1],
          "pos": [0, 0.15, 0],
          "color": "#5a3a26"
        },
        {
          "size": [1, 0.16, 0.85],
          "pos": [0, 0.38, 0.02],
          "color": "#9c3b2e"
        },
        {
          "size": [1, 1.2, 0.16],
          "pos": [0, 1.06, -0.42],
          "color": "#9c3b2e"
        },
        {
          "size": [0.7, 0.6, 0.06],
          "pos": [0, 1.05, -0.33],
          "color": "#c8a24a"
        },
        {
          "size": [0.14, 0.4, 0.85],
          "pos": [-0.43, 0.66, 0.02],
          "color": "#c8a24a"
        },
        {
          "size": [0.14, 0.4, 0.85],
          "pos": [0.43, 0.66, 0.02],
          "color": "#c8a24a"
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
    "id": "banner-drape",
    "name": "旗幔",
    "type": "prop",
    "category": "装饰",
    "tags": ["古风"],
    "footprint": [0.8, 0.1],
    "height": 2.4,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [0.8, 2.4, 0],
          "pos": [0, 1.2, 0],
          "color": "#7a1f1f"
        },
        {
          "flat": true,
          "size": [0.62, 0.12, 0],
          "pos": [0, 2.28, 0.01],
          "color": "#c8a24a"
        },
        {
          "flat": true,
          "size": [0.62, 0.12, 0],
          "pos": [0, 0.12, 0.01],
          "color": "#c8a24a"
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
    "id": "palace-lantern",
    "name": "宫灯",
    "type": "prop",
    "category": "装饰",
    "tags": ["古风"],
    "footprint": [0.4, 0.4],
    "height": 1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.02, 0.28, 0.02],
          "pos": [0, 0.86, 0],
          "color": "#5a3a26"
        },
        {
          "size": [0.16, 0.06, 0.16],
          "pos": [0, 0.7, 0],
          "color": "#c8a24a"
        },
        {
          "size": [0.34, 0.4, 0.34],
          "pos": [0, 0.47, 0],
          "color": "#9c3b2e"
        },
        {
          "size": [0.16, 0.06, 0.16],
          "pos": [0, 0.24, 0],
          "color": "#c8a24a"
        },
        {
          "size": [0.04, 0.18, 0.04],
          "pos": [0, 0.12, 0],
          "color": "#c8a24a"
        }
      ]
    }
  },
  {
    "id": "projector-screen",
    "name": "投影幕",
    "type": "prop",
    "category": "装饰",
    "footprint": [2.2, 0.06],
    "height": 1.4,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [2.2, 1.4, 0],
          "pos": [0, 1.7, 0],
          "color": "#fbfbf7"
        },
        {
          "flat": true,
          "size": [2.18, 0.04, 0],
          "pos": [0, 1.02, 0.01],
          "color": "#1d1f24"
        },
        {
          "size": [2.3, 0.12, 0.12],
          "pos": [0, 2.46, 0],
          "color": "#4a4f57"
        }
      ]
    }
  },
  {
    "id": "red-carpet",
    "name": "红毯",
    "type": "prop",
    "category": "装饰",
    "tags": ["古风"],
    "footprint": [1.2, 4],
    "height": 0.04,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.2, 0.04, 4],
          "pos": [0, 0.02, 0],
          "color": "#8e2b2b"
        },
        {
          "size": [0.12, 0.045, 4],
          "pos": [-0.5, 0.022, 0],
          "color": "#c8a24a"
        },
        {
          "size": [0.12, 0.045, 4],
          "pos": [0.5, 0.022, 0],
          "color": "#c8a24a"
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
    "id": "upper-cabinets",
    "name": "吊柜",
    "type": "prop",
    "category": "装饰",
    "footprint": [1.6, 0.1],
    "height": 0.7,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [1.6, 0.7, 0],
          "pos": [0, 1.8, 0],
          "color": "#d9d4c8"
        },
        {
          "flat": true,
          "size": [0.76, 0.64, 0],
          "pos": [-0.41, 1.8, 0.01],
          "color": "#cbc6ba"
        },
        {
          "flat": true,
          "size": [0.76, 0.64, 0],
          "pos": [0.41, 1.8, 0.01],
          "color": "#cbc6ba"
        },
        {
          "flat": true,
          "size": [0.5, 0.03, 0],
          "pos": [-0.41, 1.52, 0.02],
          "color": "#9aa0a6"
        },
        {
          "flat": true,
          "size": [0.5, 0.03, 0],
          "pos": [0.41, 1.52, 0.02],
          "color": "#9aa0a6"
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
    "id": "whiteboard",
    "name": "白板",
    "type": "prop",
    "category": "装饰",
    "footprint": [1.8, 0.08],
    "height": 1.2,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "flat": true,
          "size": [1.9, 1.3, 0],
          "pos": [0, 1.5, 0],
          "color": "#9aa0a6"
        },
        {
          "flat": true,
          "size": [1.8, 1.2, 0],
          "pos": [0, 1.5, 0.01],
          "color": "#f4f4f0"
        },
        {
          "flat": true,
          "size": [0.6, 0.04, 0],
          "pos": [-0.4, 0.95, 0.02],
          "color": "#c8ccd0"
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
    "id": "car-exterior",
    "name": "汽车",
    "type": "prop",
    "category": "室外",
    "tags": ["车辆"],
    "footprint": [1.9, 4.3],
    "height": 1.45,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.9, 0.75, 4.3],
          "pos": [0, 0.55, 0],
          "color": "#4a6378"
        },
        {
          "size": [1.65, 0.65, 2.2],
          "pos": [0, 1.1, -0.25],
          "color": "#4a6378"
        },
        {
          "size": [1.6, 0.55, 0.15],
          "pos": [0, 1.05, 0.83],
          "color": "#1a2026"
        },
        {
          "size": [0.35, 0.5, 0.5],
          "pos": [-0.85, 0.3, 1.35],
          "color": "#15181c"
        },
        {
          "size": [0.35, 0.5, 0.5],
          "pos": [0.85, 0.3, 1.35],
          "color": "#15181c"
        },
        {
          "size": [0.35, 0.5, 0.5],
          "pos": [-0.85, 0.3, -1.35],
          "color": "#15181c"
        },
        {
          "size": [0.35, 0.5, 0.5],
          "pos": [0.85, 0.3, -1.35],
          "color": "#15181c"
        }
      ]
    }
  },
  {
    "id": "fountain",
    "name": "喷泉",
    "type": "prop",
    "category": "室外",
    "footprint": [2.4, 2.4],
    "height": 1.2,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2.4, 0.45, 2.4],
          "pos": [0, 0.225, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [2, 0.08, 2],
          "pos": [0, 0.4, 0],
          "color": "#9fc6dd"
        },
        {
          "size": [0.6, 0.55, 0.6],
          "pos": [0, 0.72, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [1.1, 0.18, 1.1],
          "pos": [0, 1, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [0.85, 0.06, 0.85],
          "pos": [0, 1.07, 0],
          "color": "#9fc6dd"
        },
        {
          "size": [0.12, 0.25, 0.12],
          "pos": [0, 1.2, 0],
          "color": "#9fc6dd"
        }
      ]
    }
  },
  {
    "id": "hedge",
    "name": "绿篱",
    "type": "prop",
    "category": "室外",
    "footprint": [2, 0.6],
    "height": 1,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2, 0.7, 0.6],
          "pos": [0, 0.35, 0],
          "color": "#3f6b39"
        },
        {
          "size": [1.94, 0.4, 0.54],
          "pos": [0.03, 0.8, -0.02],
          "color": "#3f6b39"
        }
      ]
    }
  },
  {
    "id": "lamppost",
    "name": "路灯",
    "type": "prop",
    "category": "室外",
    "footprint": [0.4, 0.4],
    "height": 4,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.4, 0.15, 0.4],
          "pos": [0, 0.075, 0],
          "color": "#2f3338"
        },
        {
          "size": [0.12, 3.7, 0.12],
          "pos": [0, 1.85, 0],
          "color": "#2f3338"
        },
        {
          "size": [0.6, 0.1, 0.1],
          "pos": [0.28, 3.7, 0],
          "color": "#2f3338"
        },
        {
          "size": [0.26, 0.22, 0.26],
          "pos": [0.5, 3.58, 0],
          "color": "#f0e0a0"
        }
      ]
    }
  },
  {
    "id": "outdoor-dusk",
    "name": "黄昏街区",
    "type": "environment",
    "category": "室外",
    "footprint": [20, 20],
    "height": 6,
    "source": {
      "kind": "outdoorShell",
      "ground": "paving",
      "sky": "dusk",
      "backdrop": "cityline"
    }
  },
  {
    "id": "outdoor-grass",
    "name": "草地",
    "type": "environment",
    "category": "室外",
    "footprint": [20, 20],
    "height": 6,
    "source": {
      "kind": "outdoorShell",
      "ground": "grass",
      "sky": "day",
      "backdrop": "treeline"
    }
  },
  {
    "id": "outdoor-night",
    "name": "夜晚街区",
    "type": "environment",
    "category": "室外",
    "footprint": [20, 20],
    "height": 6,
    "source": {
      "kind": "outdoorShell",
      "ground": "paving",
      "sky": "night",
      "backdrop": "cityline"
    }
  },
  {
    "id": "outdoor-plaza",
    "name": "广场",
    "type": "environment",
    "category": "室外",
    "footprint": [20, 20],
    "height": 6,
    "source": {
      "kind": "outdoorShell",
      "ground": "paving",
      "sky": "day",
      "backdrop": "cityline"
    }
  },
  {
    "id": "palace-gate",
    "name": "宫门",
    "type": "prop",
    "category": "室外",
    "tags": ["古风"],
    "footprint": [4, 0.8],
    "height": 3.4,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.6, 2.8, 0.8],
          "pos": [-1.7, 1.4, 0],
          "color": "#9c3b2e"
        },
        {
          "size": [0.6, 2.8, 0.8],
          "pos": [1.7, 1.4, 0],
          "color": "#9c3b2e"
        },
        {
          "size": [4, 0.5, 0.9],
          "pos": [0, 3.05, 0],
          "color": "#5a3a26"
        },
        {
          "size": [4.4, 0.18, 1.2],
          "pos": [0, 3.39, -0.15],
          "color": "#c8a24a"
        },
        {
          "size": [1.3, 2.7, 0.2],
          "pos": [-0.66, 1.35, 0],
          "color": "#7a1f1f"
        },
        {
          "size": [1.3, 2.7, 0.2],
          "pos": [0.66, 1.35, 0],
          "color": "#7a1f1f"
        },
        {
          "size": [0.16, 0.16, 0.24],
          "pos": [-0.18, 1.35, 0.12],
          "color": "#c8a24a"
        },
        {
          "size": [0.16, 0.16, 0.24],
          "pos": [0.18, 1.35, 0.12],
          "color": "#c8a24a"
        }
      ]
    }
  },
  {
    "id": "palace-stairs",
    "name": "宫殿台阶",
    "type": "prop",
    "category": "室外",
    "tags": ["古风"],
    "footprint": [4, 3],
    "height": 1.05,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [4, 0.35, 3],
          "pos": [0, 0.175, 0],
          "color": "#b9b2a4"
        },
        {
          "size": [3.4, 0.35, 2.2],
          "pos": [0, 0.525, -0.4],
          "color": "#a8a294"
        },
        {
          "size": [2.8, 0.35, 1.4],
          "pos": [0, 0.875, -0.8],
          "color": "#b9b2a4"
        }
      ]
    }
  },
  {
    "id": "park-bench",
    "name": "长椅",
    "type": "prop",
    "category": "室外",
    "footprint": [1.6, 0.6],
    "height": 0.8,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [1.6, 0.07, 0.5],
          "pos": [0, 0.45, 0.02],
          "color": "#7a5a3a"
        },
        {
          "size": [1.6, 0.1, 0.07],
          "pos": [0, 0.65, -0.21],
          "color": "#7a5a3a"
        },
        {
          "size": [1.6, 0.1, 0.07],
          "pos": [0, 0.78, -0.2],
          "color": "#7a5a3a"
        },
        {
          "size": [0.08, 0.45, 0.5],
          "pos": [-0.7, 0.225, 0.02],
          "color": "#2f3338"
        },
        {
          "size": [0.08, 0.45, 0.5],
          "pos": [0.7, 0.225, 0.02],
          "color": "#2f3338"
        }
      ]
    }
  },
  {
    "id": "tree",
    "name": "树",
    "type": "prop",
    "category": "室外",
    "footprint": [1.6, 1.6],
    "height": 3.2,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [0.4, 1.6, 0.4],
          "pos": [0, 0.8, 0],
          "color": "#5a3a26"
        },
        {
          "size": [1.5, 1.1, 1.5],
          "pos": [0, 1.95, 0],
          "color": "#3f6b39"
        },
        {
          "size": [1, 0.9, 1],
          "pos": [-0.3, 2.6, 0.25],
          "color": "#4c7a42"
        },
        {
          "size": [0.9, 0.85, 0.9],
          "pos": [0.35, 2.7, -0.2],
          "color": "#4c7a42"
        }
      ]
    }
  },
  {
    "id": "elevator",
    "name": "电梯",
    "type": "environment",
    "category": "场景",
    "footprint": [2, 2],
    "height": 2.4,
    "source": {
      "kind": "primitive",
      "parts": [
        {
          "size": [2, 0.08, 2],
          "pos": [0, 0.04, 0],
          "color": "#6b6f75"
        },
        {
          "size": [2, 0.08, 2],
          "pos": [0, 2.36, 0],
          "color": "#b8bcc2"
        },
        {
          "size": [2, 2.32, 0.1],
          "pos": [0, 1.2, -0.95],
          "color": "#b8bcc2"
        },
        {
          "size": [0.1, 2.32, 2],
          "pos": [-0.95, 1.2, 0],
          "color": "#b8bcc2"
        },
        {
          "size": [0.1, 2.32, 2],
          "pos": [0.95, 1.2, 0],
          "color": "#b8bcc2"
        },
        {
          "size": [0.12, 2.4, 0.12],
          "pos": [-0.94, 1.2, 0.95],
          "color": "#8d9197"
        },
        {
          "size": [0.12, 2.4, 0.12],
          "pos": [0.94, 1.2, 0.95],
          "color": "#8d9197"
        },
        {
          "size": [0.18, 0.5, 0.04],
          "pos": [-0.78, 1.1, -0.9],
          "color": "#2f3338"
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
