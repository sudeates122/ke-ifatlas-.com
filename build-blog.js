const fs = require('fs');
const path = require('path');
const { page } = require('./generate.js');
const posts = require('./data/blog.json');
const iller = require('./data/iller.json');
const root = __dirname;

function renderBlock(b) {
  if (b.tip === 'h2') return `<h2>${b.icerik}</h2>`;
  return `<p>${b.icerik}</p>`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('tr-TR', { day:'numeric', month:'long', year:'numeric' });
}

function buildPost(p) {
  const canonicalPath = `/blog/${p.slug}.html`;
  const gezilenHtml = (p.gezilen_iller||[]).map(slug=>{
    const il = iller.find(x=>x.slug===slug);
    return il ? `<li><a href="../iller/${il.slug}.html">${il.isim}</a></li>` : '';
  }).join('');

  const bodyHtml = `
<div class="wrap section">
  <p class="breadcrumb"><a href="../index.html">Anasayfa</a> / <a href="./index.html">Blog</a> / ${p.baslik}</p>
  <article class="post-body">
    <span class="tag">${p.etiket}</span>
    <h1>${p.baslik}</h1>
    <p class="post-meta">Yayın tarihi: ${formatDate(p.tarih)}</p>
    ${p.govde.map(renderBlock).join('\n')}
  </article>
  ${gezilenHtml ? `<aside class="fact-box" style="max-width:70ch;margin-top:32px;">
    <h3>Bu Yazıda Geçen İller</h3>
    <ul class="related-list">${gezilenHtml}</ul>
  </aside>` : ''}
</div>`;

  return page({
    title: `${p.baslik} | Keşif Atlası Blog`,
    description: p.ozet,
    canonicalPath,
    bodyHtml,
    jsonLd: {
      "@context":"https://schema.org",
      "@type":"BlogPosting",
      "headline": p.baslik,
      "description": p.ozet,
      "datePublished": p.tarih
    }
  });
}

function buildBlogIndex() {
  const canonicalPath = '/blog/index.html';
  const cards = posts.slice().sort((a,b)=> new Date(b.tarih)-new Date(a.tarih)).map(p => `
    <div class="blog-card">
      <span class="tag">${p.etiket}</span>
      <h3><a href="./${p.slug}.html">${p.baslik}</a></h3>
      <p>${p.ozet}</p>
      <a href="./${p.slug}.html" class="il-link">Yazıyı oku →</a>
    </div>`).join('\n');

  const bodyHtml = `
<div class="il-hero">
  <div class="wrap">
    <p class="breadcrumb" style="color:#c9c2a2;"><a href="../index.html" style="color:#c9c2a2;">Anasayfa</a> / Blog</p>
    <h1>Keşif Atlası Blog</h1>
    <p class="lede">Rota önerileri, mevsimlik gezi tavsiyeleri ve Anadolu mutfağı üzerine yazılar.</p>
  </div>
</div>
<div class="wrap section">
  <div class="blog-grid">${cards}</div>
</div>`;

  return page({
    title: `Blog — Gezi Rotaları ve Tavsiyeler | Keşif Atlası`,
    description: `Türkiye gezi rotaları, mevsimlik tavsiyeler ve yöresel mutfak üzerine blog yazıları.`,
    canonicalPath,
    bodyHtml
  });
}

fs.mkdirSync(path.join(root,'blog'), {recursive:true});
posts.forEach(p => fs.writeFileSync(path.join(root,'blog',`${p.slug}.html`), buildPost(p)));
fs.writeFileSync(path.join(root,'blog','index.html'), buildBlogIndex());
console.log(`✔ ${posts.length} blog yazısı üretildi.`);
console.log('✔ blog/index.html üretildi.');

module.exports = { posts, formatDate };
