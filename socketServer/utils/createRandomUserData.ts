export const adjectives = ["Curious", "Brave", "Silent", "Happy", "Swift"];
export const animalToEmoji = {
  Fox: "🦊",
  Tiger: "🐯",
  Koala: "🐨",
  Dolphin: "🐬",
  Owl: "🦉",
  Frog: "🐸",
  Panda: "🐼",
  Lion: "🦁",
  Bear: "🐻",
  Unicorn: "🦄",
};

export const createRandomUserData = () => {
  const animals = Object.keys(animalToEmoji);

  const prefix = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const avatar = animalToEmoji[animal];

  return {
    name: `${prefix} ${animal}`,
    avatar,
  };
};
