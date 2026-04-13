type RetryOptions = {
  retries?: number;
  retryDelayMs?: number;
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry(
  input: RequestInfo | URL,
  init: RequestInit,
  options: RetryOptions = {},
): Promise<Response> {
  const { retries = 1, retryDelayMs = 250 } = options;
  let attempt = 0;
  let lastError: unknown = null;

  while (attempt <= retries) {
    try {
      const res = await fetch(input, init);
      const shouldRetry = res.status >= 500 && attempt < retries;
      if (!shouldRetry) return res;
    } catch (err) {
      lastError = err;
      if (attempt >= retries) throw err;
    }

    attempt += 1;
    await sleep(retryDelayMs * attempt);
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Network request failed");
}
