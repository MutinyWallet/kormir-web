/* eslint-disable no-restricted-globals */
import initKormir, { Kormir } from "@benthecarman/kormir-wasm";
import { KormirMethodNames } from "~/state/kormirProxy";

interface KormirInstanceMap {
  [id: string]: Kormir;
}

const kormirInstances: KormirInstanceMap = {};

// Initialize the Kormir Wasm module once at the worker startup.
let wasmInitialized = false;

// @ts-expect-error idk why onconnect isn't on self
self.onconnect = (e: MessageEvent) => {
  const port = e.ports[0];

  port.onmessage = async (event: MessageEvent) => {
    const { id, method, args } = event.data;

    // Ensure Wasm is initialized before handling any messages
    if (!wasmInitialized) {
      try {
        await initKormir();
        wasmInitialized = true;
      } catch (error) {
        const e = error as Error;
        port.postMessage({
          id,
          error: "Failed to initialize Kormir Wasm: " + e.message,
        });
        return;
      }
    }

    try {
      if (method === "new") {
        const kormirInstance = await Kormir.new([
          "wss://nostr.mutinywallet.com",
        ]);
        kormirInstances[id] = kormirInstance;
        port.postMessage({ id, result: "Instance created" });
        return;
      }

      if (method === "restore") {
        console.log("Restoring instance");
        await Kormir.restore(args[0]);
        port.postMessage({ id, result: "Instance restored" });
        return;
      }

      if (kormirInstances[id]) {
        const kormirInstance = kormirInstances[id];
        // Methods are called based on the name provided in the message.
        // TypeScript doesn't know what methods are available on kormirInstance,
        // so we need to use a type assertion here.

        // @ts-expect-error this works but typescript is mad
        const result = await kormirInstance[method as KormirMethodNames](
          ...args,
        );
        port.postMessage({ id, result });
      }
    } catch (error) {
      const e = error as Error;
      port.postMessage({ id, error: e.message });
    }
  };
};
