import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "@/components/theme-toggle";

describe("ThemeToggle", () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => storage.set(key, value),
        removeItem: (key: string) => storage.delete(key),
      },
    });
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "";
  });

  it("defaults to dark, then toggles and persists the selected theme", () => {
    const { getByRole } = render(<ThemeToggle />);

    // Dark is the default experience after mount.
    expect(document.documentElement.classList.contains("dark")).toBe(true);

    const toggle = getByRole("button", { name: "Toggle color theme" });

    // First click switches to light and persists the choice.
    act(() => {
      toggle.click();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(document.documentElement.style.colorScheme).toBe("light");
    expect(window.localStorage.getItem("learning-hub-theme")).toBe("light");

    // Second click switches back to dark and persists.
    act(() => {
      toggle.click();
    });
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");
    expect(window.localStorage.getItem("learning-hub-theme")).toBe("dark");
    expect(getByRole("button", { name: "Toggle color theme" })).toBeInTheDocument();
  });
});
