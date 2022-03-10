export function getUUID() {
  let t = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    t += performance.now();
  }
  const uuid = 'xxxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (t + Math.random() * 16) % 16 | 0;
    t = Math.floor(t / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
