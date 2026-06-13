import { useEditor, type SceneSnapshot } from '../store/editorStore';
import i18n from '../i18n';

// 场景的本地保存/读取(Web)。保存 = 下载一份 .json(也天然是可分享的场景文件);
// 读取 = 选文件还原。Firebase(D13)接通后,同一份快照可改为写/读 Firestore。

const isWeb = () => typeof document !== 'undefined';

const pad = (n: number) => String(n).padStart(2, '0');

/** 保存当前场景为本地 JSON 文件(忠实快照:构图 + 机位 + 参考底图)。 */
export function saveSceneToFile() {
  if (!isWeb()) return;
  const s = useEditor.getState();
  if (s.objects.length === 0) return;
  // 只内嵌「场景里真正用到」的上传模型,避免存档无谓变大
  const usedIds = new Set(s.objects.map((o) => o.modelId));
  const snap: SceneSnapshot = {
    version: 1,
    objects: s.objects,
    cameras: s.cameras,
    bgImageUrl: s.bgImageUrl,
    bgAspect: s.bgAspect,
    userModels: s.userModels.filter((m) => usedIds.has(m.id)),
    savedAt: Date.now(),
  };
  const blob = new Blob([JSON.stringify(snap, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const t = new Date();
  a.download = `scene-${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}-${pad(t.getHours())}${pad(t.getMinutes())}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** 从本地 JSON 文件读取场景并载入编辑器。 */
export function loadSceneFromFile() {
  if (!isWeb()) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'application/json,.json';
  input.onchange = () => {
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const snap = JSON.parse(reader.result as string) as SceneSnapshot;
        if (!snap || !Array.isArray(snap.objects)) throw new Error('bad shape');
        useEditor.getState().loadSnapshot(snap);
      } catch {
        if (typeof window !== 'undefined') window.alert(i18n.t('errors.badSceneFile'));
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
