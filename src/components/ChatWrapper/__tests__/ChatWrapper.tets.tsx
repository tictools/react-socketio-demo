import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ChatWrapper } from "../ChatWrapper";

describe("ChatWrapper", () => {
  test("renders its content correctly", () => {
    const { getByText } = render(
      <ChatWrapper>
        <p>Hello, world!</p>
      </ChatWrapper>
    );

    expect(getByText("Hello, world!")).toBeInTheDocument();
  });

  test("can contain multiple elements as children", () => {
    const { getByText } = render(
      <ChatWrapper>
        <p>Message 1</p>
        <p>Message 2</p>
      </ChatWrapper>
    );

    expect(getByText("Message 1")).toBeInTheDocument();
    expect(getByText("Message 2")).toBeInTheDocument();
  });
});
