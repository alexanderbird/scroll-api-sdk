import { PaginatedVerses } from './glossary/PaginatedVerses';
import { VerseId, PartialVerseId } from './glossary/VerseId';
import { GetVersesInCanonicalOrderInput } from './glossary/GetVersesInCanonicalOrderInput';
import * as cannedData from './canned-data.json';
import { MD5 } from 'crypto-js';

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

  getFeedItems(input: { } & PaginationInputs): PaginatedVerses {
    const page = input.page || MD5(this.config.timeProvider().toString()).toString();
    const allRemainingVerses = cannedData.sort((lhs, rhs) => lhs.feedKey < rhs.feedKey ? -1 : 1)
      .filter(x => x.feedKey >= page);
    const verses = allRemainingVerses.slice(0, input.pageSize);
    const nextPage = allRemainingVerses[input.pageSize]?.feedKey || "0";
    return { verses, nextPage };
  }

  getVersesInCanonicalOrder(input: GetVersesInCanonicalOrderInput): PaginatedVerses {
    const firstKey = input.page ? input.page : input.startingId;
    const allVerses = input.direction === 'FORWARD'
      ? cannedData.filter(x => x.id.startsWith(input.idPrefix) && x.id > firstKey)
      : cannedData.slice().reverse().filter(x => x.id.startsWith(input.idPrefix) && x.id < firstKey)
    const verses = allVerses.slice(0, input.pageSize);
    const limitVerse = verses[verses.length - 1];
    const hasAnotherPage = allVerses.length > verses.length;
    const nextPage = hasAnotherPage ? limitVerse.id : "";
    return { verses, nextPage };
  }
}

export function buildClient(config: ClientConfiguration) {
  return new Client(config);
}

