import { buildClient } from './';
import { HttpGet } from './facades/HttpGet';

describe('getFeedItems', () => {
  it('returns a paginated list of verses', async () => {
    const client = buildClient({
      timeProvider: () => 0,
      httpGet: (() => Promise.resolve({ json: () => Promise.resolve({ Items: [] }) })) as HttpGet,
      log: x => {},
    });
    const actual = await client.getFeedItems({ pageSize: 42 });
    // after the spike is complete maybe we'll want unit tests showing that we
    // make the correct GET request and return the correctly transformed
    // response?
  });
});
