import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "@/components/custom/error-message";

describe("ErrorMessage", () => {
  it("renders error message when message is provided", () => {
    const message = "Something went wrong";
    render(<ErrorMessage message={message} />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
    expect(errorElement).toHaveTextContent(message);
    expect(errorElement).toHaveClass("text-destructive");
    expect(errorElement).toHaveClass("text-sm");
    expect(errorElement).toHaveClass("mt-1");
  });

  it("does not render when message is empty string", () => {
    render(<ErrorMessage message="" />);

    const errorElement = screen.queryByRole("alert");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("does not render when message is null", () => {
    render(<ErrorMessage message={null} />);

    const errorElement = screen.queryByRole("alert");
    expect(errorElement).not.toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const message = "Custom error";
    const customClass = "custom-error-class";
    render(<ErrorMessage message={message} className={customClass} />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass(customClass);
  });

  it("combines default and custom classes correctly", () => {
    const message = "Combined error";
    const customClass = "mt-4";
    render(<ErrorMessage message={message} className={customClass} />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass("text-destructive");
    expect(errorElement).toHaveClass("text-sm");
    expect(errorElement).toHaveClass("mt-1");
    expect(errorElement).toHaveClass(customClass);
  });
});
