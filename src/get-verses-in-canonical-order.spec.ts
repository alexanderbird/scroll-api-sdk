import { buildClient } from './';
import { HttpGet } from './facades/HttpGet';

describe('getVersesInCanonicalOrder', () => {
  it('returns a paginated list of verses', () => {
    const client = buildClient({
      timeProvider: () => 0,
      httpGet: (() => Promise.resolve({ json: () => Promise.resolve({ Items: [] }) })) as HttpGet,
      log: x => {},
    });
    const actual = client.getVersesInCanonicalOrder({ idPrefix: '65-001', startingId: '65-001-002', direction: 'FORWARD', pageSize: 42 });
    // after the spike is complete maybe we'll want unit tests showing that we
    // make the correct GET request and return the correctly transformed
    // response?
  });

  test.todo('does not permit a startingId which does not start with the idPrefix');
});
