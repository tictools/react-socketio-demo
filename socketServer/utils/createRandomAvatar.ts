export const avatars = [
  "🦊",
  "🐯",
  "🐨",
  "🐬",
  "🦉",
  "🐸",
  "🐼",
  "🦁",
  "🐻",
  "🦄",
];

export const createRandomAvatar = () =>
  avatars[Math.floor(Math.random() * avatars.length)];
