import { Collapsible } from "@kobalte/core";
import { EventData } from "@benthecarman/kormir-wasm";
import { createResource, createSignal, For, Show, Suspense } from "solid-js";

import { Button, InnerCard, SimpleDialog, VStack } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { EventCreator } from "~/components/EventCreator";

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

    props.refetch();
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
    return (await state.kormir?.list_events()) as EventData[];
  };

  const [events, { refetch }] = createResource(getEvents);

  const [dialogOpen, setDialogOpen] = createSignal(false);

  const onClick = async () => {
    setDialogOpen(true);
  };

  const onSave = async () => {
    setDialogOpen(false);
    await refetch();
  }

  return (
    <>
      <InnerCard title="Events">
        <SimpleDialog open={dialogOpen()} title="New Event">
          <EventCreator onSave={onSave} />
        </SimpleDialog>
        <Button onClick={onClick}>New Event</Button>
        {/* By wrapping this in a suspense I don't cause the page to jump to the top */}
        <Suspense>
          <VStack>
            <For each={events()} fallback={<code>No Events found.</code>}>
              {(event) => <EventItem event={event} refetch={refetch} />}
            </For>
          </VStack>
        </Suspense>
      </InnerCard>
    </>
  );
}
