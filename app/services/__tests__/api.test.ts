jest.mock("../../config", () => ({ API_BASE: "https://api.test" }));

import { apiFetch } from "~/services/api";

describe("apiFetch", () => {
  let originalFetch: typeof globalThis.fetch;

  beforeEach(() => {
    originalFetch = globalThis.fetch;
    (globalThis as any).fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
    (globalThis as any).fetch = originalFetch;
  });

  const jsonResponse = (body: unknown, init: Partial<ResponseInit> = {}) =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
      ...init,
    });

  it("builds URL with API_BASE and merges headers/init", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({ ok: true }));

    const res = await apiFetch<{ ok: boolean }>("/restaurants", {
      method: "POST",
      headers: { "Content-Type": "text/plain", "X-Test": "A" },
      body: "hello",
    });

    expect(res).toEqual({ ok: true });
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    const [url, init] = (globalThis.fetch as jest.Mock).mock.calls[0];
    expect(String(url)).toBe("https://api.test/restaurants"); // uses mocked API_BASE
    expect(init.method).toBe("POST");
    expect(init.body).toBe("hello");
    // caller headers override default and merge
    expect(init.headers).toEqual({
      "Content-Type": "text/plain",
      "X-Test": "A",
    });
  });

  it("returns parsed JSON when content-type is application/json", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(jsonResponse({ foo: 123 }));
    const res = await apiFetch<{ foo: number }>("/foo");
    expect(res).toEqual({ foo: 123 });
  });

  it("returns undefined when content-type is not JSON", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("plain text", { status: 200, headers: { "Content-Type": "text/plain" } })
    );
    const res = await apiFetch<string>("/text-endpoint");
    expect(res).toBeUndefined();
  });

  it("returns undefined for 204 No Content", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(new Response(null, { status: 204 }));
    const res = await apiFetch<unknown>("/no-content");
    expect(res).toBeUndefined();
  });

  it("throws with response body text when status is not ok", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(
      new Response("Bad things happened", { status: 400 })
    );
    await expect(apiFetch("/bad")).rejects.toThrow("Bad things happened");
  });

  it("throws 'HTTP {status}' when status is not ok and body is empty", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce(new Response("", { status: 500 }));
    await expect(apiFetch("/server-error")).rejects.toThrow("HTTP 500");
  });
});
