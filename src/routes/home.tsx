import initKormir, {Kormir} from "@benthecarman/kormir-wasm";
import {createResource, Show, Suspense} from "solid-js";
import {EventList} from "~/components";

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
            <Suspense>
                {/*<Show when={kormir.latest}>*/}
                    <pre>{kormir()?.get_public_key()}</pre>
                    <EventList kormir={kormir()}/>
                {/*</Show>*/}
            </Suspense>
            <div class="h-4"/>
        </main>
    );
}
