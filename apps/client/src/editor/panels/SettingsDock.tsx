import { useState, type ReactNode } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useUI } from '../../ui/uiStore';
import { useBreakpoint } from '../../ui/useBreakpoint';
import { useSettings, type OutputResolution } from '../../store/settingsStore';
import { LANGUAGES, type AppLanguage } from '../../i18n/languages';
import { fetchAvailableModels } from '../models';
import i18n from '../../i18n';
import { Backdrop } from '../../ui/primitives/Backdrop';
import { Button } from '../../ui/primitives/Button';
import { color, space, radius, font, z, elevation } from '../../ui/theme';
import type { ModelInfo } from '@asc/shared-types';

const SECTIONS = [
  { id: 'generation', icon: '✨', labelKey: 'settings.secGeneration' },
  { id: 'defaults', icon: '🎚️', labelKey: 'settings.secDefaults' },
  { id: 'interface', icon: '🌐', labelKey: 'settings.secInterface' },
  { id: 'about', icon: 'ℹ️', labelKey: 'settings.secAbout' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

const RESOLUTIONS: OutputResolution[] = ['512', '1024', '2048', '4096'];
const ASPECTS = ['16:9', '4:3', '1:1', '3:4', '9:16'];
const EXPORT_EDGES = [1280, 1920, 2560, 3840];

const APP_VERSION = '1.0.0';

/** 一组标签 + 控件 + 可选说明的设置项。 */
function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
      {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
    </View>
  );
}

/** 下拉框:展示当前值,展开后内联列出全部选项(选项文本 = Google 返回的模型 id,原样)。 */
function ModelDropdown({
  value,
  options,
  onChange,
}: {
  value: string;
  options: ModelInfo[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <View>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={({ pressed }) => [styles.dropdown, pressed && styles.pressed]}
      >
        <Text style={styles.dropdownValue} numberOfLines={1}>
          {value}
        </Text>
        <Text style={styles.dropdownCaret}>{open ? '▴' : '▾'}</Text>
      </Pressable>
      {open ? (
        <View style={styles.dropdownList}>
          <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
            {options.map((o) => (
              <Pressable
                key={o.id}
                onPress={() => {
                  onChange(o.id);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  styles.dropdownItem,
                  o.id === value && styles.dropdownItemActive,
                  pressed && styles.pressed,
                ]}
              >
                <Text
                  style={[styles.dropdownItemText, o.id === value && styles.dropdownItemTextActive]}
                  numberOfLines={1}
                >
                  {o.id}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      ) : null}
    </View>
  );
}

/**
 * 设置面板(模态)。左右两栏:左=分区导航,右=该区详细设置。
 * 宽屏(桌面/横屏 iPad)左右并排;紧凑(手机/竖屏)上下堆叠,导航变顶部横排。
 */
export function SettingsDock() {
  const { t } = useTranslation();
  const { isCompact } = useBreakpoint();
  const open = useUI((s) => s.settingsOpen);
  const close = useUI((s) => s.closeSettings);
  const cfg = useSettings();
  const [active, setActive] = useState<SectionId>('generation');
  const [showKey, setShowKey] = useState(false);
  const [verify, setVerify] = useState<{ status: 'idle' | 'loading' | 'ok' | 'error'; msg: string }>({
    status: 'idle',
    msg: '',
  });

  if (!open) return null;

  const changeLanguage = (lang: AppLanguage) => {
    cfg.setLanguage(lang);
    void i18n.changeLanguage(lang);
  };

  // 用 Key 校验并读取 Google 可用出图模型;成功则替换模型清单、必要时改选首个有效模型。
  const onVerify = async () => {
    setVerify({ status: 'loading', msg: '' });
    try {
      const models = await fetchAvailableModels();
      cfg.setAvailableModels(models);
      if (models.length > 0 && !models.some((m) => m.id === cfg.model)) cfg.setModel(models[0]!.id);
      setVerify({ status: 'ok', msg: t('settings.keyValid', { count: models.length }) });
    } catch (e) {
      setVerify({ status: 'error', msg: t('settings.keyInvalid', { msg: (e as Error)?.message ?? '' }) });
    }
  };

  const hasModels = cfg.availableModels.length > 0;

  const nav = (
    <View style={isCompact ? styles.navRow : styles.navList}>
      {SECTIONS.map((sec) => {
        const on = sec.id === active;
        return (
          <Pressable
            key={sec.id}
            onPress={() => setActive(sec.id)}
            style={({ pressed }) => [styles.navItem, on && styles.navItemActive, pressed && styles.pressed]}
          >
            <Text style={styles.navIcon}>{sec.icon}</Text>
            <Text style={[styles.navLabel, on && styles.navLabelActive]} numberOfLines={1}>
              {t(sec.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  const body = (
    <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
      {active === 'generation' && (
        <>
          <Field label={t('settings.apiKey')} hint={t('settings.apiKeyHint')}>
            <View style={styles.keyRow}>
              <TextInput
                value={cfg.geminiApiKey}
                onChangeText={cfg.setApiKey}
                secureTextEntry={!showKey}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder={t('settings.apiKeyPlaceholder')}
                placeholderTextColor={color.textFaint}
                style={styles.input}
              />
              <Pressable onPress={() => setShowKey((v) => !v)} hitSlop={6} style={styles.keyToggle}>
                <Text style={styles.keyToggleText}>{showKey ? t('settings.hide') : t('settings.show')}</Text>
              </Pressable>
            </View>
            <View style={styles.verifyRow}>
              <Button
                label={verify.status === 'loading' ? t('settings.verifying') : t('settings.verifyKey')}
                icon="🔑"
                disabled={verify.status === 'loading'}
                onPress={onVerify}
              />
              {verify.status === 'ok' || verify.status === 'error' ? (
                <Text
                  style={[styles.verifyMsg, verify.status === 'ok' ? styles.verifyOk : styles.verifyErr]}
                  numberOfLines={2}
                >
                  {verify.msg}
                </Text>
              ) : null}
            </View>
          </Field>

          <Field label={t('settings.model')}>
            {hasModels ? (
              <ModelDropdown value={cfg.model} options={cfg.availableModels} onChange={cfg.setModel} />
            ) : (
              <Text style={styles.fieldHint}>{t('settings.modelsEmpty', { model: cfg.model })}</Text>
            )}
          </Field>

          <Field label={t('settings.resolution')}>
            <View style={styles.pillRow}>
              {RESOLUTIONS.map((r) => (
                <Button
                  key={r}
                  label={r}
                  compact
                  active={cfg.outputResolution === r}
                  onPress={() => cfg.setOutputResolution(r)}
                />
              ))}
            </View>
          </Field>
        </>
      )}

      {active === 'defaults' && (
        <>
          <Field label={t('settings.defaultAspect')}>
            <View style={styles.pillRow}>
              {ASPECTS.map((a) => (
                <Button
                  key={a}
                  label={a}
                  compact
                  active={cfg.defaultAspect === a}
                  onPress={() => cfg.setDefaultAspect(a)}
                />
              ))}
            </View>
          </Field>
          <Field label={t('settings.exportLongEdge')}>
            <View style={styles.pillRow}>
              {EXPORT_EDGES.map((e) => (
                <Button
                  key={e}
                  label={String(e)}
                  compact
                  active={cfg.exportLongEdge === e}
                  onPress={() => cfg.setExportLongEdge(e)}
                />
              ))}
            </View>
          </Field>
        </>
      )}

      {active === 'interface' && (
        <Field label={t('settings.language')}>
          <View style={styles.pillRow}>
            {LANGUAGES.map((l) => (
              <Button
                key={l.id}
                label={l.label}
                active={cfg.language === l.id}
                grow
                onPress={() => changeLanguage(l.id)}
              />
            ))}
          </View>
        </Field>
      )}

      {active === 'about' && (
        <View style={styles.aboutWrap}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutKey}>{t('settings.version')}</Text>
            <Text style={styles.aboutVal}>{APP_VERSION}</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutKey}>{t('settings.credits')}</Text>
            <Text style={styles.aboutVal}>Kenney · CC0</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  const sectionTitle = t(SECTIONS.find((s) => s.id === active)!.labelKey);

  return (
    <View style={[StyleSheet.absoluteFill, styles.layer]} pointerEvents="box-none">
      <Backdrop onPress={close} />
      <View style={styles.center} pointerEvents="box-none">
        <View style={[styles.card, isCompact ? styles.cardCompact : styles.cardWide]} pointerEvents="auto">
          {isCompact ? (
            <>
              <View style={styles.compactHeader}>
                <Text style={styles.title}>{t('settings.title')}</Text>
                <Pressable onPress={close} hitSlop={8}>
                  <Text style={styles.close}>✕</Text>
                </Pressable>
              </View>
              {nav}
              {body}
            </>
          ) : (
            <>
              <View style={styles.sidebar}>
                <Text style={styles.brand}>{t('settings.title')}</Text>
                {nav}
              </View>
              <View style={styles.detail}>
                <View style={styles.detailHeader}>
                  <Text style={styles.sectionTitle}>{sectionTitle}</Text>
                  <Pressable onPress={close} hitSlop={8}>
                    <Text style={styles.close}>✕</Text>
                  </Pressable>
                </View>
                {body}
              </View>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { zIndex: z.sheet },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: space.xl },
  card: {
    width: '100%',
    backgroundColor: color.panelSolid,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: color.border,
    overflow: 'hidden',
    ...elevation.panel,
  },
  cardWide: { maxWidth: 760, height: 560, maxHeight: '90%', flexDirection: 'row' },
  cardCompact: { maxWidth: 480, maxHeight: '88%', flexDirection: 'column' },

  /* 左侧导航(宽屏) */
  sidebar: {
    width: 176,
    backgroundColor: color.bg,
    borderRightWidth: 1,
    borderRightColor: color.border,
    padding: space.md,
    gap: space.sm,
  },
  brand: {
    color: color.text,
    fontSize: font.title,
    fontWeight: font.weightTitle,
    paddingHorizontal: space.sm,
    paddingVertical: space.sm,
  },
  navList: { gap: space.xs },
  navRow: { flexDirection: 'row', gap: space.xs, paddingHorizontal: space.lg, flexWrap: 'wrap' },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    minHeight: 40,
  },
  navItemActive: { backgroundColor: color.accentDim },
  navIcon: { fontSize: font.btn },
  navLabel: { color: color.textDim, fontSize: font.body, fontWeight: font.weightBtn },
  navLabelActive: { color: color.accent },

  /* 右侧详情 */
  detail: { flex: 1, flexDirection: 'column' },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  sectionTitle: { color: color.text, fontSize: font.title, fontWeight: font.weightTitle },

  /* 紧凑头部 */
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingTop: space.lg,
    paddingBottom: space.sm,
  },
  title: { color: color.text, fontSize: font.title, fontWeight: font.weightTitle },
  close: { color: color.textDim, fontSize: font.title, paddingHorizontal: space.xs },

  /* 内容 */
  body: { padding: space.lg, gap: space.lg },
  field: { gap: space.sm },
  fieldLabel: { color: color.textDim, fontSize: font.label, fontWeight: font.weightBtn },
  fieldHint: { color: color.textFaint, fontSize: font.hint, lineHeight: 16 },
  keyRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  input: {
    flex: 1,
    minHeight: 40,
    color: color.text,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    fontSize: font.body,
  },
  keyToggle: { paddingHorizontal: space.sm, paddingVertical: space.sm },
  keyToggleText: { color: color.accent, fontSize: font.label, fontWeight: font.weightBtn },
  verifyRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },
  verifyMsg: { fontSize: font.label, fontWeight: font.weightBtn, flexShrink: 1 },
  verifyOk: { color: color.accent },
  verifyErr: { color: color.danger },
  pillRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' },

  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 40,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
  },
  dropdownValue: { color: color.text, fontSize: font.body, flexShrink: 1 },
  dropdownCaret: { color: color.textDim, fontSize: font.label, marginLeft: space.sm },
  dropdownList: {
    marginTop: space.xs,
    backgroundColor: color.surface,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: color.border,
    overflow: 'hidden',
  },
  dropdownScroll: { maxHeight: 220 },
  dropdownItem: {
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    minHeight: 38,
    justifyContent: 'center',
  },
  dropdownItemActive: { backgroundColor: color.accentDim },
  dropdownItemText: { color: color.text, fontSize: font.body },
  dropdownItemTextActive: { color: color.accent, fontWeight: font.weightBtn },

  aboutWrap: { gap: space.md },
  aboutRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  aboutKey: { color: color.textDim, fontSize: font.body },
  aboutVal: { color: color.text, fontSize: font.body, fontWeight: font.weightBtn },

  pressed: { opacity: 0.7 },
});
