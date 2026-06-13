import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useEditor } from '../../../store/editorStore';
import { color, space, radius, font } from '../../../ui/theme';

/** 底图:上传/替换(与左侧「导入模型」同款 accent 描边按钮,一看即知是上传)+ 当前底图缩略与清除。 */
export function BgControl() {
  const { t } = useTranslation();
  const bgImageUrl = useEditor((s) => s.bgImageUrl);
  const setBg = useEditor((s) => s.setBg);

  const pick = () => {
    if (typeof document === 'undefined') return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        // globalThis.Image = DOM 构造器(此文件的 Image 名已被 react-native 的组件占用)
        const img = new globalThis.Image();
        img.onload = () => setBg(url, img.naturalWidth / img.naturalHeight);
        img.src = url;
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{t('inspector.background')}</Text>
      {/* 与左侧资产库「⬆ 导入模型」同款描边按钮,语义一致:这里是上传背景 */}
      <Pressable onPress={pick} style={({ pressed }) => [styles.uploadBtn, pressed && styles.pressed]}>
        <Text style={styles.uploadText}>⬆ {bgImageUrl ? t('preview.replaceBg') : t('preview.uploadBg')}</Text>
      </Pressable>
      {bgImageUrl ? (
        <View style={styles.currentRow}>
          <Image source={{ uri: bgImageUrl }} style={styles.thumb} />
          <Pressable
            onPress={() => setBg(null, null)}
            style={({ pressed }) => [styles.clearBtn, pressed && styles.pressed]}
          >
            <Text style={styles.clearText}>✕ {t('preview.clearBg')}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn },
  uploadBtn: {
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.accent,
    alignItems: 'center',
  },
  uploadText: { color: color.accent, fontSize: font.label, fontWeight: font.weightBtn },
  currentRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  thumb: { width: 40, height: 40, borderRadius: radius.sm, borderWidth: 1, borderColor: color.border },
  clearBtn: {
    paddingHorizontal: space.sm,
    paddingVertical: space.xs,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
  },
  clearText: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn },
  pressed: { opacity: 0.7 },
});
