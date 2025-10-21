import bcrypt from "bcryptjs";

class HashProcess {
  async hash(plain: string) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt)
  }

  async compare(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed)
  }
}

export default new HashProcess();
