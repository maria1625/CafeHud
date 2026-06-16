import fs from "node:fs";
import path from "node:path";
import http from "node:http";

const sessionId = "inventory-not-reflecting";
const outdir = path.resolve(".dbg");
const port = 7777;
const host = "127.0.0.1";

fs.mkdirSync(outdir, { recursive: true });

const logFile = path.join(outdir, `trae-debug-log-${sessionId}.ndjson`);
const envFile = path.join(outdir, `${sessionId}.env`);

try {
  fs.writeFileSync(logFile, "");
} catch {}

fs.writeFileSync(
  envFile,
  `DEBUG_SERVER_URL=http://${host}:${port}/event\nDEBUG_SESSION_ID=${sessionId}\n`
);

const writeJson = (res, status, data) => {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET, DELETE",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS" && req.url === "/event") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS, GET, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/event") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      try {
        const event = JSON.parse(body || "{}");
        if (!event.ts) event.ts = Date.now();
        fs.appendFileSync(logFile, `${JSON.stringify(event)}\n`);
        writeJson(res, 200, { ok: true });
      } catch (error) {
        writeJson(res, 400, { ok: false, error: error.message });
      }
    });
    return;
  }

  if (req.method === "GET" && req.url === "/logs") {
    try {
      const logs = fs.existsSync(logFile)
        ? fs.readFileSync(logFile, "utf8").split("\n").filter(Boolean).map((line) => JSON.parse(line))
        : [];
      writeJson(res, 200, { logs });
    } catch (error) {
      writeJson(res, 500, { ok: false, error: error.message });
    }
    return;
  }

  if (req.method === "DELETE" && req.url === "/logs") {
    fs.writeFileSync(logFile, "");
    writeJson(res, 200, { ok: true });
    return;
  }

  if (req.method === "GET" && req.url === "/health") {
    writeJson(res, 200, { ok: true, sessionId, logFile, envFile });
    return;
  }

  writeJson(res, 404, { ok: false });
});

server.listen(port, host, () => {
  process.stdout.write(
    `@@DEBUG_SERVER_INFO\n${JSON.stringify(
      {
        api_url: `http://${host}:${port}/event`,
        session_id: sessionId,
        log_dir: outdir,
        log_file: logFile,
        env_file: envFile,
      },
      null,
      2
    )}\n@@END_DEBUG_SERVER_INFO\n`
  );
});
