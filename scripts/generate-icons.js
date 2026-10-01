import fs from 'fs';
import zlib from 'zlib';

function createPNG(width, height, isMaskable = false) {
  // RGBA buffer: (width * 4 + 1) * height bytes (1 filter byte 0x00 per row)
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const rShield = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep slate / navy background #1E3A8A -> [30, 58, 138]
      let r = 30;
      let g = 58;
      let b = 138;
      let a = 255;

      // Darker edges
      const edgeFactor = Math.min(1, Math.max(0, dist / (width * 0.6)));
      r = Math.floor(r * (1 - 0.4 * edgeFactor) + 15 * 0.4 * edgeFactor);
      g = Math.floor(g * (1 - 0.4 * edgeFactor) + 23 * 0.4 * edgeFactor);
      b = Math.floor(b * (1 - 0.4 * edgeFactor) + 42 * 0.4 * edgeFactor);

      // Inner emblem: Golden scale & rupee circle
      if (dist < width * 0.15) {
        // Gold emblem center
        r = 234; g = 179; b = 8;
      } else if (dist < width * 0.18 && dist >= width * 0.15) {
        // Gold ring border
        r = 253; g = 224; b = 71;
      } else if (Math.abs(dx) < width * 0.025 && y > cy - width * 0.28 && y < cy + width * 0.28) {
        // Vertical balance beam
        r = 253; g = 224; b = 71;
      } else if (Math.abs(dy + width * 0.18) < width * 0.02 && Math.abs(dx) < width * 0.25) {
        // Horizontal scale beam
        r = 253; g = 224; b = 71;
      } else if (Math.abs(dx - width * 0.22) < width * 0.06 && Math.abs(dy + width * 0.08) < width * 0.03) {
        // Right scale pan
        r = 250; g = 204; b = 21;
      } else if (Math.abs(dx + width * 0.22) < width * 0.06 && Math.abs(dy + width * 0.08) < width * 0.03) {
        // Left scale pan
        r = 250; g = 204; b = 21;
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  // Deflate IDAT
  const compressed = zlib.deflateSync(rawData);

  // Helper for CRC32
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (-(c & 1) & 0xedb88320);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function makeChunk(type, data) {
    const len = data.length;
    const typeBuf = Buffer.from(type, 'ascii');
    const buf = Buffer.alloc(4 + 4 + len + 4);
    buf.writeUInt32BE(len, 0);
    typeBuf.copy(buf, 4);
    data.copy(buf, 8);
    const crc = crc32(Buffer.concat([typeBuf, data]));
    buf.writeUInt32BE(crc, 8 + len);
    return buf;
  }

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type: RGBA
  ihdrData[10] = 0; // compression method
  ihdrData[11] = 0; // filter method
  ihdrData[12] = 0; // interlace method
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', compressed);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

if (!fs.existsSync('./public')) {
  fs.mkdirSync('./public', { recursive: true });
}

fs.writeFileSync('./public/pwa-192x192.png', createPNG(192, 192));
fs.writeFileSync('./public/pwa-512x512.png', createPNG(512, 512));
fs.writeFileSync('./public/pwa-maskable-512x512.png', createPNG(512, 512, true));
fs.writeFileSync('./public/apple-touch-icon.png', createPNG(180, 180));
fs.writeFileSync('./public/favicon.ico', createPNG(64, 64));

console.log('Icons generated successfully in /public');
