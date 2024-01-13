import { Show, createResource } from "solid-js";
import { Header } from "~/components";
import { useMegaStore } from "~/state/megaStore";

export function Profile() {
  const [state, _actions] = useMegaStore();

  const [pubKey] = createResource(async () => state.kormir?.get_public_key());
  return (
    <>
      <Header />
      <main>
        {/* <Suspense fallback={<>loading...</>}> */}
        <Show when={pubKey()}>
          <pre>{pubKey()}</pre>
        </Show>
        {/* </Suspense> */}
      </main>
    </>
  );
}
