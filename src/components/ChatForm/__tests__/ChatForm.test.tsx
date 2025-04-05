import "@testing-library/jest-dom";
import userEvent, { UserEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ChatContextType } from "../../../contexts/Chat/hooks/useChat/useChat";
import { renderWithChatProvider } from "../../../test-utils/renderWithChatProvider/renderWithChatProvider";
import { ChatForm } from "../ChatForm";

const mockSendMessage = vi.hoisted(() => vi.fn());
vi.mock(
  "../../../contexts/Chat/hooks/useChat/useChat",
  async (importActual) => {
    const actual: { useChat: () => ChatContextType } = await importActual();

    return {
      ...actual,
      useChat: () => ({
        sendMessage: mockSendMessage,
      }),
    };
  }
);

describe("ChatForm", () => {
  let user: UserEvent;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should render the input field", () => {
    const { getByRole } = renderWithChatProvider(<ChatForm />);

    const input = getByRole("textbox", { name: /message-content/i });

    expect(input).toBeInTheDocument();
  });

  it("should render the submit button", () => {
    const { getByRole } = renderWithChatProvider(<ChatForm />);

    const submitButton = getByRole("button", { name: /send/i });

    expect(submitButton).toBeInTheDocument();
  });

  it("should call sendMessage with the correct message when submitting the form", async () => {
    const { getByRole } = renderWithChatProvider(<ChatForm />);

    const submitButton = getByRole("button", { name: /send/i });
    const input = getByRole("textbox", { name: /message-content/i });

    await user.type(input, "Hello, world!");
    await user.click(submitButton);

    expect(mockSendMessage).toHaveBeenCalledWith("Hello, world!");
  });

  it("should clear the form after submission", async () => {
    const { getByRole } = renderWithChatProvider(<ChatForm />);

    const submitButton = getByRole("button", { name: /send/i });
    const input = getByRole("textbox", { name: /message-content/i });

    await user.type(input, "Hello, world!");
    await user.click(submitButton);

    expect(input).toHaveValue("");
  });
});
