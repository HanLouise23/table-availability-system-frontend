import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "node:util";

// Polyfill for react-router / WHATWG encoders in Jest
if (!globalThis.TextEncoder) {
  (globalThis as any).TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  (globalThis as any).TextDecoder = TextDecoder as unknown as typeof globalThis.TextDecoder;
}
