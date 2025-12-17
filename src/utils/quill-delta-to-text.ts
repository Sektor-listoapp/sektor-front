export const quillDeltaToText = (delta: string | object | null | undefined): string => {
    if (!delta) return '';

    // If it's already plain text (not JSON), return it directly
    if (typeof delta === 'string' && !delta.trim().startsWith('[') && !delta.trim().startsWith('{')) {
        return delta;
    }

    // Only use Quill on the client side
    if (typeof window === 'undefined') {
        // Server-side: extract text from Delta format manually
        try {
            let deltaObj: unknown;
            if (typeof delta === 'string') {
                try {
                    deltaObj = JSON.parse(delta);
                } catch {
                    return delta;
                }
            } else {
                deltaObj = delta;
            }

            if (Array.isArray(deltaObj)) {
                return deltaObj
                    .map((item: { insert?: string }) => item.insert || '')
                    .join('');
            }

            return typeof delta === 'string' ? delta : String(delta);
        } catch {
            return typeof delta === 'string' ? delta : String(delta);
        }
    }

    try {
        let deltaObj: unknown;

        if (typeof delta === 'string') {
            try {
                deltaObj = JSON.parse(delta);
            } catch {
                return delta;
            }
        } else {
            deltaObj = delta;
        }

        if (Array.isArray(deltaObj) && deltaObj.length > 0) {
            const isDeltaFormat = deltaObj.every((item) =>
                typeof item === 'object' && item !== null && 'insert' in item
            );

            if (isDeltaFormat) {
                try {
                    // Dynamic import only on client side
                    const Quill = require('quill');
                    const tempDiv = document.createElement('div');
                    const quill = new Quill(tempDiv);
                    quill.setContents(deltaObj as never);
                    return quill.getText();
                } catch (quillError) {
                    console.error('Error converting Delta with Quill:', quillError);
                    // Fallback: extract text manually
                    return deltaObj
                        .map((item: { insert?: string }) => item.insert || '')
                        .join('');
                }
            }
        }

        return typeof delta === 'string' ? delta : String(delta);
    } catch (error) {
        console.error('Error converting Quill Delta to text:', error);
        return typeof delta === 'string' ? delta : JSON.stringify(delta);
    }
};

