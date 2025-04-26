import { cleanup } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ChatContextType } from "../../../hooks/useChat/useChat";
import { renderWithChatProvider } from "../../../test-utils/renderWithChatProvider/renderWithChatProvider";
import { SocketStatus } from "../SocketStatus";

const mockUseChat = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    isConnected: true,
    connectionError: null,
  })
);

vi.mock("../../../hooks/useChat/useChat", async (importActual) => {
  const actual: { useChat: () => ChatContextType } = await importActual();
  return {
    ...actual,
    useChat: mockUseChat,
  };
});

describe("SocketStatus", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should display the text 'status:'", async () => {
    const { findByText } = renderWithChatProvider(<SocketStatus />);

    expect(await findByText("status:")).toBeInTheDocument();
  });

  it("should display the text '🚨 Connection error 🚨:' when connection is errored", async () => {
    mockUseChat.mockReturnValueOnce({
      isConnected: false,
      connectionError: "connection__error",
    });

    const { findByText, queryByText } = renderWithChatProvider(
      <SocketStatus />
    );

    expect(await findByText(/connection error/i)).toBeInTheDocument();
    const heading = queryByText("WebSocket Status:");
    expect(heading).not.toBeInTheDocument();
  });

  it("should display '✅' when connected", async () => {
    const { findByText } = renderWithChatProvider(<SocketStatus />);

    expect(await findByText("✅")).toBeInTheDocument();
  });

  it("should display '❌' when not connected", async () => {
    mockUseChat.mockReturnValueOnce({
      isConnected: false,
      connectionError: null,
    });

    const { findByText } = renderWithChatProvider(<SocketStatus />);

    expect(await findByText("❌")).toBeInTheDocument();
  });
});
