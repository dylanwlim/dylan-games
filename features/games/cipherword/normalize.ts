export function normalizeDisplay(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeAnswer(value: string) {
  return normalizeDisplay(value).replace(/[^a-z0-9]/g, "");
}

export function getNormalizedLetterCount(value: string) {
  return normalizeAnswer(value).length;
}

export function getAnswerShape(answer: string) {
  const parts = normalizeDisplay(answer)
    .split(" ")
    .map((part) => part.length)
    .filter(Boolean);

  return parts.length ? parts.join(" + ") : "0";
}

export function getDisplayLetterGroups(answer: string) {
  return normalizeDisplay(answer)
    .split(" ")
    .map((part) => part.split(""))
    .filter((part) => part.length);
}

export function isSameNormalizedAnswer(guess: string, answer: string, aliases: string[] = []) {
  const normalizedGuess = normalizeAnswer(guess);
  const accepted = [answer, ...aliases].map(normalizeAnswer);

  return accepted.includes(normalizedGuess);
}
