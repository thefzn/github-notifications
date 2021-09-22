const NOW: number = new Date().getTime()

export function getQuery(): Record<string, string> {
  return window.location.search
    .replace('?', '')
    .split('&')
    .reduce((res, item) => {
      const [key, value] = item.split('=')
      return { ...res, [key]: value }
    }, {})
}

export function objectToForm(object: any): string {
  return Object.keys(object).reduce((form: string, key: string) => {
    const spacer: string = form ? '&' : ''
    return `${form}${spacer}${key}=${encodeURIComponent(object[key])}`
  }, '')
}

export function formatTimeSince(date: number): string {
  let age = Math.abs(date - NOW) / 1000
  let timeSince = []
  const days = Math.floor(age / 86400)
  age -= days * 86400

  const hours = Math.floor(age / 3600) % 24
  age -= hours * 3600

  const mins = Math.floor(age / 60) % 60
  age -= mins * 60

  const seconds = age % 60

  if (days) timeSince.push(`${days}d`)
  if (hours) timeSince.push(`${hours}h`)
  if (mins) timeSince.push(`${mins}m`)

  if (timeSince.length) return timeSince.join(' ')
  if (seconds > 30) return 'a few moments ago'
  else return 'just now'
}
