import {expect, it, vi} from 'vitest';
import {getDocuments} from '@/getDocuments';

const mockDocs = [
    {id: 'abc', title: 'Test 1'},
    {id: 'def', title: 'Test 2'},
];

const batchCallback = vi.fn<(ids: (string | number)[]) => Promise<typeof mockDocs>>();

it('returns documents directly when objects are passed', async () => {
    // test
    const result = await getDocuments(mockDocs, batchCallback);

    // verify
    expect(result).toBe(mockDocs);
    expect(batchCallback).not.toHaveBeenCalled();
});

it('calls the callback with string ids', async () => {
    // prepare
    batchCallback.mockResolvedValue(mockDocs);

    // test
    const result = await getDocuments(['abc', 'def'], batchCallback);

    // verify
    expect(batchCallback).toHaveBeenCalledWith(['abc', 'def']);
    expect(result).toBe(mockDocs);
});

it('calls the callback with number ids', async () => {
    // prepare
    batchCallback.mockResolvedValue(mockDocs);

    // test
    const result = await getDocuments([1, 2], batchCallback);

    // verify
    expect(batchCallback).toHaveBeenCalledWith([1, 2]);
    expect(result).toBe(mockDocs);
});

it('returns an empty array when given an empty array', async () => {
    // test
    const result = await getDocuments([], batchCallback);

    // verify
    expect(result).toEqual([]);
    expect(batchCallback).not.toHaveBeenCalled();
});
