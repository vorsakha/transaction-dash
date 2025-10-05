import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/custom/loading-spinner";

describe("LoadingSpinner", () => {
  it("renders with default medium size", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(spinner).toHaveClass("animate-spin");
    expect(spinner).toHaveClass("h-6");
    expect(spinner).toHaveClass("w-6");
    expect(spinner).toHaveClass("text-current");

    const container = spinner.parentElement;
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("justify-center");
  });

  it("renders with small size", () => {
    render(<LoadingSpinner size="sm" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-4");
    expect(spinner).toHaveClass("w-4");
  });

  it("renders with large size", () => {
    render(<LoadingSpinner size="lg" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("h-8");
    expect(spinner).toHaveClass("w-8");
  });

  it("applies additional props to container", () => {
    render(<LoadingSpinner data-testid="custom-spinner" className="mt-4" />);

    const container = screen.getByTestId("custom-spinner");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("justify-center");
    expect(container).toHaveClass("mt-4");
  });

  it("has proper accessibility attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(spinner).toHaveAttribute("role", "status");
  });

  it("applies custom data-testid to container", () => {
    render(<LoadingSpinner data-testid="loading-indicator" />);

    const container = screen.getByTestId("loading-indicator");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("justify-center");
  });
});
