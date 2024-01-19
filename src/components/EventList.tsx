/* @refresh reload */
import { EventData } from "@benthecarman/kormir-wasm";
import { A } from "@solidjs/router";
import { createResource, For, JSX, Show, Suspense } from "solid-js";

import { ButtonLink, InnerCard, VStack } from "~/components";
import { useMegaStore } from "~/state/megaStore";

type RefetchEventsType = (
  info?: unknown,
) => EventData[] | Promise<EventData[] | undefined> | null | undefined;

export function PreKeyValue(props: { key: string; children: JSX.Element }) {
  return (
    <pre class="text-neutral-400">
      <span class="text-white font-bold">{props.key}</span> {props.children}
    </pre>
  );
}

export function EventItem(props: {
  event: EventData;
  solo?: boolean;
  refetch?: RefetchEventsType;
}) {
  const [state, _actions] = useMegaStore();

  return (
    <InnerCard>
      <div class="flex flex-col gap-4">
        <A
          href={`/sup/${props.event.announcement_event_id}`}
          class="no-underline"
        >
          <h2 class="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#eeaeca] to-[#94bbe9]">
            {props.event.event_name}
          </h2>
        </A>
        <Show when={props.event.attestation != undefined}>
          <div class="bg-white/10 p-2 rounded flex flex-col gap-2">
            {/* <pre>{JSON.stringify(props.event, null, 2)}</pre> */}
            <p class="text-sm font-mono bg-white/10 px-1 rounded self-start">
              Observed
            </p>

            <p class="py-4 text-center font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-[#eeaeca] to-[#94bbe9]">
              {props.event.observed_outcome}
            </p>
            <PreKeyValue key="Attestation">
              <a
                class="underline break-all whitespace-pre-wrap"
                href={`https://njump.me/${props.event.attestation_event_id}`}
              >
                {props.event.attestation_event_id}
              </a>
            </PreKeyValue>
          </div>
        </Show>

        <div class="flex flex-col gap-2">
          <PreKeyValue key="Due">
            {new Date(props.event.event_maturity_epoch * 1000).toLocaleString()}
          </PreKeyValue>
          <PreKeyValue key="Announcement">
            <a
              class="underline break-all whitespace-pre-wrap"
              href={`https://njump.me/${props.event.announcement_event_id}`}
            >
              {props.event.announcement_event_id}
            </a>
          </PreKeyValue>
          <PreKeyValue key="Outcomes">
            {props.event.outcomes.join(" | ")}
          </PreKeyValue>
        </div>

        {/* <pre class="overflow-x-auto whitespace-pre-wrap break-all">
        {JSON.stringify(props.event, null, 2)}
      </pre> */}
        <Show
          when={
            props.event.attestation == undefined && !props.solo
            // TODO: have some sort of "confirm" state for observing early
            // && props.event.event_maturity_epoch < Date.now() / 1000
          }
        >
          <div class="self-start">
            <ButtonLink
              layout="xs"
              href={`/sup/${props.event.announcement_event_id}`}
            >
              Observe
            </ButtonLink>
          </div>
        </Show>
      </div>
    </InnerCard>
  );
}

export function EventList(props: { filter?: "ready" | "observed" | "notdue" }) {
  const [state, _actions] = useMegaStore();

  const getEvents = async () => {
    const events = await state.kormir?.list_events();
    if (events == undefined) {
      return [];
    }
    const filtered = events.filter((e) => {
      const due = e.event_maturity_epoch < Date.now() / 1000;
      const observed = e.attestation_event_id !== null;
      if (props.filter == "notdue") {
        return !due;
      } else if (props.filter == "ready") {
        return !observed && due;
      } else if (props.filter == "observed") {
        return observed;
      } else {
        return true;
      }
    });
    return filtered;
  };

  const [events, { refetch }] = createResource(getEvents);

  return (
    <>
      {/* By wrapping this in a suspense I don't cause the page to jump to the top */}
      <Suspense>
        <VStack>
          <For each={events()} fallback={<code>No Events found.</code>}>
            {(event) => <EventItem event={event} refetch={refetch} />}
          </For>
        </VStack>
      </Suspense>
    </>
  );
}
