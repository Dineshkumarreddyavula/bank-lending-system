function caesarEncrypt(message, shift) {
  return message.replace(/[a-z]/gi, c => {
    const base = c <= 'Z' ? 65 : 97;
    return String.fromCharCode((c.charCodeAt(0) - base + shift + 26) % 26 + base);
  });
}

function caesarDecrypt(message, shift) {
  return caesarEncrypt(message, -shift);
}

module.exports = { caesarEncrypt, caesarDecrypt };
