import { useState } from "react";

import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent, { type UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { io } from "socket.io-client";

import { useChat } from "../../../../hooks/useChat/useChat";
import { SOCKET_EVENT } from "../../constants";
import { ChatProvider } from "../ChatProvider";

type EventCallback = (payload?: unknown) => void;

type MockSocket = {
  on: (event: string, callback: EventCallback) => void;
  off: (event: string, callback: EventCallback) => void;
  emit: (event: string, payload: unknown) => void;
  disconnect: () => void;
  __simulateEvent: (event: string, payload?: unknown) => void;
};

vi.mock("socket.io-client", () => {
  const listeners: Record<string, EventCallback> = {};

  const mockSocket = {
    on: (event: string, callback: EventCallback) => {
      listeners[event] = callback;
    },
    off: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    __simulateEvent: (event: string, payload?: unknown) => {
      const cb = listeners[event];
      if (cb) cb(payload);
    },
  };

  return {
    io: vi.fn(() => mockSocket),
  };
});

const TestComponent = () => {
  const { isConnected, connectionError, messages, sendMessage } = useChat();
  const [input, setInput] = useState<string>("");

  return (
    <div>
      <p>Connected: {isConnected ? "yes" : "no"}</p>
      <p>Error: {connectionError ?? "none"}</p>
      <p>Messages: {messages.length}</p>
      <input
        placeholder="Type message"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={() => sendMessage(input)}>Send</button>
    </div>
  );
};

describe("ChatProvider", () => {
  let socketMock: MockSocket;
  let user: UserEvent;

  beforeEach(() => {
    socketMock = io() as unknown as MockSocket;
    user = userEvent.setup();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("provides context values and responds to socket events", () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    expect(screen.getByText("Connected: no")).toBeInTheDocument();
    expect(screen.getByText("Error: none")).toBeInTheDocument();
    expect(screen.getByText("Messages: 0")).toBeInTheDocument();

    act(() => {
      socketMock.__simulateEvent(SOCKET_EVENT.CONNECT);
    });
    expect(screen.getByText("Connected: yes")).toBeInTheDocument();

    act(() => {
      socketMock.__simulateEvent(SOCKET_EVENT.CONNECT_ERROR);
    });
    expect(screen.getByText("Error: Connection refused")).toBeInTheDocument();

    act(() => {
      socketMock.__simulateEvent(SOCKET_EVENT.FIRST_LOAD, {
        messages: [
          { id: "1-1-1-1-1", content: "Hello!", timestamp: Date.now() },
        ],
      });
    });
    expect(screen.getByText("Messages: 1")).toBeInTheDocument();

    act(() => {
      socketMock.__simulateEvent(SOCKET_EVENT.SOCKET_MESSAGE, {
        id: "2-2-2-2-2",
        content: "Bye!",
        timestamp: Date.now(),
      });
    });
    expect(screen.getByText("Messages: 2")).toBeInTheDocument();
  });

  it("sends a non-empty message", async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    const input = screen.getByPlaceholderText("Type message");
    const button = screen.getByText("Send");

    await user.type(input, "Hello World");
    await user.click(button);

    expect(io().emit).toHaveBeenCalledTimes(1);
    expect(io().emit).toHaveBeenCalledWith(
      SOCKET_EVENT.CLIENT_MESSAGE,
      expect.objectContaining({ content: "Hello World" })
    );
  });

  it("does not send an empty message", async () => {
    render(
      <ChatProvider>
        <TestComponent />
      </ChatProvider>
    );

    const input = screen.getByPlaceholderText("Type message");
    const button = screen.getByText("Send");

    await user.type(input, " ");
    await user.click(button);

    expect(io().emit).not.toHaveBeenCalled();
  });
});
