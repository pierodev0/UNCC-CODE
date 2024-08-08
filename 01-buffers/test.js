const textRaw = "3231"
const buffer = Buffer.from(textRaw,"hex");

console.log(buffer.toString("utf-8"))