import { A } from "@solidjs/router";
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
          <h2 class="text-2xl font-bold">Ready for Observation</h2>
          <Show when={state.kormir !== undefined}>
            <Suspense>
              <EventList />
            </Suspense>
          </Show>
        </div>
        {/* <h2 class="text-2xl font-bold">Waiting for due date</h2> */}
        <A href="/superposition/85f87112bd53449f1e98c40a93fa8f1e5e5a5b1ad38a688234ba47fd154d9247">
          test
        </A>
      </main>
    </>
  );
}
