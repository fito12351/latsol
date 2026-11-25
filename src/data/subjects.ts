import type { SubjectData } from '../types/cbt';
import matematika from './subjects/matematika.json';
import fisika from './subjects/fisika.json';
import kimia from './subjects/kimia.json';
import biologi from './subjects/biologi.json';
import bindo from './subjects/bahasa-indonesia.json';
import bing from './subjects/bahasa-inggris.json';
import bjawa from './subjects/bahasa-jawa.json';
import sejarah from './subjects/sejarah.json';
import pkn from './subjects/pkn.json';
import pkwu from './subjects/pkwu.json';
import pjok from './subjects/pjok.json';
import senirupa from './subjects/seni-rupa.json';

export const SUBJECTS: SubjectData[] = [
  matematika as SubjectData,
  fisika as SubjectData,
  kimia as SubjectData,
  biologi as SubjectData,
  bindo as SubjectData,
  bing as SubjectData,
  bjawa as SubjectData,
  sejarah as SubjectData,
  pkn as SubjectData,
  pkwu as SubjectData,
  pjok as SubjectData,
  senirupa as SubjectData,
];
