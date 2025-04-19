import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { ChatContextType, Message } from "../../../hooks/useChat/useChat";
import { renderWithChatProvider } from "../../../test-utils/renderWithChatProvider/renderWithChatProvider";
import { MessagesList } from "../MessagesList";

const mockUseChat = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useChat/useChat", async (importActual) => {
  const actual: { useChat: () => ChatContextType } = await importActual();

  return {
    ...actual,
    useChat: mockUseChat,
  };
});

describe("MessagesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render anything when there are no messages", () => {
    mockUseChat.mockReturnValueOnce({ messages: [] });

    const { queryByText } = renderWithChatProvider(<MessagesList />);

    expect(queryByText("⏰")).not.toBeInTheDocument();
  });

  it("renders a list of messages", () => {
    const messages: Message[] = [
      {
        id: "1085d098-2f08-4a90-989c-eefc66c047a3",
        content: "Hello!",
        timestamp: new Date("2024-03-28T12:00:00Z").getTime(), // 1711627200000
      },
      {
        id: "d01fab40-e5a2-4b08-93d3-600ab30f83a5",
        content: "How are you?",
        timestamp: new Date("2024-03-28T12:05:00Z").getTime(), //1711627200000
      },
    ];

    mockUseChat.mockReturnValueOnce({ messages });

    const { getByText } = renderWithChatProvider(<MessagesList />);

    expect(getByText(/hello!/i)).toBeInTheDocument();
    expect(getByText("1711627200000")).toBeInTheDocument();

    expect(getByText(/how are you?/i)).toBeInTheDocument();
    expect(getByText("1711627200000")).toBeInTheDocument();
  });
});
