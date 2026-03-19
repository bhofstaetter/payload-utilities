import type {DefaultDocumentIDType} from 'payload';

export const getDocuments = async <T extends object>(
    idsOrDocuments: T[] | DefaultDocumentIDType[],
    getDocumentsCallback: (ids: DefaultDocumentIDType[]) => Promise<T[]>,
): Promise<T[]> => {
    if (!idsOrDocuments.length) {
        return [];
    }

    if (typeof idsOrDocuments[0] === 'object') {
        return idsOrDocuments as T[];
    }

    return getDocumentsCallback(idsOrDocuments as DefaultDocumentIDType[]);
};
