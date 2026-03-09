const CryptoJs = require("crypto-js");
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;


const encryptId = (id) => {
    try{
    const encrypted = CryptoJs.AES.encrypt(id.toString(), secretKey).toString();
    const urlSafeEncrypted = encrypted.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    return urlSafeEncrypted;
} catch (error) {
    console.error('Encryption Error:', error.message); 
    throw new Error('Invalid encrypted ID');
  }
  };

const decryptId = (id) => {
    try{
    const encrypted = id.replace(/-/g, '+').replace(/_/g, '/');
    const bytes = CryptoJs.AES.decrypt(encrypted, secretKey);
    return bytes.toString(CryptoJs.enc.Utf8);
    } catch (error) {
        console.error('Decryption Error:', error.message); 
        throw new Error('Invalid encrypted ID');
      }
}


module.exports = {encryptId, decryptId};