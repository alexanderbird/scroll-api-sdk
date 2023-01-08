import { Verse } from './Verse';

export interface PaginatedVerses {
  nextPage?: string;
  verses: Verse[];
}
