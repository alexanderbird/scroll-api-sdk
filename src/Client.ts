import { PaginatedVerses } from './glossary/PaginatedVerses';
import { VerseId } from './glossary/VerseId';

const FAKE_RESPONSE = {
  nextPage: 'todo',
  verses: [{
    reference: "Genesis 1:1",
    id: '1-1-1',
    text: "In the beginning God created the heavens and the earth",
    related: []
  }]
};

export class Client {
  getBatchOfVerses(input: { verses: string[], nextPage?: string }): PaginatedVerses {
    return FAKE_RESPONSE;
  }

  getFeedItems(input: { seed: string }): PaginatedVerses {
    return FAKE_RESPONSE;
  }

  getVersesInNaturalOrder(input: { startAt: VerseId }): PaginatedVerses {
    return FAKE_RESPONSE;
  }
}

export function buildClient() {
  return new Client();
}

