import "@testing-library/jest-dom";

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
