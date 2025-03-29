import "@testing-library/jest-dom";
import { fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ChatForm } from "../ChatForm";

const mockSendMessage = vi.hoisted(() => vi.fn());
vi.mock("../../../hooks/useChat", () => ({
  useChat: () => ({
    sendMessage: mockSendMessage,
  }),
}));

describe("ChatForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the input field", () => {
    const { getByRole } = render(<ChatForm />);

    const input = getByRole("textbox", { name: /message-content/i });

    expect(input).toBeInTheDocument();
  });

  it("should call sendMessage with the correct message when submitting the form", () => {
    const { getByRole } = render(<ChatForm />);

    const form = getByRole("form");
    const input = getByRole("textbox", { name: /message-content/i });

    fireEvent.change(input, { target: { value: "Hello, world!" } });
    fireEvent.submit(form);

    expect(mockSendMessage).toHaveBeenCalledWith("Hello, world!");
  });

  it("should clear the form after submission", () => {
    const { getByRole } = render(<ChatForm />);

    const form = getByRole("form");
    const input = getByRole("textbox", { name: /message-content/i });

    fireEvent.change(input, { target: { value: "Test message" } });
    fireEvent.submit(form);

    expect(input).toHaveValue("");
  });
});
