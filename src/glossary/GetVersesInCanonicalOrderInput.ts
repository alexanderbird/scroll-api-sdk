import { PaginationInput } from './PaginationInput';
import { VerseId, PartialVerseId } from './VerseId';

export interface GetVersesInCanonicalOrderInput extends PaginationInput {
  startingId: VerseId;
  idPrefix: PartialVerseId;
  direction: 'FORWARD'|'REVERSE';
}
