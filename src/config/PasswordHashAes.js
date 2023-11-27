import CryptoJS from 'crypto-js';
import bcrypt from 'bcryptjs';

const saltRounds = 12;

const secretKey = 'GRITFRAMEWORK';

const encryptPassword = (password) => {
  const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString();
  return encrypted;
};

const decryptPassword = (encryptedPassword) => {
  const decrypted = CryptoJS.AES.decrypt(encryptedPassword, secretKey).toString(CryptoJS.enc.Utf8);
  return decrypted;
};

const hashPassword = async (password) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw error;
    }
  };
  
  const comparePasswords = async (password, hashedPassword) => {
    try {
      const isMatch = await bcrypt.compare(password, hashedPassword);
      return isMatch;
    } catch (error) {
      throw error;
    }
  };
export { encryptPassword, decryptPassword,hashPassword, comparePasswords };
