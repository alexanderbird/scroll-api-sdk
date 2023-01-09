import { MD5 } from 'crypto-js';
import { PaginatedVerses } from './glossary/PaginatedVerses';
import { VerseId, PartialVerseId } from './glossary/VerseId';
import { VerseWithAllIds } from './glossary/Verse';
import { GetVersesInCanonicalOrderInput } from './glossary/GetVersesInCanonicalOrderInput';
import { GetFeedItemsInput } from './glossary/GetFeedItemsInput';
import * as environment from './environment';
import { HttpGet } from './facades/HttpGet';
import { Log } from './facades/Log';

export interface ClientConfiguration {
  timeProvider: () => Number;
  httpGet: HttpGet;
  log: Log;
}

export class Client {
  private config: ClientConfiguration;

  constructor(config: ClientConfiguration) {
    const providedConfig = Object.entries(config)
      .map(([key, value]) => ({ key, value }))
      .filter(({ value }) => !!value)
      .map(({ key }) => key);
    const expectedConfig = ['log', 'timeProvider', 'httpGet'];
    const missingConfig = expectedConfig.filter(x => !providedConfig.includes(x));
    if (missingConfig.length) {
      throw new Error('Cannot construct Client because these required parameter(s) are missing: ' + missingConfig.join(', '));
    }
    this.config = config;
  }

  async getVerses(input: { ids: string[] }): Promise<PaginatedVerses> {
    const log: { [key: string]: any } = { sdkAction: 'getVerses', input };
    try {
      const response: any = await this.config.httpGet({
        logSink: (key, value) => { log[key] = value; },
        url: environment.api.endpoint + "/Verses",
        queryParams: {
          translation: 'web-strongs',
          language: 'en',
          ids: input.ids.join(',')
        },
        headers: {
          'x-api-key': environment.api.token
        }
      });
      const output = {
        verses: this.mapItemsToVerses(Object.values(response.Responses)[0] as any)
      };
      log.output = output;
      return output;
    } catch(error) {
      log.error = error;
    } finally {
      this.config.log(log);
    }
  }

  async getFeedItems(input: GetFeedItemsInput): Promise<PaginatedVerses> {
    const log: { [key: string]: any } = { sdkAction: 'getFeedItems', input };
    try {
      const page = input.page || MD5(this.config.timeProvider().toString()).toString();
      const response: any = await this.config.httpGet({
        logSink: (key, value) => { log[key] = value; },
        url: environment.api.endpoint + "/Feed",
        queryParams: {
          translation: 'web-strongs',
          language: 'en',
          feedStart: page
        },
        headers: {
          'x-api-key': environment.api.token
        }
      });
      const allRemainingVerses = this.mapItemsToVerses(response.Items);
      const verses = allRemainingVerses.slice(0, input.pageSize);
      const nextPage = allRemainingVerses[input.pageSize - 1]?.feedKey || "0";
      const output = { verses, nextPage };
      log.output = output;
      return output;
    } catch(error) {
      log.error = error;
    } finally {
      this.config.log(log);
    }
  }

  async getVersesInCanonicalOrder(input: GetVersesInCanonicalOrderInput): Promise<PaginatedVerses> {
    const log: { [key: string]: any } = { sdkAction: 'getVersesInCanonicalOrder', input };
    try {
      const path = input.direction === 'REVERSE' ? '/ReverseCanonical' : '/Canonical';
      const response: any = await this.config.httpGet({
        url: environment.api.endpoint + path,
        queryParams: {
          translation: 'web-strongs',
          language: 'en',
          startingId: input.page || input.startingId,
          idPrefix: input.idPrefix
        },
        headers: {
          'x-api-key': environment.api.token
        },
        logSink: (key, value) => { log[key] = value; }
      });
      const allRemainingVerses = this.mapItemsToVerses(response.Items);
      const verses = allRemainingVerses.slice(0, input.pageSize);
      const nextPage = response.ScannedCount <= input.pageSize ? undefined : allRemainingVerses[input.pageSize - 1]?.id;
      const output = { verses, nextPage };
      log.output = output;
      return output;
    } catch(error) {
      log.error = error;
    } finally {
      this.config.log(log);
    }
  }

  private mapItemsToVerses(items: Array<DynamoDbStringObject<VerseWithAllIds>>): Array<VerseWithAllIds> {
    return items.map(x => ({
      feedKey: x.feedKey.S,
      textId: x.textId.S,
      data: JSON.parse(x.data.S),
      type: x.type.S,
      related: x.related.S,
      id: x.id.S,
      reference: x.reference.S
    }));
  }
}

type DynamoDbStringObject<Type> = {
  [Property in keyof Type]: { S: Type[Property] };
};

export function buildClient(config: ClientConfiguration) {
  return new Client(config);
}

