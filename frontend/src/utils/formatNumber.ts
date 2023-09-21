import numeral from 'numeral';

// ----------------------------------------------------------------------

export function fCurrency(number: string | number, precision: number = 2) {
  const amount = numeral(number);
  const amount_value = amount.value();
  if (amount_value && amount_value >= 1) { precision = 2 };
  const formatString = Number.isInteger(number) ? '$0,0' : `$0,0.${'0'.repeat(precision)}`;
  return amount.format(formatString);
}

export function fCurrencyWithNoSymbol(number: string | number) {
  return numeral(number).format(Number.isInteger(number) ? '0,0' : '0,0.00');
}
export function fCurrencyWithCustomCurrency(number: string | number, currency: string) {
  return numeral(number).format(Number.isInteger(number) ? `${currency}0,0` : `${currency}0,0.00`);
}

export function fPercent(number: number) {
  return numeral(number / 100).format('0.0%');
}

export function fNumber(number: string | number, precision: number = 0) {
  const formatString = `0,0.[${'0'.repeat(precision)}]`;
  return numeral(number).format(formatString);
}

export function fShortenNumber(number: string | number) {
  return numeral(number).format('0.00a').replace('.00', '');
}

export function fData(number: string | number) {
  return numeral(number).format('0.0 b');
}
