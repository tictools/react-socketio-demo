import { renderHook } from "@testing-library/react";
import { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ChatContext, Message, useChat } from "../useChat";

describe("useChat", () => {
  const mockContext = {
    isConnected: true,
    connectionError: null,
    messages: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        content: "Hello",
        timestamp: Date.now(),
      } satisfies Message,
    ],
    sendMessage: vi.fn(),
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <ChatContext.Provider value={mockContext}>{children}</ChatContext.Provider>
  );

  it("throws if used outside of ChatProvider", () => {
    const render = () => renderHook(() => useChat());
    expect(render).toThrow("useChat must be used within a ChatProvider");
  });

  it("returns context if used within ChatProvider", () => {
    const { result } = renderHook(() => useChat(), { wrapper });
    expect(result.current).toEqual(mockContext);
  });
});
