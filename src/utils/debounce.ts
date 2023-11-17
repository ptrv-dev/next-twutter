function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
) {
  let timerId: ReturnType<typeof setTimeout>;

  function debounced(this: unknown, ...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  }

  debounced.cancel = () => {
    clearTimeout(timerId);
  };

  return debounced;
}
export default debounce;
