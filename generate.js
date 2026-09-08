// generate.js — Keşif Atlası statik site üretici
// Kullanım: node generate.js
// data/iller.json içindeki veriden 81 il sayfası + il listesi + sitemap üretir.

const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://xn--keifatlas-3pb21c.com'; // gerçek alan adınız
const iller = require('./data/iller.json');
const root = __dirname;

const bolgeSira = ['Marmara','Ege','Akdeniz','İç Anadolu','Karadeniz','Doğu Anadolu','Güneydoğu Anadolu'];

const bolgeRenk = {
  'Marmara':'#2E5E52',
  'Ege':'#7A6B2E',
  'Akdeniz':'#1F5A6B',
  'İç Anadolu':'#6B4A2E',
  'Karadeniz':'#1F3A34',
  'Doğu Anadolu':'#4A3A6B',
  'Güneydoğu Anadolu':'#6B2E2E'
};

function heroSvg(il) {
  const c = bolgeRenk[il.bolge] || '#1F3A34';
  const seed = il.slug.split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);
  const off1 = 40 + (seed % 30);
  const off2 = 90 + (seed % 40);
  const off3 = 150 + (seed % 25);
  return `<svg class="il-hero-svg" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${il.isim} atlas illüstrasyonu">
  <rect width="800" height="300" fill="${c}"/>
  <path d="M0,${off1} C150,${off1-30} 300,${off1+40} 450,${off1} C600,${off1-30} 700,${off1+30} 800,${off1} L800,0 L0,0 Z" fill="#000" opacity="0.10"/>
  <path d="M0,${off2} C180,${off2-25} 320,${off2+35} 500,${off2} C650,${off2-20} 720,${off2+25} 800,${off2} L800,300 L0,300 Z" fill="#000" opacity="0.14"/>
  <path d="M0,${off3} C160,${off3+20} 340,${off3-30} 520,${off3} C660,${off3+15} 740,${off3-15} 800,${off3} L800,300 L0,300 Z" fill="#000" opacity="0.18"/>
  <g transform="translate(56,54)" opacity="0.85">
    <circle r="22" fill="none" stroke="#C9A227" stroke-width="1.5"/>
    <path d="M0,-22 L5,-5 L0,0 L-5,-5 Z" fill="#C9A227"/>
    <path d="M0,22 L5,5 L0,0 L-5,5 Z" fill="#EAE2C8" opacity="0.6"/>
    <path d="M22,0 L5,5 L0,0 L5,-5 Z" fill="#EAE2C8" opacity="0.4"/>
    <path d="M-22,0 L-5,5 L0,0 L-5,-5 Z" fill="#EAE2C8" opacity="0.4"/>
  </g>
  <text x="740" y="270" text-anchor="end" font-family="Fraunces, serif" font-size="120" fill="#ffffff" opacity="0.08" font-weight="600">${il.plaka}</text>
</svg>`;
}

