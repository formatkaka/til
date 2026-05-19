---
title: "Streaming"
date: "2026-05-17"
tags: ["web", "streams", "sse", "fetch"]
category: "web"
---

## Streams API

Read data chunk by chunk as it arrives — no waiting for the full response. `response.body` is a `ReadableStream`.

## EventSource / SSE

Server-Sent Events — server pushes updates over a single long-lived HTTP connection. One direction only (server → client). Auto-reconnects, no libraries needed.

**SSE runs over plain HTTP** — that means load balancers, proxies, and firewalls all just work. WebSockets use a different protocol (`ws://`) that needs explicit infrastructure support. If you don't need bidirectional communication, SSE is the simpler, more infra-friendly choice.

**HTTP/2 matters** — without it, browsers cap SSE connections at 6 per domain across all tabs. With HTTP/2 that limit goes up to 100. Run SSE over HTTP/2.

**LLMs use SSE but not `EventSource`** — ChatGPT, OpenAI etc. stream tokens using the SSE format (`content-type: text/event-stream`, `data: {...}` blocks, ends with `data: [DONE]`). But they can't use the browser's `EventSource` API because it only supports GET. LLM APIs need POST, so they use `fetch` + readable streams instead.

---

## Using Streams API

3 ways to consume a fetch stream:

**1. `getReader()` + async/await**
```
async function read(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // process chunk (Uint8Array)
  }
}
```

**2. `for await...of` (cleanest)**
```
async function read(url) {
  const response = await fetch(url);
  for await (const chunk of response.body) {
    // process chunk
  }
}
```

**3. `getReader()` + `.then()` pump — use when you need to pipe or transform**
```
fetch(url)
  .then((res) => {
    const reader = res.body.getReader();
    return new ReadableStream({
      start(controller) {
        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) { controller.close(); return; }
            controller.enqueue(value);
            return pump();
          });
        }
        return pump();
      },
    });
  })
  .then((stream) => new Response(stream))
  .then((res) => res.blob());
```

## Using EventSource

```
const source = new EventSource("/events");

source.onmessage = (e) => console.log(e.data);
source.onerror = () => source.close();
```

Server sends plain text like this:
```
data: hello\n\n
data: {"msg": "update"}\n\n
```

---

## Resources

- [SSE Are Underrated - Igor's Techno Club](https://igorstechnoclub.com/server-sent-events-sse-are-underrated/)
- [Using Readable Streams - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams)
