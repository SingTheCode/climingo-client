import "@testing-library/jest-dom";

// Suppress React warnings related to Next.js Image component in tests
const originalError = console.error;
console.error = (...args: any[]) => {
  if (
    typeof args[0] === "string" &&
    (args[0].includes("React does not recognize the `fetchPriority` prop") ||
      args[0].includes("Warning: React does not recognize"))
  ) {
    return;
  }
  originalError(...args);
};

beforeEach(() => {
  if (!document.body) {
    document.body = document.createElement("body");
  }

  const container = document.createElement("div");
  container.id = "test-container";
  document.body.appendChild(container);
});

afterEach(() => {
  const container = document.getElementById("test-container");
  if (container) {
    document.body.removeChild(container);
  }
});
