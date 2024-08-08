// 0100 1000 0110 1001 0010 0001

const { Buffer } = require("buffer");

const buf = Buffer.alloc(3); // 24 bits / 8 = 3 bytes
buf[0] = 0x48
buf[1] = 0x69
buf[2] = 0x21
console.log(buf.toString("utf-8"))