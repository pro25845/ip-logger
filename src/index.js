export default {
  async fetch(request, env, ctx) {
    // IPv4を優先取得し、なければ通常のIP（IPv6含む）を取得
    const ip =
      request.headers.get("CF-Connecting-IPv4") ??
      request.headers.get("CF-Connecting-IP") ??
      "unknown";

    const url = new URL(request.url);

    // レスポンスを遅らせないようバックグラウンドで記録
    ctx.waitUntil(
      env.DB.prepare(
        "INSERT INTO visits (ip, method, path, user_agent, country) VALUES (?, ?, ?, ?, ?)"
      )
        .bind(
          ip,
          request.method,
          url.pathname + url.search,
          request.headers.get("User-Agent"),
          request.cf?.country ?? null
        )
        .run()
        .catch((err) => console.error("DB insert failed:", err))
    );

    return new Response("Not Found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  },
};
