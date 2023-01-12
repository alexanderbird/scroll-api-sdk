import { PaginationInput } from './PaginationInput';

export interface GetVersesInput {
  document: 'bible'|'reference';
  language: string;
  translation: string;
  ids: string[];
}
