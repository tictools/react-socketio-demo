/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from "@testing-library/react";
import { io } from "socket.io-client";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockInstance,
  vi,
} from "vitest";
import { SOCKET_EVENT } from "../../../constants";
import { useChat } from "../useChat";

vi.mock("socket.io-client", () => {
  const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    off: vi.fn(),
    id: "mock-socket-id",
  };
  return { io: vi.fn(() => mockSocket) };
});

const getMockHandler = ({
  mockCalls,
  eventType,
}: {
  mockCalls: any[][];
  eventType: string;
}) => {
  const callHandler = mockCalls.find(([event]) => event === eventType);

  const [, onCallFn] = callHandler ?? [];

  return onCallFn;
};

describe.skip("useChat", () => {
  type MockSocket = {
    on: MockInstance;
    emit: MockInstance;
    disconnect: MockInstance;
    id: string;
  };

  let mockSocket: MockSocket;

  beforeEach(() => {
    mockSocket = io() as unknown as MockSocket;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should connect to the socket and listen to events", async () => {
    renderHook(() => useChat());

    expect(mockSocket.on).toHaveBeenCalledWith(
      SOCKET_EVENT.CONNECT,
      expect.any(Function)
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      SOCKET_EVENT.CONNECT_ERROR,
      expect.any(Function)
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      SOCKET_EVENT.FIRST_LOAD,
      expect.any(Function)
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      SOCKET_EVENT.SOCKET_MESSAGE,
      expect.any(Function)
    );
    expect(mockSocket.on).toHaveBeenCalledWith(
      SOCKET_EVENT.DISCONNECT,
      expect.any(Function)
    );
  });

  it("should handle connection correctly", async () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      const onConnect = getMockHandler({
        mockCalls: mockSocket.on.mock.calls,
        eventType: SOCKET_EVENT.CONNECT,
      });

      expect(onConnect).toBeDefined();

      onConnect?.();
    });

    expect(result.current.isConnected).toBe(true);

    act(() => {
      const onDisconnect = getMockHandler({
        mockCalls: mockSocket.on.mock.calls,
        eventType: SOCKET_EVENT.DISCONNECT,
      });

      expect(onDisconnect).toBeDefined();

      onDisconnect?.();
    });

    expect(result.current.isConnected).toBe(false);
  });

  it("should handle connection errors", async () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      const onConnectError = getMockHandler({
        mockCalls: mockSocket.on.mock.calls,
        eventType: SOCKET_EVENT.CONNECT_ERROR,
      });

      expect(onConnectError).toBeDefined();

      onConnectError?.();
    });

    expect(result.current.connectionError).toBe("Connection refused");
  });

  it("should load initial messages", async () => {
    const { result } = renderHook(() => useChat());

    const initialMessages = [
      { id: 1, content: "Hello!", timestamp: Date.now() },
    ];

    act(() => {
      const onFirstLoad = getMockHandler({
        mockCalls: mockSocket.on.mock.calls,
        eventType: SOCKET_EVENT.FIRST_LOAD,
      });

      expect(onFirstLoad).toBeDefined();

      onFirstLoad?.({ messages: initialMessages });
    });

    expect(result.current.messages).toEqual(initialMessages);
  });

  it("should add new messages when received via socket", async () => {
    const { result } = renderHook(() => useChat());

    const newMessage = {
      id: 2,
      content: "New message",
      timestamp: Date.now(),
    };

    act(() => {
      const onSocketMessage = getMockHandler({
        mockCalls: mockSocket.on.mock.calls,
        eventType: SOCKET_EVENT.SOCKET_MESSAGE,
      });

      expect(onSocketMessage).toBeDefined();

      onSocketMessage?.(newMessage);
    });

    expect(result.current.messages).toContainEqual(newMessage);
  });

  it("should send a message correctly", async () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("Test message");
    });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      SOCKET_EVENT.CLIENT_MESSAGE,
      expect.objectContaining({ content: "Test message :: mock-socket-id" })
    );
  });

  it("should not send empty or whitespace-only messages", async () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.sendMessage("");
    });

    act(() => {
      result.current.sendMessage("    ");
    });

    expect(mockSocket.emit).not.toHaveBeenCalled();
  });
});
