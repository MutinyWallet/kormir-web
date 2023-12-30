import { EventData } from "@benthecarman/kormir-wasm";

export interface KormirMethods {
  new: (relays: string[]) => Promise<KormirProxy>;
  get_public_key: () => Promise<string>;
  create_enum_event: (
    event_id: string,
    outcomes: string[],
    event_maturity_epoch: number,
  ) => Promise<string>;
  sign_enum_event: (id: number, outcome: string) => Promise<string>;
  list_events: () => Promise<any>;
  // ... other methods as needed
}

export type KormirMethodNames = keyof KormirMethods;

export class KormirProxy {
  private worker: SharedWorker;
  private id: string;

  constructor(worker: SharedWorker, id: string) {
    this.worker = worker;
    this.id = id;
  }

  private sendMessage<K extends KormirMethodNames>(
    method: K,
    args: Parameters<KormirMethods[K]>,
  ): ReturnType<KormirMethods[K]> {
    return new Promise((resolve, reject) => {
      const messageHandler = (event: MessageEvent) => {
        if (event.data.id === this.id) {
          this.worker.port.removeEventListener("message", messageHandler);
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            resolve(event.data.result);
          }
        }
      };

      this.worker.port.addEventListener("message", messageHandler);
      this.worker.port.start(); // Start the port if not already started
      this.worker.port.postMessage({ id: this.id, method, args });
    }) as ReturnType<KormirMethods[K]>;
  }

  public static new(relays: string[]): Promise<KormirProxy> {
    const worker = new SharedWorker(
      new URL("../workers/kormir.ts", import.meta.url),
      { type: "module" },
    );
    const id = generateUniqueId(); // Implement this function to generate unique IDs.
    const proxy = new KormirProxy(worker, id);
    return proxy.sendMessage("new", [relays]).then(() => proxy); // Return the proxy after initialization
  }

  public get_public_key(): Promise<string> {
    return this.sendMessage("get_public_key", []);
  }

  public create_enum_event(
    event_id: string,
    outcomes: string[],
    event_maturity_epoch: number,
  ): Promise<string> {
    return this.sendMessage("create_enum_event", [
      event_id,
      outcomes,
      event_maturity_epoch,
    ]);
  }

  public sign_enum_event(id: number, outcome: string): Promise<string> {
    return this.sendMessage("sign_enum_event", [id, outcome]);
  }

  public list_events(): Promise<EventData[]> {
    return this.sendMessage("list_events", []);
  }

  // ... Add other methods as needed
}

// Utility function to generate unique IDs (implement accordingly)
function generateUniqueId(): string {
  // Implement a method to generate unique IDs, such as UUIDs or another method
  return Math.random().toString(36).substring(2, 15);
}
