const fs = require('fs');
const path = require('path');
const { page, buildHome, SITE_URL } = require('./generate.js');
const { posts, formatDate } = require('./build-blog.js');
const iller = require('./data/iller.json');
const root = __dirname;

// ---------- Anasayfa (blog kartları enjekte edilmiş) ----------
const home = buildHome();
const latestPosts = posts.slice().sort((a,b)=> new Date(b.tarih)-new Date(a.tarih)).slice(0,3);
const blogCardsHtml = latestPosts.map(p => `
  <div class="blog-card">
    <span class="tag">${p.etiket}</span>
    <h3><a href="blog/${p.slug}.html">${p.baslik}</a></h3>
    <p>${p.ozet}</p>
    <a href="blog/${p.slug}.html" class="il-link">Yazıyı oku →</a>
  </div>`).join('\n');
const homeBody = home.bodyHtml.replace('<!--BLOG_CARDS-->', blogCardsHtml);

fs.writeFileSync(path.join(root,'index.html'), page({
  title: `Keşif Atlası — Türkiye'nin 81 İli Gezi Rehberi`,
  description: `Türkiye'nin 81 ilini tarihi, mutfağı ve gezilecek yerleriyle keşfedin. Bölge bölge gezi rehberleri, blog yazıları ve seyahat tavsiyeleri.`,
  canonicalPath: home.canonicalPath,
  bodyHtml: homeBody,
  jsonLd: {
    "@context":"https://schema.org",
    "@type":"WebSite",
    "name":"Keşif Atlası",
    "url": SITE_URL,
    "description":"Türkiye'nin 81 ilini tanıtan bağımsız gezi rehberi."
  }
}));

// ---------- Hakkımızda ----------
fs.writeFileSync(path.join(root,'hakkimizda.html'), page({
  title: `Hakkımızda | Keşif Atlası`,
  description: `Keşif Atlası'nın hikayesi, amacı ve içerik yaklaşımı hakkında bilgi edinin.`,
  canonicalPath: '/hakkimizda.html',
  bodyHtml: `
<div class="wrap section">
  <div class="simple-page">
    <h1>Hakkımızda</h1>
    <p>Keşif Atlası, Türkiye'nin 81 ilini tek tek, ayrıntılı ve güncel bilgilerle tanıtmak amacıyla kurulmuş bağımsız bir gezi rehberi platformudur. Amacımız; her ilin tarihini, doğal güzelliklerini, yöresel mutfağını ve gezginler için pratik bilgileri tek bir yerde toplamak.</p>
    <h2>Neden Keşif Atlası?</h2>
    <p>Türkiye'yi gezerken çoğu zaman bilgiler farklı kaynaklara dağılmış oluyor: bir sitede gezilecek yerler, başka bir sitede yöresel lezzetler, bir başkasında ulaşım bilgileri... Keşif Atlası'nı kurma fikri, tüm bu bilgileri il il, düzenli bir formatta bir araya getirme ihtiyacından doğdu.</p>
    <h2>İçerik Yaklaşımımız</h2>
    <p>Her il sayfası; genel tanıtım, gezilecek yerler, yöresel lezzetler ve en iyi ziyaret zamanı gibi başlıklar altında düzenlenir. Blog bölümümüzde ise mevsimlik rota önerileri, tema bazlı geziler (yayla turizmi, kış turizmi, gastronomi rotaları gibi) ve pratik seyahat tavsiyeleri paylaşıyoruz.</p>
    <p>İçeriklerimizi sürekli güncelliyor ve genişletiyoruz. Bir ilde eksik ya da güncel olmayan bir bilgi fark ederseniz, <a href="./iletisim.html">iletişim sayfamızdan</a> bize ulaşabilirsiniz.</p>
    <h2>Bağımsızlık</h2>
    <p>Keşif Atlası herhangi bir seyahat acentesi veya turizm kurumuyla bağlantılı değildir; içeriklerimiz tamamen editoryal bağımsızlıkla hazırlanır.</p>
  </div>
</div>`
}));

