import { buildClient } from './Client';

describe('Client constructor', () => {
  const validConfig = {
    log: () => {},
    timeProvider: () => 0,
    httpGet: (() => {}) as any
  };

  it('requires a log', () => {
    expect(() => buildClient({ ...validConfig, log: null }))
      .toThrow('Cannot construct Client because these required parameter(s) are missing: log');
  });

  it('requires a time provider', () => {
    expect(() => buildClient({ ...validConfig, timeProvider: null }))
      .toThrow('Cannot construct Client because these required parameter(s) are missing: timeProvider');
  });

  it('requires an http GET implementation', () => {
    expect(() => buildClient({ ...validConfig, httpGet: null }))
      .toThrow('Cannot construct Client because these required parameter(s) are missing: httpGet');
  });

  it('provides detailed error messages for multiple missing parameters', () => {
    expect(() => buildClient({ ...validConfig, log: null, timeProvider: null }))
      .toThrow('Cannot construct Client because these required parameter(s) are missing: log, timeProvider');
  });
});