function head(title, description, canonicalPath, extraJsonLd) {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${description}">
<link rel="canonical" href="${SITE_URL}${canonicalPath}">
<meta property="og:type" content="website">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${SITE_URL}${canonicalPath}">
<meta name="twitter:card" content="summary">
<link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%231F3A34%22/><path d=%22M50 15 L58 42 L85 42 L63 58 L71 85 L50 68 L29 85 L37 58 L15 42 L42 42 Z%22 fill=%22%23C9A227%22/></svg>">
<link rel="stylesheet" href="${relPrefix(canonicalPath)}assets/css/style.css">
${extraJsonLd || ''}
</head>
`;
}

function relPrefix(canonicalPath) {
  // canonicalPath like "/" or "/iller/istanbul.html" or "/blog/xxx.html"
  const depth = canonicalPath.split('/').filter(Boolean).length - (canonicalPath.endsWith('/') ? 0 : 1);
  return depth > 0 ? '../'.repeat(depth) : './';
}

function header(canonicalPath) {
  const p = relPrefix(canonicalPath);
  return `<a class="skip-link" href="#icerik">İçeriğe geç</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="${p}index.html">
      <svg width="28" height="28" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#12241F"/><path d="M50 15 L58 42 L85 42 L63 58 L71 85 L50 68 L29 85 L37 58 L15 42 L42 42 Z" fill="#C9A227"/></svg>
      <span>Keşif Atlası</span>
    </a>
    <nav class="main-nav" aria-label="Ana menü">
      <ul>
        <li><a href="${p}iller/index.html">81 İl</a></li>
        <li><a href="${p}blog/index.html">Blog</a></li>
        <li><a href="${p}hakkimizda.html">Hakkımızda</a></li>
        <li><a href="${p}iletisim.html">İletişim</a></li>
      </ul>
    </nav>
  </div>
</header>
`;
}

function footer(canonicalPath) {
  const p = relPrefix(canonicalPath);
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <h4>Keşif Atlası</h4>
        <p style="max-width:38ch;color:#c9c2a2;font-size:.94rem;">Türkiye'nin 81 ilini; tarihi, mutfağı ve gezilecek yerleriyle tek tek anlatan bağımsız bir gezi rehberi.</p>
      </div>
      <div>
        <h4>Keşfet</h4>
        <ul>
          <li><a href="${p}iller/index.html">Tüm İller</a></li>
          <li><a href="${p}blog/index.html">Blog Yazıları</a></li>
        </ul>
      </div>
      <div>
        <h4>Kurumsal</h4>
        <ul>
          <li><a href="${p}hakkimizda.html">Hakkımızda</a></li>
          <li><a href="${p}iletisim.html">İletişim</a></li>
          <li><a href="${p}gizlilik-politikasi.html">Gizlilik Politikası</a></li>
          <li><a href="${p}kullanim-sartlari.html">Kullanım Şartları</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${year} Keşif Atlası. Tüm hakları saklıdır.</span>
      <span>Türkiye'yi il il keşfedin.</span>
    </div>
  </div>
</footer>
`;
}

function page({title, description, canonicalPath, bodyHtml, jsonLd}) {
  return head(title, description, canonicalPath, jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : '') +
`<body>
${header(canonicalPath)}
<main id="icerik">
${bodyHtml}
</main>
${footer(canonicalPath)}
</body>
</html>`;
}

function slugSort(list){ return [...list].sort((a,b)=>a.isim.localeCompare(b.isim,'tr')); }

