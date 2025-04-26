export const createRandomName = () => {
  const adjectives = ["Curious", "Brave", "Silent", "Happy", "Swift"];
  const animals = ["Fox", "Tiger", "Koala", "Dolphin", "Owl"];

  const prefix = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];

  return `${prefix} ${animal}`;
};
