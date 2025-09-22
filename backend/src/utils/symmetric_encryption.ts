import crypto from 'crypto';
const algorithm = 'aes-256-gcm';
const secretKey = crypto.createHash('sha256').update('SECRETKEY').digest();
const ivLength = 16;

export function encrypt(text: string) {
    const iv = crypto.randomBytes(ivLength);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

    const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return JSON.stringify({
        encrypted_data: encrypted.toString('base64'),
        iv: iv.toString('base64'),
        tag: tag.toString('base64')
    });
}

export function decrypt(ciphertext: string) {
    const obj = JSON.parse(ciphertext);

    const encryptedData = Buffer.from(obj.encrypted_data, 'base64');
    const iv = Buffer.from(obj.iv, 'base64');
    const tag = Buffer.from(obj.tag, 'base64');

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);


    return decrypted.toString('utf-8');
}