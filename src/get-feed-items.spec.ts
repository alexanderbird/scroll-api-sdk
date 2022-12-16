import { buildClient } from './';

describe('getFeedItems', () => {
  it('returns a paginated list of verses', async () => {
    const client = buildClient({ timeProvider: () => 0 });
    const actual = await client.getFeedItems({ pageSize: 42 });
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
