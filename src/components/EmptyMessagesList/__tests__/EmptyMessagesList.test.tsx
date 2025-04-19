import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { type ChatContextType } from "../../../hooks/useChat/useChat";
import { renderWithChatProvider } from "../../../test-utils/renderWithChatProvider/renderWithChatProvider";
import { EmptyMessagesList } from "../EmptyMessagesList";

const mockUseChat = vi.hoisted(() => vi.fn());

vi.mock("../../../hooks/useChat/useChat", async (importActual) => {
  const actual: { useChat: () => ChatContextType } = await importActual();
  return {
    ...actual,
    useChat: mockUseChat,
  };
});

describe("EmptyMessagesList", () => {
  test("displays 'No messages' when there are no messages", () => {
    mockUseChat.mockReturnValue({ messages: [] });

    renderWithChatProvider(<EmptyMessagesList />);

    expect(screen.getByText("No messages")).toBeInTheDocument();
  });

  test("does not display anything when there are messages", () => {
    mockUseChat.mockReturnValue({ messages: ["Hello!"] });

    renderWithChatProvider(<EmptyMessagesList />);

    expect(screen.queryByText("No messages")).not.toBeInTheDocument();
  });
});
