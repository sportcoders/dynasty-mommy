import * as crypto from "crypto";
import config from "../../config/config";

const KEY = Buffer.from(config.ESPN_SECRET_KEY, "base64");

if (KEY.length !== 32) {
    throw new Error(
        `Invalid AES-256 key length: expected 32 bytes, got ${KEY.length}`
    );
}

const IV_LENGTH = 16; // AES block size for CBC

export function encrypt(text: string): string {
    if (!text) return text;

    const iv = crypto.randomBytes(IV_LENGTH); // random 16-byte IV
    const cipher = crypto.createCipheriv("aes-256-cbc", KEY, iv);

    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

    // Store IV + ciphertext together as hex, separated by colon
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(text: string): string {
    if (!text) return text;

    const [ivHex, encryptedHex] = text.split(":");
    if (!ivHex || !encryptedHex) {
        throw new Error("Invalid encrypted data format");
    }

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY, iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

    return decrypted.toString("utf8");
}