// ---------- İletişim ----------
fs.writeFileSync(path.join(root,'iletisim.html'), page({
  title: `İletişim | Keşif Atlası`,
  description: `Keşif Atlası ile iletişime geçin: öneri, düzeltme veya iş birliği talepleriniz için bize ulaşın.`,
  canonicalPath: '/iletisim.html',
  bodyHtml: `
<div class="wrap section">
  <div class="simple-page">
    <h1>İletişim</h1>
    <p>Görüş, öneri, düzeltme talebi ya da iş birliği teklifleriniz için bizimle iletişime geçebilirsiniz.</p>
    <h2>E-posta</h2>
    <p>Genel sorularınız için: <a href="mailto:info@kesifatlasi.com">info@kesifatlasi.com</a></p>
    <p>İçerik düzeltme/güncelleme bildirimi için: <a href="mailto:icerik@kesifatlasi.com">icerik@kesifatlasi.com</a></p>
    <h2>Not</h2>
    <p>E-posta adreslerini kendi alan adınıza göre güncellemeyi unutmayın. Mesajlarınıza genellikle 2-3 iş günü içinde dönüş yapılır.</p>
  </div>
</div>`
}));

// ---------- Gizlilik Politikası ----------
fs.writeFileSync(path.join(root,'gizlilik-politikasi.html'), page({
  title: `Gizlilik Politikası | Keşif Atlası`,
  description: `Keşif Atlası gizlilik politikası: veri toplama, çerezler ve reklam ortaklarına ilişkin bilgiler.`,
  canonicalPath: '/gizlilik-politikasi.html',
  bodyHtml: `
<div class="wrap section">
  <div class="simple-page">
    <h1>Gizlilik Politikası</h1>
    <p><em>Son güncelleme: [tarih girin]</em></p>
    <p>Bu Gizlilik Politikası, Keşif Atlası (kesifatlasi.com) web sitesini ziyaret ettiğinizde hangi bilgilerin nasıl toplandığını ve kullanıldığını açıklar.</p>
    <h2>Topladığımız Bilgiler</h2>
    <p>Sitemizi ziyaret ettiğinizde, standart sunucu günlükleri (IP adresi, tarayıcı türü, ziyaret edilen sayfalar) otomatik olarak kaydedilebilir. İletişim formu veya e-posta yoluyla bize ulaştığınızda paylaştığınız bilgiler yalnızca yanıt vermek amacıyla kullanılır.</p>
    <h2>Çerezler (Cookies)</h2>
    <p>Sitemiz, kullanıcı deneyimini iyileştirmek ve trafik analizi yapmak amacıyla çerezler kullanabilir. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.</p>
    <h2>Reklamlar ve Üçüncü Taraf Hizmetler</h2>
    <p>Sitemizde Google AdSense gibi üçüncü taraf reklam ağları reklam gösterebilir. Bu hizmetler, ilgi alanlarınıza dayalı reklam sunmak amacıyla çerezler kullanabilir. Google'ın reklam çerezlerini nasıl kullandığı hakkında bilgi almak ve tercih ayarlarınızı yönetmek için <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google Reklam Politikaları</a> sayfasını ziyaret edebilirsiniz.</p>
    <p>Ayrıca web sitemiz, ziyaretçi davranışlarını analiz etmek için Google Analytics gibi araçlar kullanabilir.</p>
    <h2>Bilgilerin Paylaşımı</h2>
    <p>Kişisel bilgileriniz, yasal zorunluluklar dışında üçüncü taraflarla paylaşılmaz veya satılmaz.</p>
    <h2>Veri Güvenliği</h2>
    <p>Kişisel verilerinizin güvenliğini sağlamak için makul teknik önlemler alınmaktadır; ancak internet üzerinden hiçbir veri iletiminin %100 güvenli olmadığını unutmayınız.</p>
    <h2>Politika Değişiklikleri</h2>
    <p>Bu gizlilik politikası zaman zaman güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.</p>
    <h2>İletişim</h2>
    <p>Gizlilik politikasıyla ilgili sorularınız için <a href="./iletisim.html">iletişim sayfamızdan</a> bize ulaşabilirsiniz.</p>
    <p style="margin-top:2em;color:#a63d2f;"><strong>Not:</strong> Bu metin genel bir taslaktır; siteye özel gerçek uygulamalarınızı (kullandığınız analiz/reklam araçları, veri saklama süreleri vb.) yansıtacak şekilde güncellemeniz ve gerekirse bir hukuk danışmanına onaylatmanız önerilir.</p>
  </div>
</div>`
}));

