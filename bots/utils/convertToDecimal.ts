const convertToDecimal = (hexadecimalString: string) => {
  const n = hexadecimalString.replace("0x", "")
  return parseInt(n, 16);
}

export default convertToDecimal
