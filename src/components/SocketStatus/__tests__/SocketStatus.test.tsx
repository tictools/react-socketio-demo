import "@testing-library/jest-dom";
import { cleanup, render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SocketStatus } from "../SocketStatus";

const mockUseChat = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    isConnected: true,
    connectionError: null,
  })
);

vi.mock("../../../hooks/useChat", () => ({
  useChat: mockUseChat,
}));

describe("SocketStatus", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("should display the text 'WebSocket Status:'", async () => {
    const { findByText } = render(<SocketStatus />);

    expect(await findByText("WebSocket Status:")).toBeInTheDocument();
  });

  it("should display the text '🚨 Connection error 🚨:' when connection is errored", async () => {
    mockUseChat.mockReturnValueOnce({
      isConnected: false,
      connectionError: "connection__error",
    });

    const { findByText, queryByText } = render(<SocketStatus />);

    expect(await findByText(/connection error/i)).toBeInTheDocument();
    const heading = queryByText("WebSocket Status:");
    expect(heading).not.toBeInTheDocument();
  });

  it("should display 'Connected ✅' when connected", async () => {
    const { findByText } = render(<SocketStatus />);

    expect(await findByText("Connected ✅")).toBeInTheDocument();
  });

  it("should display 'Disconnected ❌' when not connected", async () => {
    mockUseChat.mockReturnValueOnce({
      isConnected: false,
      connectionError: null,
    });

    const { findByText } = render(<SocketStatus />);

    expect(await findByText("Disconnected ❌")).toBeInTheDocument();
  });
});
