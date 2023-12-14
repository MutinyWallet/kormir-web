import initKormir, { Kormir } from "@benthecarman/kormir-wasm";
import { createResource } from "solid-js";

async function createKormir() {
  await initKormir();
  return await Kormir.new(["wss://nostr.mutinywallet.com"]);
}

export function Home() {
  const [kormir] = createResource(async () => createKormir());

  return (
    <main class="flex flex-col gap-4 items-center w-full max-w-[40rem] mx-auto">
      <h1 class="font-mono text-4xl drop-shadow-text-glow p-8 font-bold">
        Kormir
      </h1>
      <pre>{kormir.latest?.get_public_key()}</pre>
      <div class="h-4" />
    </main>
  );
}
