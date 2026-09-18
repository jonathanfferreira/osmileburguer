import { writeFileSync } from 'node:fs';
import { renderSite } from '../src/render.mjs';
import { SITE_URL } from '../src/content.mjs';
writeFileSync(new URL('../dist/index.html',import.meta.url),renderSite());
writeFileSync(new URL('../dist/robots.txt',import.meta.url),`User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
writeFileSync(new URL('../dist/sitemap.xml',import.meta.url),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${SITE_URL}</loc></url></urlset>\n`);
console.log('Static HTML, SEO metadata, robots and sitemap generated.');
