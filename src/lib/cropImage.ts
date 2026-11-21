export interface CropArea {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface CropResult {
    url: string;
    blob?: Blob;
}


export interface CropImageOptions {
    /** Rounded corners on the output (used by profile/logo photos). Default true. */
    rounded?: boolean;
    /** Max output width in px, to keep uploads light. Default 1600. */
    maxWidth?: number;
}

export const cropImage = async (
    imageSrc: string,
    crop: CropArea,
    quality: number = 0.8,
    options: CropImageOptions = {}
): Promise<CropResult> => {
    const { rounded = true, maxWidth = 1600 } = options;

    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                reject(new Error('No se pudo obtener el contexto del canvas'));
                return;
            }

            const scale = crop.width > maxWidth ? maxWidth / crop.width : 1;
            const width = Math.round(crop.width * scale);
            const height = Math.round(crop.height * scale);

            canvas.width = width;
            canvas.height = height;

            ctx.save();

            if (rounded) {
                const radius = Math.min(24, Math.min(width, height) * 0.15);
                ctx.beginPath();
                ctx.moveTo(radius, 0);
                ctx.lineTo(width - radius, 0);
                ctx.quadraticCurveTo(width, 0, width, radius);
                ctx.lineTo(width, height - radius);
                ctx.quadraticCurveTo(width, height, width - radius, height);
                ctx.lineTo(radius, height);
                ctx.quadraticCurveTo(0, height, 0, height - radius);
                ctx.lineTo(0, radius);
                ctx.quadraticCurveTo(0, 0, radius, 0);
                ctx.closePath();
                ctx.clip();
            }

            ctx.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width,
                crop.height,
                0,
                0,
                width,
                height
            );

            ctx.restore();

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const url = URL.createObjectURL(blob);
                        resolve({ url, blob });
                    } else {
                        reject(new Error('No se pudo generar la imagen recortada'));
                    }
                },
                'image/webp',
                quality
            );
        };

        image.onerror = () => {
            reject(new Error('No se pudo cargar la imagen'));
        };
    });
};


export const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


export const validateImageFile = (
    file: File,
    maxSize: number = 5 * 1024 * 1024
): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const isValidType = allowedTypes.includes(file.type);
    const isValidSize = file.size <= maxSize;

    return isValidType && isValidSize;
};


export const getImageValidationError = (
    file: File,
    maxSize: number = 5 * 1024 * 1024
): string | null => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
        return 'Solo se permiten archivos JPG, PNG o WebP';
    }

    if (file.size > maxSize) {
        const maxSizeMB = Math.round(maxSize / (1024 * 1024));
        return `El archivo no puede superar ${maxSizeMB}MB`;
    }

    return null;
}; 