/* eslint-disable */
import { TextOverflowEllipsis } from './TextOverflowEllipsis';

test('TextOverflow Ellipsis adds ellipsis with cutoff of 10 and string length > 10', () => {
  expect(TextOverflowEllipsis('0123456789a', 10)).toBe('0123456...');
});
test('TextOverflow Ellipsis does not add ellipsis with cutoff of 10 and string length 9', () => {
  expect(TextOverflowEllipsis('012345678', 10)).toBe('012345678');
});
test('TextOverflow Ellipsis with no string input and cutoff of 10 returns empty string', () => {
  expect(TextOverflowEllipsis(null, 10)).toBe('');
});
test('TextOverflow Ellipsis with string length of 3 and cutoff of null returns empty string', () => {
  expect(TextOverflowEllipsis('123', null)).toBe('');
});
test('TextOverflow Ellipsis with null string input and cutoff of 0 returns empty string', () => {
  expect(TextOverflowEllipsis(null, 0)).toBe('');
});
test('TextOverflow Ellipsis with string input of 3 and cutoff of 2 returns string', () => {
  expect(TextOverflowEllipsis('123', 2)).toBe('123');
});
