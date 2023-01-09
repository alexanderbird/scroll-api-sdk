import { VerseId } from './VerseId';

export interface Verse {
  text: string;
  id: VerseId;
  reference: string;
  related: string[];
}

export interface VerseWithAllIds extends Verse {
  textId: string;
  feedKey: string;
  text: undefined;
  data: string;
  type: string;
}
