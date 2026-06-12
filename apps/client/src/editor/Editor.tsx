import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { View, StyleSheet } from 'react-native';
import { useEditor } from '../store/editorStore';
import SceneView from './SceneView';
import { ensureWebGlobalStyles } from './webGlobalStyles';
import { LayoutShell } from '../ui/LayoutShell';
import { color } from '../ui/theme';

/** 编辑器外壳:全屏 3D 画布 + 响应式 UI 层(LayoutShell 负责各断点布局)。 */
export default function Editor() {
  const select = useEditor((s) => s.select);

  useEffect(() => {
    ensureWebGlobalStyles();
  }, []);

  return (
    <View style={styles.root}>
      <Canvas
        frameloop="demand"
        camera={{ position: [5, 4, 6], fov: 55 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: color.bg,
          touchAction: 'none',
        }}
        onPointerMissed={() => select(null)}
      >
        <SceneView />
      </Canvas>

      <LayoutShell />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.bg },
});
