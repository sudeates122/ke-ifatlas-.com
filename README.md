# Keşif Atlası — Türkiye'nin 81 İli Gezi Rehberi

Bu proje, statik bir Node.js "site üretici" (static site generator) mantığıyla çalışır:
tüm il bilgileri `data/iller.json` içinde tutulur, script'ler bu veriden gerçek HTML
sayfaları üretir. Böylece 81 sayfayı tek tek elle yazmak yerine, veriyi güncelleyip
tekrar üretebilirsiniz.

## Klasör Yapısı

```
data/iller.json        → 81 ilin verisi (bölge, plaka, gezilecek yerler, lezzetler, en iyi zaman)
data/blog.json          → Blog yazılarının içeriği
generate.js             → İl sayfalarını + iller/index.html + sitemap iskeletini üretir
build-blog.js           → Blog sayfalarını üretir
build-pages.js          → Ana sayfa, Hakkımızda, İletişim, Gizlilik, Kullanım Şartları, robots.txt, nihai sitemap.xml
build.sh                → Üçünü sırayla çalıştıran kısayol
assets/css/style.css    → Tüm sitenin tasarımı (tek dosya)
iller/                  → Üretilen 81 il sayfası (otomatik oluşturulur, elle düzenlemeyin)
blog/                   → Üretilen blog sayfaları (otomatik oluşturulur, elle düzenlemeyin)
```

## Siteyi Yeniden Üretmek

İçerikte değişiklik yaptıktan sonra (örneğin bir ile yeni bir cümle eklediğinizde),
sadece şunu çalıştırın:

```bash
bash build.sh
```

Bu komut `iller/`, `blog/`, `index.html`, `sitemap.xml`, `robots.txt` ve zorunlu
sayfaları güncelleyerek yeniden oluşturur. **`iller/*.html` ve `blog/*.html`
dosyalarını doğrudan elle düzenlemeyin** — bir sonraki `build.sh` çalıştırmasında
üzerine yazılır. Değişikliği her zaman `data/iller.json` veya `data/blog.json`
içinde yapın.

## Yeni Bir İl Alanı veya Blog Yazısı Eklemek

- Bir ile yeni bilgi eklemek için `data/iller.json` içindeki ilgili nesneyi
  düzenleyin (örneğin `gezilecek` dizisine yeni bir yer ekleyin).
- Yeni bir blog yazısı eklemek için `data/blog.json`'a aynı formatta yeni bir
  nesne ekleyin (`govde` dizisi `h2` ve `p` bloklarından oluşur).
- Ardından `bash build.sh` çalıştırın.

## AdSense Onayı İçin Yapmanız Gerekenler (Önemli)

Bu iskelet, AdSense'in aradığı temel unsurları (özgün metin, iç linkleme,
Hakkımızda/İletişim/Gizlilik/Kullanım Şartları sayfaları, sitemap, temiz HTML)
sağlar. Ancak onay şansınızı artırmak için mutlaka şunları yapın:

1. **`generate.js` dosyasının en üstündeki `SITE_URL` değişkenini** kendi gerçek
   alan adınızla güncel tutun (şu an `https://xn--keifatlas-3pb21c.com` olarak
   ayarlı — Punycode yerine tarayıcıda göründüğü haliyle de test edin).
2. `iletisim.html` içindeki e-posta adreslerini gerçek adreslerinizle değiştirin.
3. `gizlilik-politikasi.html` ve `kullanim-sartlari.html` içindeki `[tarih girin]`
   alanlarını doldurun; kullandığınız gerçek analiz/reklam araçlarını yansıtacak
   şekilde metni gözden geçirin (taslak metin bir hukuk danışmanına onaylatılmadan
   yasal garanti oluşturmaz).
4. **En az 15-20 il sayfasını elle zenginleştirin**: kendi çektiğiniz fotoğraflar,
   kişisel gezi notları, ulaşım/nasıl gidilir bilgisi ekleyin. Otomatik üretilen
   ~400 kelimelik metin iyi bir başlangıçtır ama Google, tamamen şablon hissi veren
   siteleri düşük değerlendirebilir; gerçek deneyim ve özgün fotoğraflar en güçlü
   sinyaldir.
5. **Görsellere gerçek fotoğraf ekleyin** (şu an sayfalarda görsel yok — telifsiz
   olmayan/kendi çektiğiniz fotoğrafları `assets/img/` gibi bir klasöre koyup
   şablona ekleyin) ve her görsele açıklayıcı `alt` metni yazın.
6. Siteyi yayına aldıktan sonra `sitemap.xml`'i Google Search Console'a gönderin
   ve en az birkaç hafta organik trafik/indexlenme birikmesini bekleyin —
   AdSense genelde çok yeni sitelerde temkinli davranır.
7. `SITE_URL/robots.txt` ve `SITE_URL/sitemap.xml` adreslerinin yayında gerçekten
   erişilebilir olduğunu kontrol edin.

## GitHub'a Yükleme

Bu klasördeki tüm dosyaları (üretilmiş `iller/`, `blog/`, `index.html` dahil)
reponuza push edip GitHub Pages, Netlify veya Vercel gibi bir statik hosting
servisine bağlayabilirsiniz. Node.js sadece içerik üretimi (build) aşamasında
gereklidir; yayınlanan site tamamen statik HTML/CSS'tir, sunucu tarafında
çalışan hiçbir kod yoktur.
