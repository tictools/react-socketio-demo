import { describe, expect, it } from "vitest";

import {
  createRandomAvatar,
  avatars as validAvatars,
} from "../createRandomAvatar";

describe("createRandomAvatar", () => {
  it("should return a single emoji", () => {
    const avatar = createRandomAvatar();

    expect(typeof avatar).toBe("string");
    expect(avatar.length).toBeGreaterThan(0);
  });

  it("should return a valid emoji from the list", () => {
    const avatar = createRandomAvatar();
    expect(validAvatars).toContain(avatar);
  });
});
