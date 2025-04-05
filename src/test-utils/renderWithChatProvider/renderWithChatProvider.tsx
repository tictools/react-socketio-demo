import { render } from "@testing-library/react";
import { ChatProvider } from "../../contexts/Chat/providers/ChatProvider";

export const renderWithChatProvider = (ui: React.ReactElement) =>
  render(<ChatProvider>{ui}</ChatProvider>);
