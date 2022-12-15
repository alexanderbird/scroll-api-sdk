import { VerseId } from './VerseId';

export interface Verse {
  text: string;
  id: VerseId;
  reference: string;
  related: string[];
}
