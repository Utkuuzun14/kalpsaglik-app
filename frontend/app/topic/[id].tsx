import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Heart,
  Pause,
  PlayCircle,
  Settings,
  Stethoscope,
  Video,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  bg: '#F4F8FC',
  white: '#FFFFFF',
  navy: '#0A2342',
  blue: '#1565C0',
  blueMid: '#1976D2',
  blueLight: '#42A5F5',
  bluePale: '#E3F2FD',
  blueSoft: '#BBDEFB',
  blueGhost: '#F0F7FF',
  red: '#D32F2F',
  redSoft: '#FFEBEE',
  textDark: '#0D1B2A',
  textMid: '#3D5A80',
  textSoft: '#7B9EB8',
  border: '#D8E8F5',
  success: '#2E7D32',
  successLight: '#E8F5E9',
  warning: '#E65100',
  warningLight: '#FFF3E0',
  shadow: 'rgba(21, 101, 192, 0.12)',
};

interface ContentSection {
  type: 'heading' | 'body' | 'tip' | 'warning' | 'steps' | 'keypoint';
  text?: string;
  steps?: string[];
  label?: string;
}

interface TopicConfig {
  title: string;
  subtitle: string;
  headerColor: string;
  icon: React.ElementType;
  readTime: string;
  content: ContentSection[];
}

