import { useParams } from "@solidjs/router";
import {
  For,
  Match,
  Show,
  Suspense,
  Switch,
  createResource,
  createSignal,
} from "solid-js";
import { Button, EventItem, Header, InnerCard } from "~/components";
import { useMegaStore } from "~/state/megaStore";

export function SuperPosition() {
  const [state, _actions] = useMegaStore();

  const params = useParams();

  // console.log(params.id);

  // const [pubKey] = createResource(async () => state.kormir?.get_public_key());

  const getEventById = async () => {
    const events = await state.kormir?.list_events();
    console.log(events);
    // return events![0];
    const singleEvent = events?.filter(
      (e) => e.announcement_event_id === params.id,
    );
    if (singleEvent?.length === 1) {
      return singleEvent[0];
    } else {
      throw new Error("Event not found");
    }
  };

  const [event, { refetch }] = createResource(params.id, getEventById);

  const [choice, setChoice] = createSignal<string | undefined>(undefined);
  const [loading, setLoading] = createSignal(false);

  const handleSignEvent = async () => {
    setLoading(true);
    if (!event()) {
      return;
    }
    // const result = prompt("Choose one of: " + event()?.outcomes.join(", "));

    if (state.kormir == undefined) {
      return;
    }

    if (choice() === undefined) {
      return;
    }

    // Make sure choice is one of the valid outcomes
    const observedValue = event()?.outcomes.find((o) => o === choice());

    if (observedValue === undefined) {
      return;
    }

    if (typeof event()?.id !== "number") {
      return;
    }

    try {
      await state.kormir?.sign_enum_event(event()?.id as number, observedValue);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
    refetch();
  };

  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-8 max-w-[30rem]">
        <Suspense>
          <Show when={event()}>
            <EventItem event={event()!} solo />
            <Switch>
              {/* <Match
                when={(event()?.event_maturity_epoch || 0) > Date.now() / 1000}
              >
                <p>
                  This event isn't due yet. Come back on{" "}
                  {new Date(
                    (event()?.event_maturity_epoch || 0) * 1000,
                  ).toLocaleDateString()}{" "}
                  to observe it.
                </p>
              </Match> */}
              <Match when={event()?.attestation === null}>
                <div class="flex flex-col gap-4">
                  <h2 class="text-2xl font-bold">Observe!</h2>
                  <Switch>
                    <Match when={choice() === undefined}>
                      <p>
                        Tell the world what happened. Do your best to tell the
                        truth. If you're not sure, it's better to say nothing
                        and let the superposition expire.
                      </p>
                      <For each={event()?.outcomes}>
                        {(outcome) => (
                          <Button onClick={() => setChoice(outcome)}>
                            {outcome}
                          </Button>
                        )}
                      </For>
                    </Match>
                    <Match when={!!choice()}>
                      <p>
                        You chose {`"${choice()}"`}. Are you absolutely certain?
                        A lot is riding on this! Clicking "Observe" will sign
                        this superposition with your private key and broadcast
                        it to the nostr network.
                      </p>
                      <button
                        class="underline"
                        onClick={() => setChoice(undefined)}
                      >
                        ~Show Choices Again~
                      </button>
                      <InnerCard title={event()?.event_name}>
                        <p class="py-4 text-center font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#eeaeca] to-[#94bbe9]">
                          {choice()}
                        </p>
                        <Button
                          onClick={handleSignEvent}
                          loading={loading()}
                          disabled={loading()}
                        >
                          Finalize
                        </Button>
                      </InnerCard>
                    </Match>
                  </Switch>
                </div>
              </Match>
            </Switch>
          </Show>
        </Suspense>
      </main>
    </>
  );
}
