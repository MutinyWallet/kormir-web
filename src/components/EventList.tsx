import { Collapsible } from "@kobalte/core";
import { EventData } from "@benthecarman/kormir-wasm";
import { createResource, For, Show, Suspense } from "solid-js";

import { Button, InnerCard, VStack } from "~/components";
import { useMegaStore } from "~/state/megaStore";

type RefetchEventsType = (
  info?: unknown,
) => EventData[] | Promise<EventData[] | undefined> | null | undefined;

function EventItem(props: { event: EventData; refetch: RefetchEventsType }) {
  const [state, _actions] = useMegaStore();
  const handleSignEvent = async () => {
    const result = prompt("Choose one of: " + props.event.outcomes.join(", "));

    if (state.kormir == undefined) {
      return;
    }

    await state.kormir?.sign_enum_event(0, result || "");
  };

  return (
    <Collapsible.Root>
      <Collapsible.Trigger class="w-full">
        <h2 class="truncate rounded bg-neutral-200 px-4 py-2 text-start font-mono text-lg text-black">
          {">"} {props.event.event_id}
        </h2>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <VStack>
          <pre class="overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(props.event, null, 2)}
          </pre>
          <Show when={props.event.attestation == undefined}>
            <Button intent="green" layout="xs" onClick={handleSignEvent}>
              Close
            </Button>
          </Show>
        </VStack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function EventList() {
  const [state, _actions] = useMegaStore();

  const getEvents = async () => {
    const events = (await state.kormir?.list_events()) as EventData[];
    console.log("events: ", events);
    return events;
  };

  const [events, { refetch }] = createResource(getEvents);

  return (
    <>
      <InnerCard title="Events">
        <pre>{state.kormir?.get_public_key()}</pre>
        {/* By wrapping this in a suspense I don't cause the page to jump to the top */}
        <Suspense>
          <VStack>
            <For each={events()} fallback={<code>No Events found.</code>}>
              {(event) => <EventItem event={event} refetch={refetch} />}
            </For>
          </VStack>
        </Suspense>
        <Button layout="small" onClick={refetch}>
          Refresh
        </Button>
      </InnerCard>
    </>
  );
}