const TOPICS: Record<string, TopicConfig> = {
  genel: {
    title: 'Genel Bilgiler',
    subtitle: 'Açık kalp ameliyatı hakkında temel bilgiler',
    headerColor: '#D32F2F',
    icon: Heart,
    readTime: '5 dk okuma',
    content: [
      {
        type: 'body',
        text: 'Açık kalp ameliyatı, kalp damar hastalıklarının tedavisinde uygulanan kapsamlı bir cerrahi işlemdir. Bu ameliyat; koroner arter hastalığı, kapak hastalıkları ve kalp yetmezliği gibi durumların tedavisinde kullanılır.',
      },
      { type: 'heading', text: 'Ameliyat Neden Gereklidir?' },
      {
        type: 'body',
        text: 'Doktorunuz, kalp fonksiyonlarınızı iyileştirmek ve yaşam kalitenizi artırmak için bu ameliyatı önermiştir. İşlem, kan akışını düzelterek semptomlarınızı azaltacaktır.',
      },
      {
        type: 'keypoint',
        label: 'Önemli Bilgi',
        text: 'Açık kalp ameliyatı, dünya genelinde her yıl milyonlarca kez başarıyla gerçekleştirilmektedir.',
      },
      { type: 'heading', text: 'Ameliyat Sırasında Neler Olur?' },
      {
        type: 'steps',
        steps: [
          'Genel anestezi uygulanarak uykuya geçirilirsiniz',
          'Cerrah göğsünüzün ortasından bir kesi yapar',
          'Göğüs kemiği (sternum) ayrılarak kalbe ulaşılır',
          'Kalp-akciğer bypass makinesi devreye girer',
          'Cerrah etkilenen bölgeyi onarır veya yenisiyle değiştirir',
          'Göğüs teli ve dikişlerle özenle kapatılır',
        ],
      },
      {
        type: 'tip',
        label: 'Güvence',
        text: 'Endişe duymak tamamen normaldir. Cerrahi ekibiniz bu işlemi rutin olarak gerçekleştirmekte ve her adımda yanınızda olacaktır.',
      },
      { type: 'heading', text: 'Ameliyat Ne Kadar Sürer?' },
      {
        type: 'body',
        text: 'Ameliyat karmaşıklığa bağlı olarak genellikle 3 ila 6 saat sürer. Aileniz, belirlenen bekleme alanında bekleyebilir ve hemşire tarafından düzenli olarak bilgilendirilecektir.',
      },
    ],
  },

  oncesi: {
    title: 'Ameliyat Öncesi Dönem',
    subtitle: 'Ameliyata hazırlık için yapmanız gerekenler',
    headerColor: '#1565C0',
    icon: ClipboardList,
    readTime: '7 dk okuma',
    content: [
      {
        type: 'body',
        text: 'İyi bir hazırlık, mümkün olan en iyi sonucun alınmasını sağlar. Ameliyattan önceki günlerde bu talimatları dikkatle uygulayınız.',
      },
      { type: 'heading', text: 'Ameliyat Öncesi Gece' },
      {
        type: 'steps',
        steps: [
          'Gece yarısından itibaren hiçbir şey yemeyiniz ve içmeyiniz',
          'Size verilen antiseptik sabunla duş alınız',
          'Oje ve takılarınızı çıkarınız',
          'Rahat kıyafetler ve kişisel eşyalarla bir çanta hazırlayınız',
          'Sizi götürecek bir yakınınızla anlaşınız',
          'İyi bir gece uykusu çekmeye çalışınız',
        ],
      },
      {
        type: 'warning',
        label: 'Dikkat',
        text: 'Cerrahınız özellikle belirtmedikçe, ameliyattan 7 gün önce kan sulandırıcılar, aspirin veya ibuprofen ALMAYIN.',
      },
      { type: 'heading', text: 'İlaçlarınız' },
      {
        type: 'body',
        text: 'Cerrahi ekibiniz ilaçlarınızı gözden geçirecektir. Bazı ilaçlar ameliyat öncesi kesilmeli, bazıları ise kullanılmaya devam edilmelidir. Her zaman ekibinizle teyit ediniz.',
      },
      {
        type: 'keypoint',
        label: 'Hastaneye Getirin',
        text: 'Tüm ilaçlarınızın (vitamin ve takviyeler dahil) listesi, sigorta kartlarınız ve kimlik belgenizle birlikte gelmeyi unutmayınız.',
      },
      { type: 'heading', text: 'Hastanede Neler Bekleniyor?' },
      {
        type: 'body',
        text: 'Ameliyattan birkaç saat önce hastaneye kabul edileceksiniz. Hemşireler damar yolu açacak, cerrahi bölgeyi hazırlayacak ve son testleri yapacaklardır. Anestezi ekibinden bir üye sizi ziyaret edecektir.',
      },
      {
        type: 'tip',
        label: 'İpucu',
        text: 'Aklınıza gelen soruları yazın ve yanınızda getirin. Hiçbir soru küçük değildir — ekibiniz size yardımcı olmak için buradalar.',
      },
    ],
  },

  ameliyat: {
    title: 'Ameliyathane Dönemi',
    subtitle: 'Ameliyat sırasında neler yaşanır',
    headerColor: '#5E35B1',
    icon: Stethoscope,
    readTime: '6 dk okuma',
    content: [
      {
        type: 'body',
        text: 'Ameliyathane, bakımınıza adanmış bir uzmanlar ekibinin yer aldığı son derece kontrollü bir ortamdır. Süreç hakkında bilgi sahibi olmak korku ve kaygıyı azaltır.',
      },
      { type: 'heading', text: 'Cerrahi Ekibiniz' },
      {
        type: 'steps',
        steps: [
          'Kalp Cerrahı — işlemi yöneten baş hekim',
          'Yardımcı Cerrahlar — operasyona destek verir',
          'Anesteziyolog — güvenliğinizi ve konforunuzu sağlar',
          'Perfüzyonist — kalp-akciğer bypass makinesini çalıştırır',
          'Scrub Hemşiresi — cerrahana aletleri uzatır',
          'Sirkülasyon Hemşiresi — ameliyathane ortamını koordine eder',
        ],
      },
      {
        type: 'keypoint',
        label: 'Güvenliğiniz',
        text: 'Ameliyathane ekibi, işlem öncesinde, sırasında ve sonrasında birden fazla güvenlik kontrolü gerçekleştirir. Refahınız her şeyin önünde gelir.',
      },
      { type: 'heading', text: 'Kalp-Akciğer Bypass Makinesi' },
      {
        type: 'body',
        text: 'Ameliyat sırasında özel bir makine, kalp ve akciğerlerinizin işlevini geçici olarak üstlenir. Bu sayede cerrah durgun bir kalpte çalışabilir. Makine kanı dolaştırır, karbondioksiti uzaklaştırır ve oksijen ekler.',
      },
      {
        type: 'tip',
        label: 'Bilgi',
        text: 'Ameliyat sırasında hiçbir şey hissetmeyeceksiniz. Anesteziyolog sizi tamamen rahat tutacak ve işlem boyunca yakından izleyecektir.',
      },
      { type: 'heading', text: 'Uyanmak' },
      {
        type: 'body',
        text: 'Ameliyat sonrası Yoğun Bakım Ünitesi\'ne (YBÜ) taşınacaksınız. Solunum tüpüyle uyanabilirsiniz; kendi başınıza yeterince soluyabildiğinizde bu tüp genellikle birkaç saat içinde çıkarılır.',
      },
    ],
  },

  videolar: {
    title: 'Videolar',
    subtitle: 'Eğitim videoları ve animasyonlu anlatımlar',
    headerColor: '#2E7D32',
    icon: Video,
    readTime: '4 dk okuma',
    content: [
      {
        type: 'body',
        text: 'Aşağıdaki eğitim videoları, ameliyat sürecini görsel olarak anlamanıza yardımcı olmak için hazırlanmıştır. Tüm videoları kendi hızınızda izleyebilirsiniz.',
      },
      { type: 'heading', text: 'Mevcut Videolar' },
      {
        type: 'steps',
        steps: [
          'Açık Kalp Ameliyatına Giriş (8 dk)',
          'Ameliyat Öncesi Hazırlık Adımları (5 dk)',
          'Ameliyathanede Neler Olur? (10 dk)',
          'YBÜ\'de İlk Gün (6 dk)',
          'Solunum Egzersizleri Nasıl Yapılır? (4 dk)',
          'Taburculuk Sonrası Yara Bakımı (7 dk)',
        ],
      },
      {
        type: 'tip',
        label: 'İpucu',
        text: 'Videoları bir yakınınızla birlikte izlemenizi öneririz. Bu, sizin için önemli olan kişilerin de süreci anlamasına yardımcı olur.',
      },
      { type: 'heading', text: 'Animasyonlar' },
      {
        type: 'body',
        text: 'Kalbinizin nasıl çalıştığını ve ameliyatın tam olarak ne yaptığını gösteren 3 boyutlu animasyonlara da erişebilirsiniz. Bu animasyonlar tıbbi terimler olmadan açık bir dil kullanmaktadır.',
      },
      {
        type: 'keypoint',
        label: 'Erişilebilirlik',
        text: 'Tüm videolarda Türkçe altyazı mevcuttur. Oynatma hızını kendi ihtiyacınıza göre ayarlayabilirsiniz.',
      },
    ],
  },

  ayarlar: {
    title: 'Ayarlar',
    subtitle: 'Erişilebilirlik ve uygulama tercihleri',
    headerColor: '#E65100',
    icon: Settings,
    readTime: '3 dk okuma',
    content: [
      {
        type: 'body',
        text: 'Bu bölümde uygulamayı kendi ihtiyaçlarınıza göre özelleştirebilirsiniz. Yaşlı ve görme güçlüğü çeken kullanıcılar için özel seçenekler mevcuttur.',
      },
      { type: 'heading', text: 'Görünüm Ayarları' },
      {
        type: 'steps',
        steps: [
          'Yazı boyutunu küçük, orta veya büyük olarak seçin',
          'Yüksek kontrast modu açık/kapalı',
          'Gece modu için koyu tema seçeneği',
          'Ekran parlaklığını ayarlayın',
        ],
      },
      { type: 'heading', text: 'Ses ve Konuşma' },
      {
        type: 'steps',
        steps: [
          'Sesli okuma hızını yavaş, orta veya hızlı olarak ayarlayın',
          'Ses yüksekliğini kontrol edin',
          'Türkçe veya İngilizce ses dili seçin',
          'Otomatik oynatmayı etkinleştirin',
        ],
      },
      {
        type: 'keypoint',
        label: 'Erişilebilirlik',
        text: 'Bu uygulama, ekran okuyucu (VoiceOver/TalkBack) ile tam uyumlu olacak şekilde tasarlanmıştır.',
      },
      { type: 'heading', text: 'Bildirim Tercihleri' },
      {
        type: 'body',
        text: 'İlaç hatırlatıcıları, randevu bildirimleri ve sağlık ipuçları için bildirimleri özelleştirebilirsiniz.',
      },
      {
        type: 'tip',
        label: 'Öneri',
        text: 'Sesli okuma özelliğini etkinleştirmenizi tavsiye ederiz. Bu, özellikle uzun içerikleri gözden geçirirken oldukça kullanışlıdır.',
      },
    ],
  },
};

