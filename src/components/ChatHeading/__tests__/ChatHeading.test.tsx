import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ChatHeading } from "../ChatHeading";

describe("ChatHeading", () => {
  it("renders the correct heading text", () => {
    render(<ChatHeading />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "react-socketio-demo"
    );
  });
});
