import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SocketStatusError } from "../SocketStatusError";

describe("SocketStatusError", () => {
  it("should render the connection error message", async () => {
    const { findByText } = render(<SocketStatusError />);

    const element = await findByText(/connection error/i);

    expect(element.tagName).toBe("H3");
  });
});
