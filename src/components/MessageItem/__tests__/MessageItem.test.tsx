import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Message } from "../../../hooks/useChat/useChat";
import { MessageItem } from "../MessageItem";

vi.mock("../../../services/Date/formatDateTime", () => ({
  formatDateTime: vi.fn().mockReturnValue("mocked-time"),
}));

describe("MessageItem", () => {
  const baseMessage: Message = {
    id: "12345-67890-abcde-fghij-klmno",
    content: "Hello, world!",
    timestamp: 1710000000,
    userId: "54321-09876-edcba-jihgf-onmlk",
    fromMe: false,
  };

  it("renders message content", () => {
    const { getByText } = render(<MessageItem message={baseMessage} />);

    const messageElement = getByText("Hello, world!");
    expect(messageElement).toBeInTheDocument();
  });

  it("renders formatted timestamp using formatDateTime service", () => {
    const { getByText } = render(<MessageItem message={baseMessage} />);

    const timestampElement = getByText("mocked-time");
    expect(timestampElement).toBeInTheDocument();
  });

  it("applies sent class when fromMe is true", () => {
    const message = { ...baseMessage, fromMe: true };

    const { container } = render(<MessageItem message={message} />);

    const li = container.querySelector("li");
    expect(li?.className).toMatch(/messages__item--sent/);
  });

  it("applies received class when fromMe is false", () => {
    const message = { ...baseMessage, fromMe: false };

    const { container } = render(<MessageItem message={message} />);

    const li = container.querySelector("li");
    expect(li?.className).toMatch(/messages__item--received/);
  });

  it("renders different content for different messages", () => {
    const anotherMessage: Message = {
      ...baseMessage,
      id: "12345-67890-abcde-fghij-other",
      content: "Another message",
    };

    const { getByText } = render(<MessageItem message={anotherMessage} />);

    const messageElement = getByText("Another message");
    expect(messageElement).toBeInTheDocument();
  });
});
