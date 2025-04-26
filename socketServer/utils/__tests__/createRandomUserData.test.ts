import { describe, expect, it } from "vitest";
import {
  adjectives,
  animalToEmoji,
  createRandomUserData,
} from "../createRandomUserData";

describe("createRandomUserData", () => {
  const animals = Object.keys(animalToEmoji);
  it("should return an object with name and avatar properties", () => {
    const userData = createRandomUserData();

    expect(userData).toHaveProperty("name");
    expect(userData).toHaveProperty("avatar");
  });

  it("should return a name with two words", () => {
    const { name } = createRandomUserData();

    const words = name.split(" ");

    expect(words.length).toBe(2);
  });

  it("should return a name that starts with a capital letter in each word", () => {
    const { name } = createRandomUserData();

    const [first, second] = name.split(" ");

    expect(first[0]).toBe(first[0].toUpperCase());
    expect(second[0]).toBe(second[0].toUpperCase());
  });

  it("should contain valid adjective and animal in the name", () => {
    const { name } = createRandomUserData();

    const [adj, animal] = name.split(" ");

    expect(adjectives).toContain(adj);
    expect(animals).toContain(animal);
  });

  it("should return a valid avatar object with name and emoji", () => {
    const { avatar } = createRandomUserData();
    console.log("🚀 ~ it ~ avatar:", avatar);

    expect(Object.values(animalToEmoji)).toContain(avatar);
  });
});
