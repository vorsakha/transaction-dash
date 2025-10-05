import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveClass(className: string): R;
      toBeDisabled(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeVisible(): R;
      toHaveFocus(): R;
      toBeChecked(): R;
      toBeEmpty(): R;
      toHaveStyle(styles: Record<string, string>): R;
    }
  }
}
