import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ChatContextType, Message } from "../../../hooks/useChat/useChat";
import { renderWithChatProvider } from "../../../test-utils/renderWithChatProvider/renderWithChatProvider";
import { MessagesList } from "../MessagesList";

vi.mock("../../MessageItem/MessageItem");

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

    const { container } = renderWithChatProvider(<MessagesList />);
    expect(container.firstChild).toBeNull();
  });

  it("renders a list of MessageItem components", () => {
    const messages: Message[] = [
      {
        id: "1085d098-2f08-4a90-989c-eefc66c047a3",
        content: "Hello!",
        timestamp: 1711627200000,
        userId: "a1b2c3d4-e5f6-7a8b-9c0d-ef1234567890",
        fromMe: true,
      },
      {
        id: "d01fab40-e5a2-4b08-93d3-600ab30f83a5",
        content: "How are you?",
        timestamp: 1711627500000,
        userId: "b2c3d4e5-f6a7-8b9c-0def-1234567890ab",
        fromMe: false,
      },
    ];
    mockUseChat.mockReturnValueOnce({ messages });

    const { getAllByTestId, getByRole } = renderWithChatProvider(
      <MessagesList />
    );

    expect(getByRole("list")).toBeInTheDocument();
    expect(getAllByTestId("mock-message-item")).toHaveLength(messages.length);
  });
});
