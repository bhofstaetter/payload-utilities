import type {DefaultDocumentIDType, TypeWithID} from 'payload';

export const getDocument = async <T extends TypeWithID>(
    idOrDocument: T | DefaultDocumentIDType,
    getDocumentCallback: (id: DefaultDocumentIDType) => Promise<T>,
): Promise<T> => {
    if (typeof idOrDocument === 'object') {
        return idOrDocument as T;
    }

    return getDocumentCallback(idOrDocument);
};
