import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseRoster,duplicateNames} from '../src/roster';
test('pasted names preserve multi-part surnames and accept single names',()=>assert.deepEqual(parseRoster('  Alex van Buren\r\n\n Jordan \n'),[{firstName:'Alex',lastName:'van Buren'},{firstName:'Jordan',lastName:''}]));
test('spreadsheet tabs preserve multi-word first names',()=>assert.deepEqual(parseRoster('Mary Jane\tWatson\nJean\tde la Fontaine'),[{firstName:'Mary Jane',lastName:'Watson'},{firstName:'Jean',lastName:'de la Fontaine'}]));
test('duplicates are flagged without deleting same-name players',()=>{const rows=parseRoster('Alex Morgan\nalex  morgan\nJordan');assert.deepEqual([...duplicateNames(rows)],['alex morgan']);assert.equal(rows.length,3)});

test('empty spreadsheet first names stay empty for inline validation',()=>assert.deepEqual(parseRoster('\tMorgan'),[{firstName:'',lastName:'Morgan'}]));
