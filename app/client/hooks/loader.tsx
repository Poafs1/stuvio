export const useLoader = () => {
  // Set loading spinner in button
  const setLoader = (name: string, size: string) => {
    const elem: HTMLElement|null = document.getElementById(`button-${size}-spin-${name}`)
    if (elem == null) return
    elem.style.display = 'block'
  }

  // Clear loading spinner in button
  const clearLoader = (name: string, size: string) => {
    const elem: HTMLElement|null = document.getElementById(`button-${size}-spin-${name}`)
    if (elem == null) return
    elem.style.display = 'none'
  }

  return {
    setLoader, clearLoader
  }
}