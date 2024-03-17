export const localeFind = (locales: string[], a: string) => locales.find(loc => localeMatch(loc, a))

const localeMatch = (a: string, b: string) => {
  if (a === '' || b === '') return false
  const arrA = a.toLowerCase().split('-')
  const arrB = b.toLowerCase().split('-')
  for (let i = 0, len = Math.max(arrA.length, arrB.length); i < len; i++) {
    if (arrA[i] && arrB[i] && arrA[i] !== arrB[i]) return false
  }
  return true
}
