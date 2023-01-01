import { MD5 } from 'crypto-js';
import axios from 'axios';
import { PaginatedVerses } from './glossary/PaginatedVerses';
import { VerseId, PartialVerseId } from './glossary/VerseId';
import { GetVersesInCanonicalOrderInput } from './glossary/GetVersesInCanonicalOrderInput';
import * as cannedData from './canned-data.json';
import * as environment from './environment';

const getCannedData = () => cannedData.slice();

const FAKE_RESPONSE = {
  nextPage: 'todo',
  verses: [{
    reference: "Genesis 1:1",
    id: '1-1-1',
    text: "In the beginning God created the heavens and the earth",
    related: []
  }]
};

export interface PaginationInputs {
  pageSize: number;
  page?: string;
}

export interface ClientConfiguration {
  timeProvider: () => Number;
}

export class Client {
  private config: ClientConfiguration;

  constructor(config: ClientConfiguration) {
    this.config = config;
  }

  getBatchOfVerses(input: { verses: string[], nextPage?: string }): PaginatedVerses {
    return FAKE_RESPONSE;
  }

  async getFeedItems(input: { } & PaginationInputs): Promise<PaginatedVerses> {
    const log: { [key: string]: any } = { sdkAction: 'getFeedItems', input };
    try {
      const page = input.page || MD5(this.config.timeProvider().toString()).toString();
      const response = await axios.get(environment.api.endpoint + "/Feed", {
        params: {
          translation: 'web-mini',
          language: 'en',
          feedStart: page
        },
        headers: {
          'x-api-key': environment.api.token
        }
      });
      const allRemainingVerses = response.data.Items.map(x => ({
        feedKey: x.feedKey.S,
        textId: x.textId.S,
        text: x.text.S,
        related: x.related.S,
        id: x.id.S,
        reference: x.reference.S
      }));
      const verses = allRemainingVerses.slice(0, input.pageSize);
      const nextPage = allRemainingVerses[input.pageSize - 1]?.feedKey || "0";
      const output = { verses, nextPage };
      log.output = output;
      return output;
    } catch(error) {
      log.error = error;
    } finally {
      console.info(log);
    }
  }

  getVersesInCanonicalOrder(input: GetVersesInCanonicalOrderInput): PaginatedVerses {
    const firstKey = input.page ? input.page : input.startingId;
    const allVerses = input.direction === 'FORWARD'
      ? getCannedData().filter(x => x.id.startsWith(input.idPrefix) && x.id > firstKey)
      : getCannedData().reverse().filter(x => x.id.startsWith(input.idPrefix) && x.id < firstKey)
    const verses = allVerses.slice(0, input.pageSize);
    const limitVerse = verses[verses.length - 1];
    const hasAnotherPage = allVerses.length > verses.length;
    const nextPage = hasAnotherPage ? limitVerse.id : "";
    const output = { verses, nextPage };
    console.info({ sdkAction: 'getVersesInCanonicalOrder', input, output });
    return output;
  }
}

export function buildClient(config: ClientConfiguration) {
  return new Client(config);
}

