export function getQuery(): Record<string, string> {
  return window.location.search
    .replace('?', '')
    .split('&')
    .reduce((res, item) => {
      const [key, value] = item.split('=')
      return { ...res, [key]: value }
    }, {})
}
