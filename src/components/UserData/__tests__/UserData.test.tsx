import { cleanup } from "@testing-library/react";
import { beforeEach, describe, it, vi } from "vitest";
import { ChatContextType } from "../../../hooks/useChat/useChat";
import { renderWithChatProvider } from "../../../test-utils/renderWithChatProvider/renderWithChatProvider";
import { UserData } from "../UserData";
// import { useChat } from "../../../hooks/useChat/useChat";

const mockUseChat = vi.hoisted(() =>
  vi.fn().mockReturnValue({
    user: { name: "John Doe", avatar: "👤" },
  })
);

vi.mock("../../../hooks/useChat/useChat", async (importActual) => {
  const actual: { useChat: () => ChatContextType } = await importActual();
  return {
    ...actual,
    useChat: mockUseChat,
  };
});

describe("UserData Component", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders the user's name and avatar when user data is available", async () => {
    const { findByText } = renderWithChatProvider(<UserData />);

    const avatar = await findByText("👤");
    const name = await findByText(/john doe/i);

    expect(avatar).toBeInTheDocument();
    expect(name).toBeInTheDocument();
  });

  it("renders 'unknown user' when user data is not available", async () => {
    mockUseChat.mockReturnValueOnce({
      user: null,
    });

    const { findByText } = renderWithChatProvider(<UserData />);

    const unknownUserName = await findByText(/unknown user/i);

    expect(unknownUserName).toBeInTheDocument();
  });

  it("renders the UserStatus component", async () => {
    const { findByText } = renderWithChatProvider(<UserData />);

    const status = await findByText(/status/i);

    expect(status).toBeInTheDocument();
  });
});
