if(!self.define){let e,s={};const n=(n,a)=>(n=new URL(n+".js",a).href,s[n]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=s,document.head.appendChild(e)}else e=n,importScripts(n),s()})).then((()=>{let e=s[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(a,i)=>{const t=e||("document"in self?document.currentScript.src:"")||location.href;if(s[t])return;let c={};const r=e=>n(e,t),d={module:{uri:t},exports:c,require:r};s[t]=Promise.all(a.map((e=>d[e]||r(e)))).then((e=>(i(...e),c)))}}define(["./workbox-4754cb34"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/app-build-manifest.json",revision:"9ba8c8492a303d05d0cbddcfd6bdd74e"},{url:"/_next/static/chunks/193-956978e3e9e5aaf3.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/23-5db72554fcddfc78.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/231-74f880091d9083cd.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/619edb50-63cdcda701bebd0b.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/654-67b39a7fea1669f4.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/869-93b79726f65e65ef.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/880-ba1d4c0258247f1f.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/8e1d74a4-6359d457bf563204.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/9c4e2130-c90055950fd46d0a.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/app/%5Bblockchain%5D/%5Baddress%5D/page-5b6437b94d588725.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/app/_not-found/page-c4d765188908c0e1.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/app/layout-58e28f36dfacd6c4.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/app/not-found-9db4cb4e2052a7ef.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/app/page-af2258240e391c41.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/b563f954-c5259dc2e2f27223.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/c37d3baf-40c4531cb86d3401.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/ca377847-64faeacc774ee648.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/ee560e2c-53b982bb4ae78c36.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/f25cdb8d-d60634ac62633a23.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/f97e080b-7bba26e29ca34f40.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/fd9d1056-1a8bf09aeb828dfe.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/framework-00a8ba1a63cfdc9e.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/main-ac86d082695dff98.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/main-app-c2e023739597de54.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/pages/_app-037b5d058bd9a820.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/pages/_error-6ae619510b1539d6.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-97a13223a676d3ac.js",revision:"gBJwmOzKTZ7ryPdJ3L3_X"},{url:"/_next/static/css/1c4950cfa02eaff5.css",revision:"1c4950cfa02eaff5"},{url:"/_next/static/css/f59bfee53fbffbfb.css",revision:"f59bfee53fbffbfb"},{url:"/_next/static/gBJwmOzKTZ7ryPdJ3L3_X/_buildManifest.js",revision:"a0ae24e7f29dd3809ab75b5dd91a79dc"},{url:"/_next/static/gBJwmOzKTZ7ryPdJ3L3_X/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/media/0a7d1127b1849c3a-s.p.woff2",revision:"e458e5a534e3493449aee579e1eccca3"},{url:"/_next/static/media/5269767769affeeb-s.woff2",revision:"d4f5b9ab7d0792f01ae46728283c9a13"},{url:"/_next/static/media/77ce01c003603e77-s.woff2",revision:"d6cb15c3dba471d15a1e3b4c181ae22e"},{url:"/_next/static/media/78bcd7d80ba05af5-s.woff2",revision:"636804f2d2df14a251c45d898cec7607"},{url:"/_next/static/media/a9ae0bb0e1e9484e-s.woff2",revision:"469adc7b8701a4d49373f25f32e7eca6"},{url:"/_next/static/media/ccd5f404b5d91fc0-s.woff2",revision:"03d9541a57e04be9e0599bb277ad85b5"},{url:"/_next/static/media/vitalik-buterin.b7529707.png",revision:"3888e0ca124a934dee87798c0e3dd3b3"},{url:"/brain-polygon.json",revision:"bece71149d11c62223ddb4e22aaaa15a"},{url:"/icon512_maskable.png",revision:"8d213d139a6850ec846dc7affcc78129"},{url:"/icon512_rounded.png",revision:"53999c8206c4e9ce8e4f043eb82266e0"},{url:"/manifest.json",revision:"b3b17d44bb02fb0b96dd9c17c1122861"},{url:"/rotating_cat.gif",revision:"9e7384ad5651e4ef391aba47e4ea5fc1"},{url:"/squares-background.svg",revision:"838c90cdf383e2fc5f482e4eabf5eb05"},{url:"/vitalik-buterin.png",revision:"3888e0ca124a934dee87798c0e3dd3b3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:n,state:a})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const s=e.pathname;return!s.startsWith("/api/auth/")&&!!s.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
