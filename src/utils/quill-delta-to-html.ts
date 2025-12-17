export const quillDeltaToHtml = (delta: string | object | null | undefined): string => {
    if (!delta) return '';

    // Only use Quill on the client side
    if (typeof window === 'undefined') {
        // Server-side: return plain text or string representation
        if (typeof delta === 'string') {
            try {
                const parsed = JSON.parse(delta);
                if (Array.isArray(parsed)) {
                    // Extract text from Delta format manually
                    return parsed
                        .map((item: { insert?: string }) => item.insert || '')
                        .join('');
                }
                return delta;
            } catch {
                return delta;
            }
        }
        return String(delta);
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

        if (Array.isArray(deltaObj)) {
          
            const QuillModule = require('quill');
            const Quill = QuillModule.default || QuillModule;
            const tempDiv = document.createElement('div');
            const quill = new Quill(tempDiv);
            quill.setContents(deltaObj);
            return quill.root.innerHTML;
        }

        return typeof delta === 'string' ? delta : String(delta);
    } catch (error) {
        console.error('Error converting Quill Delta to HTML:', error);
        return typeof delta === 'string' ? delta : JSON.stringify(delta);
    }
};

