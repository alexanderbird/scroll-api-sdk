import { buildClient } from './';

describe('getVersesInCanonicalOrder', () => {
  it('returns a paginated list of verses', () => {
    const client = buildClient({ timeProvider: () => 0 });
    const actual = client.getVersesInCanonicalOrder({ idPrefix: '65-001', startingId: '65-001-002', direction: 'FORWARD', pageSize: 42 });
    expect(actual).toMatchObject({
      verses: expect.arrayContaining([expect.objectContaining({
        text: expect.any(String),
        id: expect.any(String),
        reference: expect.any(String),
        related: []
      })]),
      nextPage: expect.any(String)
    });
  });
});
