export const convertSecond = (sec: number, tiny=false) => {
  let hours = `${Math.floor(sec/3600)} hr`
  sec %= 3600
  let minute = `${Math.floor(sec/60)} min`
  let second = `${sec%60} sec`

  if (tiny) {
    hours = `${Math.floor(sec/3600)}hr`
    minute = `${Math.floor(sec/60)}m`
    second = `${(sec%60) % 1 == 0 ? (sec%60) : (sec%60).toFixed(1)}s`
  }

  if (Math.floor(sec/3600) == 0) hours = ''
  if (Math.floor(sec/60) == 0) minute = ''
  if (sec%60 == 0) second = ''

  const result = `${hours} ${minute} ${second}`

  return result.trim()
}