// ---------- İl detay sayfaları ----------
function buildIlPage(il) {
  const canonicalPath = `/iller/${il.slug}.html`;
  const sameRegion = iller.filter(x => x.bolge === il.bolge && x.slug !== il.slug);
  const related = slugSort(sameRegion).slice(0, 6);

  const gezilecekHtml = il.gezilecek.map((y,i) => {
    const cumleler = [
      `${y}, ${il.isim}'e gelen ziyaretçilerin listesinin başında yer alır.`,
      `${il.isim} gezinizde zaman ayırmanız gereken noktalardan biri de ${y}'dir.`,
      `Yerel halkın da sıkça önerdiği ${y}, ${il.isim}'in karakterini yansıtan yerlerden biridir.`,
      `Fotoğraf tutkunlarının uğrak noktalarından ${y}, gezi rotanıza mutlaka girmeli.`
    ];
    return `<li><strong>${y}</strong> — ${cumleler[i % cumleler.length]}</li>`;
  }).join('\n');
  const lezzetHtml = il.lezzet.map(y => `<li>${y}</li>`).join('\n');
  const relatedHtml = related.map(r => `<li><a href="./${r.slug}.html">${r.isim}</a></li>`).join('\n');
  const heroSvgMarkup = heroSvg(il);

  const bodyHtml = `
<div class="il-hero">
  <div class="il-hero-media">
    ${heroSvgMarkup}
    <img class="il-photo" src="../assets/img/iller/${il.slug}.jpg" alt="${il.isim} manzarası" loading="lazy" onerror="this.style.display='none'">
    <div class="il-hero-overlay">
      <div class="wrap">
        <p class="breadcrumb" style="color:#c9c2a2;"><a href="../index.html" style="color:#c9c2a2;">Anasayfa</a> / <a href="./index.html" style="color:#c9c2a2;">İller</a> / ${il.isim}</p>
        <div class="badges">
          <span class="badge">Plaka: ${il.plaka}</span>
          <span class="badge">${il.bolge} Bölgesi</span>
        </div>
        <h1>${il.isim} Gezi Rehberi</h1>
        <p class="lede">${il.ozet}</p>
      </div>
    </div>
  </div>
</div>

<div class="wrap section">
  <div class="content-grid">
    <div class="content-main">
      <article>
        <section>
          <h2>${il.isim} Hakkında</h2>
          <p>${il.isim}, ${il.bolge} Bölgesi'nde yer alan ve plaka kodu ${il.plaka} olan bir ilimizdir. ${il.ozet} Şehri ziyaret edecekler için hem tarihi dokusu hem de yöresel mutfağı, gezi planına mutlaka dahil edilmesi gereken bir duraktır.</p>
          <p>${il.isim}'e gitmeyi düşünüyorsanız, bölgenin iklim koşullarına göre en uygun zaman ${il.en_iyi_zaman} olarak öne çıkıyor. Aşağıda şehirde görmeniz gereken yerleri, denemeniz gereken lezzetleri ve pratik bilgileri bulabilirsiniz.</p>
          <div class="tip-box">
            <strong>Gezi İpucu</strong>
            ${il.isim}'de vaktiniz kısıtlıysa önce ${il.gezilecek[0]}'ü, ardından ${il.gezilecek[1] || il.gezilecek[0]}'ü gezip günü ${il.lezzet[0]} tadarak kapatmanızı öneririz.
          </div>
        </section>

        <section>
          <h2>${il.isim}'de Gezilecek Yerler</h2>
          <ul class="info-list">
            ${gezilecekHtml}
          </ul>
        </section>


        <section>
          <h2>${il.isim} Mutfağından Lezzetler</h2>
          <p>${il.isim} mutfağı, bölgenin tarımsal ve kültürel dokusunu yansıtır. Şehre gittiğinizde aşağıdaki lezzetleri mutlaka tatmanızı öneririz:</p>
          <ul class="info-list">
            ${lezzetHtml}
          </ul>
        </section>

        <section>
          <h2>Ne Zaman Gidilmeli?</h2>
          <p>${il.isim} için önerilen ziyaret dönemi <strong>${il.en_iyi_zaman}</strong>. Seyahatinizi planlarken bölgenin iklim özelliklerini göz önünde bulundurmanız, gezinizin konforunu artıracaktır.</p>
        </section>

        <section>
          <h2>${il.isim} Hakkında Sık Sorulan Sorular</h2>
          <h3>${il.isim} hangi bölgede yer alır?</h3>
          <p>${il.isim}, Türkiye'nin ${il.bolge} Bölgesi'nde yer alır ve ${il.plaka} plaka koduyla bilinir.</p>
          <h3>${il.isim}'de mutlaka görülmesi gereken yer neresidir?</h3>
          <p>${il.isim}'e gidenlerin çoğunlukla ilk durağı ${il.gezilecek[0]} olur; zaman kısıtlıysanız bu noktayı listenizin başına koyabilirsiniz.</p>
          <h3>${il.isim}'de ne yenir?</h3>
          <p>${il.isim} mutfağının en tanınmış lezzeti ${il.lezzet[0]}'dir; şehirdeyken denemeden dönmemenizi öneririz.</p>
          <h3>${il.isim}'e gitmek için en uygun ay hangisidir?</h3>
          <p>${il.isim} için genel olarak ${il.en_iyi_zaman} dönemi önerilir; ancak özel bir etkinlik veya festival planlıyorsanız tarihleri önceden kontrol etmenizde fayda var.</p>
        </section>
      </article>
    </div>

    <aside class="sidebar">
      <div class="fact-box">
        <h3>Hızlı Bilgiler</h3>
        <dl>
          <dt>Plaka Kodu</dt><dd>${il.plaka}</dd>
          <dt>Bölge</dt><dd>${il.bolge} Bölgesi</dd>
          <dt>En İyi Ziyaret Zamanı</dt><dd>${il.en_iyi_zaman}</dd>
          <dt>Öne Çıkan Lezzet</dt><dd>${il.lezzet[0]}</dd>
        </dl>
      </div>
      <div class="fact-box" style="margin-top:18px;">
        <h3>${il.bolge} Bölgesi'nden Diğer İller</h3>
        <ul class="related-list">
          ${relatedHtml}
        </ul>
      </div>
    </aside>
  </div>
</div>
`;

  return page({
    title: `${il.isim} Gezi Rehberi — Nereleri Gezmeli, Ne Yenir? | Keşif Atlası`,
    description: `${il.isim}: ${il.ozet} Gezilecek yerler, yöresel lezzetler ve en iyi ziyaret zamanı için ${il.isim} rehberimizi inceleyin.`,
    canonicalPath,
    bodyHtml,
    jsonLd: {
      "@context":"https://schema.org",
      "@type":"TouristDestination",
      "name": il.isim,
      "description": il.ozet,
      "containedInPlace": {"@type":"AdministrativeArea","name":"Türkiye"}
    }
  });
}

