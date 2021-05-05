import bcrypt from 'bcrypt';

const hashString: (word: string) => Promise<string> = (word) => {
  return bcrypt.hash(word, 10);
};

const comparePasswords: (plainText: string, hash: string) => Promise<boolean> = (plainText, hash) => {
  return bcrypt.compare(plainText, hash);
};

export default {
  hashString,
  comparePasswords
};
  