export default function TopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);

  const topic = TOPICS[id ?? ''] ?? TOPICS['genel'];
  const Icon = topic.icon;

  const allTopicIds = Object.keys(TOPICS);
  const currentIndex = allTopicIds.indexOf(id ?? 'genel');
  const prevId = currentIndex > 0 ? allTopicIds[currentIndex - 1] : null;
  const nextId = currentIndex < allTopicIds.length - 1 ? allTopicIds[currentIndex + 1] : null;

  return (
    <SafeAreaView style={s.safe}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.back()}
          accessibilityLabel="Geri git">
          <ChevronLeft size={22} color={C.blue} strokeWidth={2.2} />
        </TouchableOpacity>
        <Text style={s.headerLabel} numberOfLines={1}>Hasta Eğitimi</Text>
        <TouchableOpacity
          style={[s.ttsBtn, isPlaying && s.ttsBtnActive]}
          onPress={() => setIsPlaying((v) => !v)}
          accessibilityLabel={isPlaying ? 'Sesi durdur' : 'Bu sayfayı sesli oku'}>
          {isPlaying ? (
            <Pause size={18} color={C.white} strokeWidth={2} />
          ) : (
            <PlayCircle size={20} color={C.red} strokeWidth={1.8} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero ── */}
        <View style={[s.hero, { borderTopColor: topic.headerColor }]}>
          <View style={[s.heroIcon, { backgroundColor: topic.headerColor + '15' }]}>
            <Icon size={30} color={topic.headerColor} strokeWidth={1.8} />
          </View>
          <View style={s.heroText}>
            <Text style={s.heroTitle}>{topic.title}</Text>
            <Text style={s.heroSub}>{topic.subtitle}</Text>
          </View>
          <View style={[s.readBadge, { backgroundColor: topic.headerColor + '12', borderColor: topic.headerColor + '30' }]}>
            <Text style={[s.readBadgeText, { color: topic.headerColor }]}>{topic.readTime}</Text>
          </View>
        </View>

        {/* ── Playing banner ── */}
        {isPlaying && (
          <View style={s.playingBanner}>
            <View style={s.waveform}>
              {[10, 18, 14, 22, 8, 16, 12].map((h, i) => (
                <View key={i} style={[s.waveBar, { height: h }]} />
              ))}
            </View>
            <Text style={s.playingText}>Sesli okunuyor…</Text>
            <TouchableOpacity onPress={() => setIsPlaying(false)}>
              <Text style={s.stopText}>Durdur</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── Content ── */}
        <View style={s.content}>
          {topic.content.map((section, i) => (
            <ContentBlock key={i} section={section} accent={topic.headerColor} />
          ))}
        </View>

        {/* ── Nav Footer ── */}
        <View style={s.navFooter}>
          {prevId ? (
            <TouchableOpacity
              style={s.navBtn}
              onPress={() => router.replace(`/topic/${prevId}` as never)}
              accessibilityLabel={`Önceki: ${TOPICS[prevId]?.title}`}>
              <ChevronLeft size={18} color={C.blue} strokeWidth={2} />
              <View>
                <Text style={s.navLabel}>Önceki</Text>
                <Text style={s.navTitle} numberOfLines={1}>{TOPICS[prevId]?.title}</Text>
              </View>
            </TouchableOpacity>
          ) : <View style={{ flex: 1 }} />}

          {nextId ? (
            <TouchableOpacity
              style={[s.navBtn, s.navBtnRight]}
              onPress={() => router.replace(`/topic/${nextId}` as never)}
              accessibilityLabel={`Sonraki: ${TOPICS[nextId]?.title}`}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={s.navLabel}>Sonraki</Text>
                <Text style={s.navTitle} numberOfLines={1}>{TOPICS[nextId]?.title}</Text>
              </View>
              <ChevronRight size={18} color={C.blue} strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[s.navBtn, s.navBtnRight, s.finishBtn]}
              onPress={() => router.back()}>
              <Text style={s.finishText}>Ana Sayfa</Text>
              <Heart size={15} color={C.white} fill={C.white} strokeWidth={0} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContentBlock({ section, accent }: { section: ContentSection; accent: string }) {
  if (section.type === 'heading') {
    return (
      <View style={sb.headingRow}>
        <View style={[sb.headingLine, { backgroundColor: accent }]} />
        <Text style={sb.headingText}>{section.text}</Text>
      </View>
    );
  }

  if (section.type === 'body') {
    return <Text style={sb.body}>{section.text}</Text>;
  }

  if (section.type === 'steps') {
    return (
      <View style={sb.stepsCard}>
        {section.steps?.map((step, i) => (
          <View key={i} style={sb.stepRow}>
            <View style={[sb.stepNum, { backgroundColor: accent + '18' }]}>
              <Text style={[sb.stepNumText, { color: accent }]}>{i + 1}</Text>
            </View>
            <Text style={sb.stepText}>{step}</Text>
          </View>
        ))}
      </View>
    );
  }

  if (section.type === 'tip') {
    return (
      <View style={[sb.callout, sb.tipBox]}>
        <View style={sb.calloutHead}>
          <View style={[sb.calloutDot, { backgroundColor: C.success }]} />
          <Text style={[sb.calloutLabel, { color: C.success }]}>{section.label ?? 'İpucu'}</Text>
        </View>
        <Text style={sb.calloutBody}>{section.text}</Text>
      </View>
    );
  }

  if (section.type === 'warning') {
    return (
      <View style={[sb.callout, sb.warnBox]}>
        <View style={sb.calloutHead}>
          <AlertCircle size={15} color={C.warning} strokeWidth={2} />
          <Text style={[sb.calloutLabel, { color: C.warning }]}>{section.label ?? 'Uyarı'}</Text>
        </View>
        <Text style={sb.calloutBody}>{section.text}</Text>
      </View>
    );
  }

  if (section.type === 'keypoint') {
    return (
      <View style={[sb.callout, sb.keyBox]}>
        <View style={sb.calloutHead}>
          <View style={[sb.calloutDot, { backgroundColor: C.blue }]} />
          <Text style={[sb.calloutLabel, { color: C.blue }]}>{section.label ?? 'Anahtar Nokta'}</Text>
        </View>
        <Text style={sb.calloutBody}>{section.text}</Text>
      </View>
    );
  }

  return null;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg } as ViewStyle,

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.bg,
    gap: 12,
  } as ViewStyle,
  backBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  } as ViewStyle,
  headerLabel: {
    flex: 1, fontSize: 15, fontWeight: '700',
    color: C.textMid, textAlign: 'center',
  } as TextStyle,
  ttsBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: C.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  } as ViewStyle,
  ttsBtnActive: { backgroundColor: C.red } as ViewStyle,

  scroll: { paddingBottom: 44 },

  hero: {
    backgroundColor: C.white,
    marginHorizontal: 18, borderRadius: 20,
    padding: 18, flexDirection: 'row', alignItems: 'center',
    gap: 14, marginBottom: 14,
    borderTopWidth: 4,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1, shadowRadius: 14, elevation: 5,
  } as ViewStyle,
  heroIcon: {
    width: 56, height: 56, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  } as ViewStyle,
  heroText: { flex: 1 } as ViewStyle,
  heroTitle: {
    fontSize: 17, fontWeight: '800', color: C.textDark,
    letterSpacing: -0.3, marginBottom: 4,
  } as TextStyle,
  heroSub: { fontSize: 12.5, color: C.textMid, lineHeight: 17 } as TextStyle,
  readBadge: {
    borderRadius: 8, borderWidth: 1,
    paddingHorizontal: 9, paddingVertical: 4, alignSelf: 'flex-start',
  } as ViewStyle,
  readBadgeText: { fontSize: 10.5, fontWeight: '700' } as TextStyle,

  playingBanner: {
    backgroundColor: C.red, marginHorizontal: 18, borderRadius: 14,
    padding: 13, flexDirection: 'row', alignItems: 'center',
    gap: 10, marginBottom: 14,
  } as ViewStyle,
  waveform: { flexDirection: 'row', alignItems: 'center', gap: 3 } as ViewStyle,
  waveBar: { width: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.75)' } as ViewStyle,
  playingText: { flex: 1, color: C.white, fontSize: 13.5, fontWeight: '600' } as TextStyle,
  stopText: {
    color: 'rgba(255,255,255,0.85)', fontSize: 12,
    fontWeight: '700', textDecorationLine: 'underline',
  } as TextStyle,

  content: { paddingHorizontal: 18, gap: 14 } as ViewStyle,

  navFooter: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 18, paddingTop: 28, gap: 12,
  } as ViewStyle,
  navBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: C.white, borderRadius: 16,
    padding: 14, gap: 8,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 10, elevation: 3,
  } as ViewStyle,
  navBtnRight: { justifyContent: 'flex-end' } as ViewStyle,
  navLabel: {
    fontSize: 10, color: C.textSoft, fontWeight: '700',
    letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 2,
  } as TextStyle,
  navTitle: { fontSize: 12.5, fontWeight: '700', color: C.textDark } as TextStyle,
  finishBtn: {
    backgroundColor: C.blue, flex: 0,
    paddingHorizontal: 20, gap: 8, justifyContent: 'center',
  } as ViewStyle,
  finishText: { color: C.white, fontSize: 14, fontWeight: '700' } as TextStyle,
});