// ---------- İller index ----------
function buildIllerIndex() {
  const canonicalPath = '/iller/index.html';
  const byRegion = {};
  iller.forEach(il => { (byRegion[il.bolge] = byRegion[il.bolge] || []).push(il); });

  const sections = bolgeSira.map(bolge => {
    const list = slugSort(byRegion[bolge] || []);
    const cards = list.map(il => `
      <div class="il-card">
        <span class="plaka-badge">${il.plaka}</span>
        <h3>${il.isim}</h3>
        <p>${il.ozet}</p>
        <a class="il-link" href="./${il.slug}.html">Rehberi oku →</a>
      </div>`).join('\n');
    return `<section class="section" style="padding-top:0;">
      <div class="section-head"><h2>${bolge} Bölgesi</h2></div>
      <div class="il-grid">${cards}</div>
    </section>`;
  }).join('\n');

  const bodyHtml = `
<div class="il-hero">
  <div class="wrap">
    <p class="breadcrumb" style="color:#c9c2a2;"><a href="../index.html" style="color:#c9c2a2;">Anasayfa</a> / İller</p>
    <h1>Türkiye'nin 81 İli</h1>
    <p class="lede">Marmara'dan Doğu Anadolu'ya, her ilin gezilecek yerlerini, yöresel lezzetlerini ve en iyi ziyaret zamanını keşfedin.</p>
  </div>
</div>
<div class="wrap">${sections}</div>
`;
  return page({
    title: `Türkiye'nin 81 İli — Gezi Rehberleri | Keşif Atlası`,
    description: `Türkiye'nin 81 iline ait detaylı gezi rehberleri: gezilecek yerler, yöresel lezzetler ve en iyi ziyaret zamanları bölge bölge.`,
    canonicalPath,
    bodyHtml
  });
}