// ---------- Kullanım Şartları ----------
fs.writeFileSync(path.join(root,'kullanim-sartlari.html'), page({
  title: `Kullanım Şartları | Keşif Atlası`,
  description: `Keşif Atlası web sitesini kullanırken geçerli olan kullanım şartları ve koşulları.`,
  canonicalPath: '/kullanim-sartlari.html',
  bodyHtml: `
<div class="wrap section">
  <div class="simple-page">
    <h1>Kullanım Şartları</h1>
    <p><em>Son güncelleme: [tarih girin]</em></p>
    <p>Keşif Atlası'nı (kesifatlasi.com) kullanarak aşağıdaki şartları kabul etmiş sayılırsınız.</p>
    <h2>İçeriğin Kullanımı</h2>
    <p>Sitemizdeki metin, görsel ve diğer içerikler bilgilendirme amaçlıdır. İçeriklerin izinsiz kopyalanması, çoğaltılması veya ticari amaçla kullanılması yasaktır.</p>
    <h2>Bilgilerin Doğruluğu</h2>
    <p>Gezi rehberlerimizdeki bilgileri (açılış saatleri, ulaşım, fiyatlar vb.) güncel tutmaya özen gösteriyoruz; ancak seyahat öncesinde bilgileri resmi kaynaklardan teyit etmenizi öneririz. Keşif Atlası, sitedeki bilgilerin güncelliğinden veya eksiksizliğinden kaynaklanan zararlardan sorumlu tutulamaz.</p>
    <h2>Dış Bağlantılar</h2>
    <p>Sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin içeriğinden veya gizlilik uygulamalarından Keşif Atlası sorumlu değildir.</p>
    <h2>Sorumluluk Sınırlaması</h2>
    <p>Sitenin kullanımından doğabilecek doğrudan veya dolaylı zararlardan Keşif Atlası sorumlu tutulamaz.</p>
    <h2>Değişiklikler</h2>
    <p>Bu kullanım şartları önceden haber verilmeksizin güncellenebilir. Güncel sürüm her zaman bu sayfada yayınlanır.</p>
    <h2>İletişim</h2>
    <p>Sorularınız için <a href="./iletisim.html">iletişim sayfamızı</a> kullanabilirsiniz.</p>
  </div>
</div>`
}));

// ---------- robots.txt ----------
fs.writeFileSync(path.join(root,'robots.txt'), `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);

// ---------- sitemap.xml'i blog URL'leriyle güncelle ----------
const staticUrls = ['/', '/iller/index.html', '/blog/index.html', '/hakkimizda.html', '/iletisim.html', '/gizlilik-politikasi.html', '/kullanim-sartlari.html'];
const ilUrls = iller.map(il => `/iller/${il.slug}.html`);
const blogUrls = posts.map(p => `/blog/${p.slug}.html`);
const allUrls = [...staticUrls, ...ilUrls, ...blogUrls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(root,'sitemap.xml'), sitemap);

console.log('✔ index.html (blog kartlarıyla) üretildi.');
console.log('✔ hakkimizda.html, iletisim.html, gizlilik-politikasi.html, kullanim-sartlari.html üretildi.');
console.log('✔ robots.txt üretildi.');
console.log(`✔ sitemap.xml ${allUrls.length} URL ile güncellendi.`);
