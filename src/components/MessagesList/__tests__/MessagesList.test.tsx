import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { Message } from "../../../hooks/useChat/useChat";
import { MessagesList } from "../MessagesList";

const mockUseChat = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useChat/useChat", () => ({
  useChat: mockUseChat,
}));

describe("MessagesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("does not render anything when there are no messages", () => {
    mockUseChat.mockReturnValueOnce({ messages: [] });

    const { queryByText } = render(<MessagesList />);

    expect(queryByText("⏰")).not.toBeInTheDocument();
  });

  test("renders a list of messages", () => {
    const messages: Message[] = [
      {
        id: 1,
        content: "Hello!",
        timestamp: new Date("2024-03-28T12:00:00Z").getTime(), // 1711627200000
      },
      {
        id: 2,
        content: "How are you?",
        timestamp: new Date("2024-03-28T12:05:00Z").getTime(), //1711627200000
      },
    ];

    mockUseChat.mockReturnValueOnce({ messages });

    const { getByText } = render(<MessagesList />);

    expect(getByText(/hello!/i)).toBeInTheDocument();
    expect(getByText("1711627200000")).toBeInTheDocument();

    expect(getByText(/how are you?/i)).toBeInTheDocument();
    expect(getByText("1711627200000")).toBeInTheDocument();
  });
});
