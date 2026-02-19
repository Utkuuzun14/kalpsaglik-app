import * as Speech from 'expo-speech';
import { useRouter } from 'expo-router';
import {
  Bell,
  ChevronRight,
  ClipboardList,
  Heart,
  Pause,
  Play,
  Settings,
  Stethoscope,
  User,
  Video,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Color palette ───────────────────────────────────────────────────────────
const C = {
  bg: '#F0F5FA',
  white: '#FFFFFF',
  navy: '#0B2545',
  blue: '#1558A8',
  blueDark: '#0D3F7C',
  blueMid: '#1976D2',
  blueLight: '#5BA4CF',
  bluePale: '#E3F0FF',
  blueGhost: '#F0F7FF',
  red: '#D32F2F',
  redDark: '#B71C1C',
  redSoft: '#FFEBEE',
  redBorder: '#FFCDD2',
  textDark: '#0D1B2A',
  textMid: '#34567A',
  textSoft: '#7B9EB8',
  divider: '#D8E8F5',
  shadowBlue: 'rgba(21, 88, 168, 0.15)',
  shadowRed: 'rgba(211, 47, 47, 0.25)',
};

// ─── TTS text for each card ───────────────────────────────────────────────────
const SPEECH_TEXTS: Record<string, string> = {
  genel:
    'Genel Bilgiler. Ameliyat hakkında temel bilgiler ve sık sorulan sorular. Açık kalp ameliyatı; ' +
    'koroner arter hastalığı, kapak hastalıkları ve kalp yetmezliği gibi durumların tedavisinde ' +
    'kullanılan kapsamlı bir cerrahi işlemdir.',
  oncesi:
    'Ameliyat Öncesi Dönem. Hazırlık adımları, ilaçlar ve yapılması gerekenler. ' +
    'İyi bir hazırlık, mümkün olan en iyi sonucun alınmasını sağlar. ' +
    'Gece yarısından itibaren hiçbir şey yemeyiniz ve içmeyiniz. ' +
    'Size verilen antiseptik sabunla duş alınız.',
  ameliyat:
    'Ameliyathane Dönemi. Ameliyat sırasında neler yaşanır, ekip ve prosedür. ' +
    'Ameliyathane, bakımınıza adanmış uzmanlar ekibinin yer aldığı son derece kontrollü bir ortamdır. ' +
    'Ameliyat sırasında hiçbir şey hissetmeyeceksiniz.',
  videolar:
    'Videolar. Eğitim videoları ve animasyonlu anlatımlar. ' +
    'Bu bölümde ameliyat sürecini görsel olarak anlamanıza yardımcı olacak eğitim videoları bulunmaktadır.',
  ayarlar:
    'Ayarlar. Yazı boyutu, ses ayarları ve erişilebilirlik seçenekleri. ' +
    'Bu bölümde uygulamayı kendi ihtiyaçlarınıza göre özelleştirebilirsiniz.',
};

// ─── Card definitions ─────────────────────────────────────────────────────────
interface NavCard {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  accentColor: string;
  route: string;
  tag?: string;
  tagColor?: string;
}

const NAV_CARDS: NavCard[] = [
  {
    id: 'genel',
    title: 'GENEL BİLGİLER',
    subtitle: 'Ameliyat hakkında temel bilgiler ve sık sorulan sorular',
    icon: Heart,
    iconBg: '#FFF0F0',
    iconColor: '#D32F2F',
    accentColor: '#D32F2F',
    route: '/topic/genel',
    tag: 'Başlangıç',
    tagColor: '#D32F2F',
  },
  {
    id: 'oncesi',
    title: 'AMELİYAT ÖNCESİ DÖNEM',
    subtitle: 'Hazırlık adımları, ilaçlar ve yapılması gerekenler',
    icon: ClipboardList,
    iconBg: '#E8F1FF',
    iconColor: '#1558A8',
    accentColor: '#1558A8',
    route: '/topic/oncesi',
    tag: 'Önemli',
    tagColor: '#1558A8',
  },
  {
    id: 'ameliyat',
    title: 'AMELİYATHANE DÖNEMİ',
    subtitle: 'Ameliyat sürecinde neler yaşanır, ekip ve prosedür',
    icon: Stethoscope,
    iconBg: '#EDE7F6',
    iconColor: '#5E35B1',
    accentColor: '#5E35B1',
    route: '/topic/ameliyat',
  },
  {
    id: 'videolar',
    title: 'VİDEOLAR',
    subtitle: 'Eğitim videoları ve animasyonlu anlatımlar',
    icon: Video,
    iconBg: '#E6F4EA',
    iconColor: '#2E7D32',
    accentColor: '#2E7D32',
    route: '/topic/videolar',
    tag: 'Yeni',
    tagColor: '#2E7D32',
  },
  {
    id: 'ayarlar',
    title: 'AYARLAR',
    subtitle: 'Yazı boyutu, ses ayarları ve erişilebilirlik seçenekleri',
    icon: Settings,
    iconBg: '#FFF3E0',
    iconColor: '#E65100',
    accentColor: '#E65100',
    route: '/topic/ayarlar',
  },
];

// ─── Animated waveform bar ────────────────────────────────────────────────────
function WaveBar({ delay, baseHeight }: { delay: number; baseHeight: number }) {
  const anim = useRef(new Animated.Value(baseHeight * 0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: baseHeight,
          duration: 380,
          delay,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(anim, {
          toValue: baseHeight * 0.3,
          duration: 380,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [anim, baseHeight, delay]);

  return (
    <Animated.View
      style={[
        styles.waveBar,
        { height: anim },
      ]}
    />
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const router = useRouter();
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Stop speech on unmount
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const handlePlay = useCallback(
    async (card: NavCard) => {
      const isCurrentlyPlaying = playingId === card.id;

      // Always stop whatever is running first
      await Speech.stop();

      if (isCurrentlyPlaying) {
        // Toggle off — just stop
        setPlayingId(null);
        return;
      }

      // Start speaking the new card
      setPlayingId(card.id);
      Speech.speak(SPEECH_TEXTS[card.id] ?? card.title, {
        language: 'tr-TR',
        pitch: 1.0,
        rate: 0.88,
        onDone: () => setPlayingId(null),
        onStopped: () => setPlayingId(null),
        onError: () => {
          setPlayingId(null);
          Alert.alert(
            'Sesli Okuma Hatası',
            'Sesli okuma başlatılamadı. Lütfen cihaz ses ayarlarınızı kontrol ediniz.',
            [{ text: 'Tamam' }]
          );
        },
      });
    },
    [playingId]
  );

  const handleProfile = () => {
    Alert.alert(
      'Profil',
      'Hasta Profili\n\nAd Soyad: Ahmet Yılmaz\nDoktor: Prof. Dr. Mehmet Demir\nAmelyat Tarihi: 25 Şubat 2026\nHastane: Ankara Kalp Merkezi',
      [{ text: 'Kapat', style: 'cancel' }]
    );
  };

  const handleNotifications = () => {
    Alert.alert(
      'Bildirimler',
      '🔔 İlaç Hatırlatıcısı — Kan sulandırıcıyı almayı unutmayın (08:00)\n\n📅 Randevu — Yarın saat 10:30\'da kontrol randevunuz var.\n\n💊 Taburculuk Bilgisi — Yara bakım rehberini okuyunuz.',
      [{ text: 'Tamam', style: 'default' }]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Top Bar ───────────────────────────────────────────────────────── */}
      <View style={styles.topBar}>
        {/* Logo + brand */}
        <View style={styles.logoRow}>
          <View style={styles.logoMark}>
            <Heart size={17} color={C.white} fill={C.white} strokeWidth={0} />
          </View>
          <View>
            <Text style={styles.appName}>KalpSağlık</Text>
            <Text style={styles.appTagline}>Hasta Eğitim Platformu</Text>
          </View>
        </View>

        {/* Action buttons */}
        <View style={styles.topActions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleNotifications}
            activeOpacity={0.75}
            accessibilityLabel="Bildirimleri görüntüle"
            accessibilityRole="button">
            <Bell size={19} color={C.blue} strokeWidth={1.9} />
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>3</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={handleProfile}
            activeOpacity={0.75}
            accessibilityLabel="Profilimi görüntüle"
            accessibilityRole="button">
            <User size={19} color={C.blue} strokeWidth={1.9} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled">

        {/* ── Hero Banner ───────────────────────────────────────────────── */}
        <View style={styles.hero}>
          {/* Decorative circles */}
          <View style={styles.deco1} />
          <View style={styles.deco2} />
          <View style={styles.deco3} />

          <View style={styles.heroContent}>
            <View style={styles.heroPill}>
              <Text style={styles.heroPillText}>Açık Kalp Cerrahisi</Text>
            </View>
            <Text style={styles.heroGreeting}>Hoş Geldiniz</Text>
            <Text style={styles.heroBody}>
              Bu uygulama ameliyat süreciniz boyunca size rehberlik etmek için
              tasarlanmıştır. Aşağıdaki konuları inceleyiniz.
            </Text>

            {/* Stats row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNum}>5</Text>
                <Text style={styles.statLabel}>Konu</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>12</Text>
                <Text style={styles.statLabel}>Video</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNum}>24/7</Text>
                <Text style={styles.statLabel}>Destek</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── TTS info strip ────────────────────────────────────────────── */}
        <View style={styles.ttsStrip}>
          <View style={styles.ttsIconWrap}>
            <Play size={14} color={C.white} fill={C.white} strokeWidth={0} />
          </View>
          <Text style={styles.ttsStripText}>
            Her kartın yanındaki{' '}
            <Text style={styles.ttsStripBold}>kırmızı oynat butonu</Text>
            {' '}ile içeriği sesli dinleyebilirsiniz
          </Text>
        </View>

        {/* ── Section heading ──────────────────────────────────────────── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Eğitim Konuları</Text>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{NAV_CARDS.length} konu</Text>
          </View>
        </View>

        {/* ── Navigation Cards ─────────────────────────────────────────── */}
        {NAV_CARDS.map((card, idx) => (
          <NavCardItem
            key={card.id}
            card={card}
            index={idx}
            isPlaying={playingId === card.id}
            onPlay={() => handlePlay(card)}
            onPress={() => router.push(card.route as never)}
          />
        ))}

        <View style={{ height: 28 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── NavCard component ────────────────────────────────────────────────────────
function NavCardItem({
  card,
  index,
  isPlaying,
  onPlay,
  onPress,
}: {
  card: NavCard;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onPress: () => void;
}) {
  const Icon = card.icon;
  const WAVE_HEIGHTS = [10, 18, 14, 22, 8];

  return (
    <View style={[styles.cardShell, isPlaying && styles.cardShellActive]}>
      {/* Top accent bar */}
      <View style={[styles.cardAccentBar, { backgroundColor: card.accentColor }]} />

      {/* Main row — tapping navigates */}
      <TouchableOpacity
        style={styles.cardRow}
        onPress={onPress}
        activeOpacity={0.82}
        accessibilityLabel={`${card.title} konusuna git`}
        accessibilityRole="button">

        {/* Icon */}
        <View style={[styles.cardIconWrap, { backgroundColor: card.iconBg }]}>
          <Icon size={26} color={card.iconColor} strokeWidth={1.7} />
        </View>

        {/* Text block */}
        <View style={styles.cardTextBlock}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle} numberOfLines={1} adjustsFontSizeToFit>
              {card.title}
            </Text>
            {card.tag && (
              <View
                style={[
                  styles.cardTag,
                  {
                    backgroundColor: (card.tagColor ?? card.accentColor) + '18',
                    borderColor: (card.tagColor ?? card.accentColor) + '45',
                  },
                ]}>
                <Text style={[styles.cardTagText, { color: card.tagColor ?? card.accentColor }]}>
                  {card.tag}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.cardSubtitle} numberOfLines={2}>
            {card.subtitle}
          </Text>
          <Text style={styles.cardIndex}>{String(index + 1).padStart(2, '0')}</Text>
        </View>

        {/* Right: play + chevron */}
        <View style={styles.cardRightActions}>
          {/* Red play/pause button */}
          <TouchableOpacity
            style={[styles.playBtn, isPlaying && styles.playBtnActive]}
            onPress={(e) => {
              e.stopPropagation?.();
              onPlay();
            }}
            hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
            activeOpacity={0.78}
            accessibilityLabel={
              isPlaying
                ? `${card.title} sesini durdur`
                : `${card.title} konusunu sesli oku`
            }
            accessibilityRole="button">
            {isPlaying ? (
              <Pause size={16} color={C.white} fill={C.white} strokeWidth={0} />
            ) : (
              <Play size={16} color={C.white} fill={C.white} strokeWidth={0} />
            )}
          </TouchableOpacity>

          <ChevronRight size={17} color={C.textSoft} strokeWidth={2} />
        </View>
      </TouchableOpacity>

      {/* Playing indicator bar */}
      {isPlaying && (
        <View style={styles.playingStrip}>
          <View style={styles.waveform}>
            {WAVE_HEIGHTS.map((h, i) => (
              <WaveBar key={i} baseHeight={h} delay={i * 80} />
            ))}
          </View>
          <Text style={styles.playingStripText}>Sesli okunuyor…</Text>
          <TouchableOpacity
            onPress={onPlay}
            hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
            accessibilityLabel="Sesli okumayı durdur"
            accessibilityRole="button">
            <Text style={styles.stopLink}>Durdur</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  } as ViewStyle,

  // ── Top Bar
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: C.bg,
  } as ViewStyle,

  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  } as ViewStyle,

  logoMark: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.shadowRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 6,
  } as ViewStyle,

  appName: {
    fontSize: 17,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: -0.4,
  } as TextStyle,

  appTagline: {
    fontSize: 10,
    color: C.textSoft,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 1,
  } as TextStyle,

  topActions: {
    flexDirection: 'row',
    gap: 8,
  } as ViewStyle,

  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.shadowBlue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  notifBadge: {
    position: 'absolute',
    top: 7,
    right: 7,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: C.bg,
  } as ViewStyle,

  notifBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: C.white,
  } as TextStyle,

  // ── Scroll
  scroll: {
    paddingHorizontal: 18,
    paddingBottom: 16,
  },

  // ── Hero Banner
  hero: {
    backgroundColor: C.blue,
    borderRadius: 26,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: 'rgba(13, 63, 124, 0.45)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 12,
  } as ViewStyle,

  heroContent: {
    padding: 26,
    paddingBottom: 28,
  } as ViewStyle,

  heroPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginBottom: 14,
  } as ViewStyle,

  heroPillText: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  } as TextStyle,

  heroGreeting: {
    fontSize: 32,
    fontWeight: '800',
    color: C.white,
    letterSpacing: -0.8,
    marginBottom: 10,
  } as TextStyle,

  heroBody: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.76)',
    lineHeight: 21,
    marginBottom: 22,
    maxWidth: '90%',
  } as TextStyle,

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.13)',
    borderRadius: 15,
    paddingVertical: 14,
    paddingHorizontal: 10,
  } as ViewStyle,

  statItem: {
    flex: 1,
    alignItems: 'center',
  } as ViewStyle,

  statNum: {
    fontSize: 21,
    fontWeight: '800',
    color: C.white,
    letterSpacing: -0.5,
  } as TextStyle,

  statLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.62)',
    fontWeight: '600',
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  } as TextStyle,

  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  } as ViewStyle,

  // Decorative circles
  deco1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.07)',
    top: -55,
    right: -45,
  } as ViewStyle,

  deco2: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255,255,255,0.055)',
    bottom: -35,
    right: 55,
  } as ViewStyle,

  deco3: {
    position: 'absolute',
    width: 65,
    height: 65,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.075)',
    top: 32,
    right: 95,
  } as ViewStyle,

  // ── TTS Strip
  ttsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    backgroundColor: C.redSoft,
    borderWidth: 1,
    borderColor: C.redBorder,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
  } as ViewStyle,

  ttsIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: C.shadowRed,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,

  ttsStripText: {
    flex: 1,
    fontSize: 13,
    color: C.textMid,
    lineHeight: 18.5,
  } as TextStyle,

  ttsStripBold: {
    fontWeight: '700',
    color: C.redDark,
  } as TextStyle,

  // ── Section heading
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  } as ViewStyle,

  sectionTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: -0.4,
  } as TextStyle,

  sectionBadge: {
    backgroundColor: C.bluePale,
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 5,
  } as ViewStyle,

  sectionBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.blue,
  } as TextStyle,

  // ── Card shell
  cardShell: {
    backgroundColor: C.white,
    borderRadius: 20,
    marginBottom: 13,
    overflow: 'hidden',
    shadowColor: C.shadowBlue,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 5,
  } as ViewStyle,

  cardShellActive: {
    shadowColor: C.shadowRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
  } as ViewStyle,

  cardAccentBar: {
    height: 3.5,
    width: '100%',
  } as ViewStyle,

  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 14,
  } as ViewStyle,

  cardIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  } as ViewStyle,

  cardTextBlock: {
    flex: 1,
    minWidth: 0,
  } as ViewStyle,

  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 5,
    flexWrap: 'wrap',
  } as ViewStyle,

  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: C.textDark,
    letterSpacing: 0.3,
    flexShrink: 1,
  } as TextStyle,

  cardTag: {
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 2,
  } as ViewStyle,

  cardTagText: {
    fontSize: 9.5,
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  } as TextStyle,

  cardSubtitle: {
    fontSize: 12.5,
    color: C.textMid,
    lineHeight: 18,
  } as TextStyle,

  cardIndex: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
    color: C.textSoft,
    letterSpacing: 1.2,
  } as TextStyle,

  cardRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 0,
  } as ViewStyle,

  // ── Red Play/Pause button
  playBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: C.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.shadowRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 7,
  } as ViewStyle,

  playBtnActive: {
    backgroundColor: C.redDark,
    shadowRadius: 14,
    elevation: 10,
  } as ViewStyle,

  // ── Playing strip
  playingStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    borderTopWidth: 1,
    borderTopColor: C.redBorder,
    paddingVertical: 9,
    paddingHorizontal: 16,
    gap: 8,
  } as ViewStyle,

  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    height: 24,
  } as ViewStyle,

  waveBar: {
    width: 3.5,
    borderRadius: 2,
    backgroundColor: C.red,
  } as ViewStyle,

  playingStripText: {
    flex: 1,
    fontSize: 12.5,
    fontWeight: '600',
    color: C.red,
  } as TextStyle,

  stopLink: {
    fontSize: 12,
    fontWeight: '700',
    color: C.redDark,
    textDecorationLine: 'underline',
  } as TextStyle,
});
