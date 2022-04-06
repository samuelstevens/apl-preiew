function getElementOrThrow(query: string): Element {
  const elem = document.querySelector(query);
  if (!elem) {
    const err =`Couldn't find element ${query}`;
    throw new Error(err);
  }
  return elem;
}

export default { getElementOrThrow };
