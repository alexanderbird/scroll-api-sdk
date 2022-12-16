import { PaginatedVerses } from './glossary/PaginatedVerses';
import { VerseId } from './glossary/VerseId';
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

  getVersesInNaturalOrder(input: { startAt: VerseId }): PaginatedVerses {
    return FAKE_RESPONSE;
  }
}

export function buildClient(config: ClientConfiguration) {
  return new Client(config);
}

