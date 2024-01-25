import {
  createForm,
  minLength,
  required,
  SubmitHandler,
} from "@modular-forms/solid";
import { createSignal, For, Show } from "solid-js";

import { Button, SmallHeader, VStack } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { eify } from "~/utils";
import { InfoBox } from "~/components/InfoBox";
import { TextField } from "~/components/TextField";

type EventForm = {
  name: string;
  outcomes: {
    outcome: string;
  }[];
  event_maturity: string;
};

export function EventCreator(props: { onSave: () => Promise<void> }) {
  const [state] = useMegaStore();

  const [error, setError] = createSignal<Error>();

  const [creationForm, { Form, Field, FieldArray }] = createForm<EventForm>({
    initialValues: {
      name: "",
      outcomes: [
        {
          outcome: "",
        },
        {
          outcome: "",
        },
      ],
      event_maturity: new Date(Date.now() + 864e5).toISOString().split("T")[0], // default to a day from now,
    },
  });

  const handleSubmit: SubmitHandler<EventForm> = async (f: EventForm) => {
    setError(undefined);
    try {
      const outcomes = f.outcomes.map((o) => o.outcome);
      // Make sure outcomes are unique
      if (new Set(outcomes).size !== outcomes.length) {
        throw new Error("Outcomes must be unique");
      }

      const event_maturity = f.event_maturity;

      // Make sure event maturity is in the future
      if (new Date(event_maturity).getTime() < Date.now()) {
        throw new Error("Event maturity must be in the future");
      }

      // Convert to unix timestamp
      const event_maturity_timestamp = Math.floor(
        new Date(event_maturity).getTime() / 1000,
      );

      // create event
      const ann = await state.kormir?.create_enum_event(
        f.name,
        outcomes,
        event_maturity_timestamp,
      );
      console.log(ann);

      await props.onSave();
    } catch (e) {
      console.error(e);
      setError(eify(e));
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <VStack>
          <Field name="name" validate={[required("Name is required")]}>
            {(field, props) => (
              <TextField
                {...props}
                {...field}
                value={field.value}
                error={field.error}
                label="Event Name"
              />
            )}
          </Field>
          <div class="bg-neutral-900 flex flex-col gap-4 p-2 rounded">
            <SmallHeader>Possibilities</SmallHeader>
            <FieldArray
              name="outcomes"
              validate={[
                required("Outcomes are required"),
                minLength(2, "Must have more than one outcome"),
              ]} // todo validate outcomes have no empty string and are unique
            >
              {(fieldArray) => (
                <For each={fieldArray.items}>
                  {(_, index) => (
                    <div class="mb-2 flex flex-col gap-2 ">
                      <pre class="font-bold">
                        {"Outcome "}
                        {index() + 1}
                      </pre>
                      <Field
                        name={`outcomes.${index()}.outcome`}
                        validate={required("Cannot be an empty string")}
                      >
                        {(field, props) => (
                          <div class="flex gap-2">
                            <TextField
                              {...props}
                              {...field}
                              value={field.value}
                              error={field.error}
                              type="text"
                              required
                            />
                            {/* <Button
                              intent="red"
                              onClick={() =>
                                remove(creationForm, "outcomes", {
                                  at: index(),
                                })
                              }
                            >
                              x
                            </Button> */}
                          </div>
                        )}
                      </Field>
                    </div>
                  )}
                </For>
              )}
            </FieldArray>
          </div>
          <Field name="event_maturity">
            {(field, props) => (
              <TextField
                {...props}
                {...field}
                type="date"
                error={field.error}
                label="Event Date"
              />
            )}
          </Field>
          <Show when={error()}>
            <InfoBox accent="red">{error()?.message}</InfoBox>
          </Show>
          <Button
            loading={creationForm.submitting}
            disabled={
              !creationForm.dirty ||
              creationForm.submitting ||
              creationForm.invalid
            }
            intent="blue"
            type="submit"
          >
            Create
          </Button>
        </VStack>
      </Form>
    </>
  );
}
