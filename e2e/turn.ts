import { strictEqual } from "assert";
import { Connection } from "../src/ice/ice";
import { assertCandidateTypes, inviteAccept } from "../tests/utils";

(async () => {
  const connA = new Connection(true, {
    turnServer: ["relay.backups.cz", 3478],
    turnUsername: "webrtc",
    turnPassword: "webrtc",
    forceTurn: true,
  });
  const connB = new Connection(false, {
    turnServer: ["relay.backups.cz", 3478],
    turnUsername: "webrtc",
    turnPassword: "webrtc",
    forceTurn: true,
  });
  await inviteAccept(connA, connB);

  // assertCandidateTypes(connA, ["relay"]);
  // assertCandidateTypes(connB, ["relay"]);

  // const candidate = connA.getDefaultCandidate(1)!;
  // strictEqual(!!candidate, true);
  // strictEqual(candidate.type, "relay");
  // strictEqual(!!candidate.relatedAddress, true);
  // strictEqual(!!candidate.relatedPort, true);

  console.log(connA.getDefaultCandidate(1)!.toSdp());
  console.log(connB.getDefaultCandidate(1)!.toSdp());

  await Promise.all([connA.connect(), connB.connect()]);

  setInterval(() => {
    connA.send(Buffer.from("ping"));
    connB.send(Buffer.from("pong"));
  }, 2000);

  connA.send(Buffer.from("a"));
  let data = await connB.recv();
  strictEqual(data.toString(), "a");

  connB.send(Buffer.from("b"));
  data = await connA.recv();
  strictEqual(data.toString(), "b");

  connB.onData.subscribe((data) => {
    console.log("connB", data.toString());
  });

  connA.onData.subscribe((data) => {
    console.log("connA", data.toString());
  });

  console.log("done");
})();
