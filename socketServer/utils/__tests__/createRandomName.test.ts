import { describe, expect, it } from "vitest";
import { createRandomName } from "../createRandomName";

describe("createRandomName", () => {
  it("should return a string with two words", () => {
    const name = createRandomName();
    const words = name.split(" ");
    expect(words.length).toBe(2);
  });

  it("should return a string that starts with a capital letter in each word", () => {
    const name = createRandomName();
    const [first, second] = name.split(" ");
    expect(first[0]).toBe(first[0].toUpperCase());
    expect(second[0]).toBe(second[0].toUpperCase());
  });

  it("should contain valid adjective and animal", () => {
    const adjectives = ["Curious", "Brave", "Silent", "Happy", "Swift"];
    const animals = ["Fox", "Tiger", "Koala", "Dolphin", "Owl"];

    const [adj, animal] = createRandomName().split(" ");
    expect(adjectives).toContain(adj);
    expect(animals).toContain(animal);
  });
});
