const fs = require('fs');
const p = 'src/app/module/gmi/1/page.js';
let c = fs.readFileSync(p, 'utf8');

// These two had & (not &amp;) in the actual file
c = c.split('\u573a\u666f\u4e8c\uff1a\u8001\u5e08\u7684\u76ee\u5149\u4e0e\u65e0\u58f0\u538b\u529b (Preceptor&apos;s Gaze & Pressure)')
     .join("Preceptor&apos;s Gaze &amp; Pressure");
c = c.split('\u62ac\u5934\u770b\u5411\u8001\u5e08 (Look Up & Continue) \u2192')
     .join('Look Up &amp; Continue \u2192');

fs.writeFileSync(p, c, 'utf8');
console.log('Fixed remaining 2 strings.');
