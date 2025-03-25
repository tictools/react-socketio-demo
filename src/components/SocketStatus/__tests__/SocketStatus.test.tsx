import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, it, vi } from "vitest";
import { SocketStatus } from "../SocketStatus";

const mockUseSocket = vi.hoisted(() => vi.fn());

vi.mock("../hooks/useSocket", () => ({
  useSocket: mockUseSocket,
}));

describe("SocketStatus", () => {
  beforeEach(() => {
    cleanup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should display the text 'WebSocket Status:'", async () => {
    mockUseSocket.mockReturnValueOnce({ isConnected: true });

    const { findByText } = render(<SocketStatus />);

    await findByText("WebSocket Status:");
  });

  it("should display 'Connected ✅' when connected", async () => {
    mockUseSocket.mockReturnValueOnce({ isConnected: true });

    const { findByText } = render(<SocketStatus />);

    await findByText("Connected ✅");
  });

  it("should display 'Disconnected ❌' when not connected", async () => {
    mockUseSocket.mockReturnValueOnce({ isConnected: false });

    const { findByText } = render(<SocketStatus />);

    await findByText("Disconnected ❌");
  });
});