// ---------- Anasayfa ----------
function buildHome() {
  const canonicalPath = '/index.html';
  const byRegion = {};
  iller.forEach(il => { (byRegion[il.bolge] = byRegion[il.bolge] || []).push(il); });

  const regionCards = bolgeSira.map(bolge => {
    const list = slugSort(byRegion[bolge] || []);
    const items = list.slice(0,6).map(il => `<li><a href="iller/${il.slug}.html">${il.isim}</a></li>`).join('');
    return `<div class="region-card">
      <span class="count">${list.length} il</span>
      <h3>${bolge}</h3>
      <ul>${items}</ul>
    </div>`;
  }).join('\n');

  const oneCikanlar = ['istanbul','nevsehir','antalya','izmir','trabzon','sanliurfa'];
  const oneCikanCards = oneCikanlar.map(slug => {
    const il = iller.find(x=>x.slug===slug);
    return `<div class="il-card">
      <span class="plaka-badge">${il.plaka}</span>
      <h3>${il.isim}</h3>
      <p>${il.ozet}</p>
      <a class="il-link" href="iller/${il.slug}.html">Rehberi oku →</a>
    </div>`;
  }).join('\n');

  const bodyHtml = `
<section class="hero">
  <div class="wrap">
    <p class="hero-eyebrow">81 il, tek adres</p>
    <h1>Türkiye'yi baştan sona keşfedin</h1>
    <p class="lede">Kapadokya'nın peribacalarından Karadeniz'in yaylalarına, her ilin tarihini, mutfağını ve gezilecek yerlerini anlatan bağımsız bir gezi atlası.</p>
    <form class="hero-search" action="iller/index.html" method="get">
      <label for="il-ara" style="position:absolute;left:-9999px;">İl ara</label>
      <input id="il-ara" type="text" placeholder="Bir il adı yazın, örn: Kapadokya, Trabzon...">
      <button type="submit">Keşfet</button>
    </form>
  </div>
</section>

<div class="wrap section">
  <div class="section-head">
    <h2>Bölgeler</h2>
    <p>Türkiye'nin 7 coğrafi bölgesindeki tüm illeri inceleyin.</p>
  </div>
  <div class="region-grid">${regionCards}</div>
</div>

<div class="wrap section">
  <div class="section-head">
    <h2>Öne Çıkan Rehberler</h2>
    <p>Gezginlerin en çok merak ettiği illerden seçmeler.</p>
  </div>
  <div class="il-grid">${oneCikanCards}</div>
</div>

<div class="wrap section">
  <div class="section-head">
    <h2>Blog'dan Son Yazılar</h2>
    <p>Rota önerileri, mevsimlik tavsiyeler ve yöresel mutfak yazıları.</p>
  </div>
  <div class="blog-grid" id="home-blog-grid"><!--BLOG_CARDS--></div>
</div>
`;
  return { canonicalPath, bodyHtml };
}

// ---------- Klasörleri hazırla ve yaz ----------
fs.mkdirSync(path.join(root,'iller'), {recursive:true});
iller.forEach(il => {
  fs.writeFileSync(path.join(root,'iller',`${il.slug}.html`), buildIlPage(il));
});
fs.writeFileSync(path.join(root,'iller','index.html'), buildIllerIndex());

// Anasayfa ve diğer statik sayfalar build-pages.js içinde, blog verisiyle birlikte üretilir.

// ---------- sitemap.xml (statik + il sayfaları; blog URL'leri build-pages.js tarafından eklenir) ----------
const staticUrls = ['/', '/iller/index.html', '/blog/index.html', '/hakkimizda.html', '/iletisim.html', '/gizlilik-politikasi.html', '/kullanim-sartlari.html'];
const ilUrls = iller.map(il => `/iller/${il.slug}.html`);
const allUrls = [...staticUrls, ...ilUrls];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(u => `  <url><loc>${SITE_URL}${u}</loc></url>`).join('\n')}
</urlset>`;
fs.writeFileSync(path.join(root,'sitemap.xml'), sitemap);

console.log(`✔ ${iller.length} il sayfası üretildi.`);
console.log('✔ iller/index.html üretildi.');
console.log('✔ sitemap.xml üretildi (blog yazıları build-blog.js sonrası eklenecek).');
console.log('ℹ index.html için node build-blog.js ardından node build-pages.js çalıştırın (bkz. build.sh).');

module.exports = { page, header, footer, head, relPrefix, SITE_URL, bolgeSira, buildHome, iller };
