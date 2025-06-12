import { avatarGet } from "./apiClient";

export async function getAvatarThumbnail(avatar_id: string): Promise<Blob> {
    return await avatarGet(`/thumbs/${avatar_id}`)
}

function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result === 'string') {
                resolve(result);
            } else {
                reject(new Error("Failed to convert blob to base64 string."));
            }
        };

        reader.onerror = () => {
            reject(new Error("FileReader error occurred."));
        };

        reader.readAsDataURL(blob);
    });
}
function base64ToBlob(base64: string): Blob {
    // Split the base64 string into metadata and data
    const [metadata, data] = base64.split(',');

    if (!metadata || !data) {
        throw new Error('Invalid base64 string format.');
    }

    // Extract the MIME type using a regular expression
    const match = metadata.match(/data:(.*?);base64/);
    if (!match || match.length < 2) {
        throw new Error('Invalid MIME type in base64 string.');
    }

    const mime = match[1];

    const binaryString = atob(data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
}
