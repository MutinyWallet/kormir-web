import { Show, Suspense } from "solid-js";
import { ButtonLink, EventList, Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";

export function Home() {
  const [state, _actions] = useMegaStore();

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-8 max-w-[30rem]">
        <ButtonLink href="/new">+ New Superposition</ButtonLink>
        {/* <pre>{pubKey()}</pre> */}
        <div class="flex flex-col gap-4">
          <h2 class="text-2xl font-bold">Waiting for Due Date</h2>
          <Show when={state.kormir !== undefined}>
            <Suspense>
              <EventList filter="notdue" />
            </Suspense>
          </Show>
          <h2 class="text-2xl font-bold">Ready for Observation</h2>
          <Show when={state.kormir !== undefined}>
            <Suspense>
              <EventList filter="ready" />
            </Suspense>
          </Show>
          <h2 class="text-2xl font-bold">Observed</h2>
          <Show when={state.kormir !== undefined}>
            <Suspense>
              <EventList filter="observed" />
            </Suspense>
          </Show>
        </div>
      </main>
    </>
  );
}
