import { buildClient } from './';

describe('getFeedItems', () => {
  it('returns a paginated list of verses', () => {
    const client = buildClient();
    const actual = client.getFeedItems({ seed: 'whatever' });
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
