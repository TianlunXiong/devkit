import WebSocket from 'ws';
import superagent from 'superagent';
import signale from "signale";

export default async () => {
  const ws = new WebSocket("ws://localhost:8082/?user=tainlx");

  ws.on("open", () => {
    signale.success("[云开发服务器 已连接]");
  });

  ws.on("message", async function incoming(data) {
    const obj = JSON.parse((data as string) || "{}");
    const p = `http://localhost:3001${obj.path}`;
    const b = await superagent.get(p).then((r) => {
      return r.body;
    });
    const s = b instanceof Buffer ? b.toString() : JSON.stringify(b);
    ws.send(JSON.stringify({ path: obj.path, body: s }));
  });
};