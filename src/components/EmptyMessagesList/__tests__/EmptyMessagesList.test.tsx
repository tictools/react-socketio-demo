import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { EmptyMessagesList } from "../EmptyMessagesList";

const mockUseChat = vi.hoisted(() => vi.fn());

vi.mock("../../../hooks/useChat", () => ({
  useChat: mockUseChat,
}));

describe("EmptyMessagesList", () => {
  test("displays 'No messages' when there are no messages", () => {
    mockUseChat.mockReturnValue({ messages: [] });

    render(<EmptyMessagesList />);

    expect(screen.getByText("No messages")).toBeInTheDocument();
  });

  test("does not display anything when there are messages", () => {
    mockUseChat.mockReturnValue({ messages: ["Hello!"] });

    render(<EmptyMessagesList />);

    expect(screen.queryByText("No messages")).not.toBeInTheDocument();
  });
});
