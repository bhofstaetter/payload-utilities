import type {DefaultDocumentIDType, TypeWithID} from 'payload';
import {extractIds} from '@/extractId.js';

export const getDocuments = async <T extends TypeWithID>(
    idsOrDocuments: (T | DefaultDocumentIDType)[],
    getDocumentsCallback: (ids: DefaultDocumentIDType[]) => Promise<T[]>,
): Promise<T[]> => {
    if (!idsOrDocuments.length) {
        return [];
    }

    if (typeof idsOrDocuments[0] === 'object') {
        return idsOrDocuments as T[];
    }

    return getDocumentsCallback(extractIds(idsOrDocuments));
};