const sb = StyleSheet.create({
  headingRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, marginTop: 4, marginBottom: 2,
  } as ViewStyle,
  headingLine: { width: 4, height: 22, borderRadius: 2 } as ViewStyle,
  headingText: {
    fontSize: 16.5, fontWeight: '800', color: C.textDark,
    letterSpacing: -0.2, flex: 1,
  } as TextStyle,

  body: {
    fontSize: 15, color: C.textMid, lineHeight: 23,
  } as TextStyle,

  stepsCard: {
    backgroundColor: C.white, borderRadius: 16,
    padding: 16, gap: 12,
    shadowColor: C.shadow, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1, shadowRadius: 8, elevation: 3,
  } as ViewStyle,
  stepRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 12,
  } as ViewStyle,
  stepNum: {
    width: 28, height: 28, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0, marginTop: 1,
  } as ViewStyle,
  stepNumText: { fontSize: 13, fontWeight: '800' } as TextStyle,
  stepText: {
    flex: 1, fontSize: 14.5, color: C.textDark,
    lineHeight: 21, paddingTop: 4,
  } as TextStyle,

  callout: { borderRadius: 14, padding: 15, gap: 8 } as ViewStyle,
  tipBox: { backgroundColor: C.successLight } as ViewStyle,
  warnBox: { backgroundColor: C.warningLight } as ViewStyle,
  keyBox: { backgroundColor: C.bluePale } as ViewStyle,

  calloutHead: {
    flexDirection: 'row', alignItems: 'center', gap: 7,
  } as ViewStyle,
  calloutDot: { width: 8, height: 8, borderRadius: 4 } as ViewStyle,
  calloutLabel: {
    fontSize: 11, fontWeight: '800',
    letterSpacing: 0.6, textTransform: 'uppercase',
  } as TextStyle,
  calloutBody: {
    fontSize: 14.5, color: C.textDark, lineHeight: 21,
  } as TextStyle,
});
