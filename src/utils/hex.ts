/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export function isZeroHex(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString);
}
