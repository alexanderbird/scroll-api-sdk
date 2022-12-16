import { buildClient } from './';

describe('getBatchOfVerses', () => {
  it('returns a paginated list of verses', () => {
    const client = buildClient({ timeProvider: () => 0 });
    const actual = client.getBatchOfVerses({ verses: [] });
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
