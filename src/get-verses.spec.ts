import { buildClient } from './';
import { HttpGet } from './facades/HttpGet';

describe('getBatchOfVerses', () => {
  it('returns a paginated list of verses', () => {
    const client = buildClient({
      timeProvider: () => 0,
      httpGet: (() => Promise.resolve({ json: () => Promise.resolve({ Items: [] }) })) as HttpGet,
      log: x => {},
    });
    const actual = client.getVerses({ ids: [], language: '', document: 'bible', translation: '' });
    // after the spike is complete maybe we'll want unit tests showing that we
    // make the correct GET request and return the correctly transformed
    // response?
  });
});
