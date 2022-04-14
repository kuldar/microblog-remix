import words from "~/utils/words";

export function generateCode(_count) {
  const count = _count || 3;
  const code = [];

  for (let i = 0; i < count - 1; i++) {
    const randomAdjectiveIndex = Math.floor(
      Math.random() * words.adjective.length
    );
    code.push(words.adjective[randomAdjectiveIndex]);
  }

  const randomNounIndex = Math.floor(Math.random() * words.noun.length);
  code.push(words.noun[randomNounIndex]);

  return code.join("-").toLowerCase();
}
