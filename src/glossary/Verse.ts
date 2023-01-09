import { VerseId } from './VerseId';

export interface Verse {
  data: any;
  type: string;
  id: VerseId;
  reference: string;
  related: string[];
}

export interface VerseWithAllIds extends Verse {
  textId: string;
  feedKey: string;
}
