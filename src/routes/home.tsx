import { Show, Suspense } from "solid-js";
import { EventList } from "~/components";
import { useMegaStore } from "~/state/megaStore";

export function Home() {
  const [state, _actions] = useMegaStore();

  return (
    <main class="flex flex-col gap-4 items-center w-full max-w-[40rem] mx-auto">
      <h1 class="font-mono text-4xl drop-shadow-text-glow p-8 font-bold">
        Kormir
      </h1>
      <pre>{state.kormir?.get_public_key()}</pre>
      <Show when={state.kormir !== undefined}>
        <Suspense>
          <EventList />
        </Suspense>
      </Show>
      <div class="h-4" />
    </main>
  );
}
