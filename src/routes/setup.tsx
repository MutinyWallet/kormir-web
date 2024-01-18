import { Match, Switch, createSignal } from "solid-js";
import { Button } from "~/components";
import { useMegaStore } from "~/state/megaStore";

// type ImportForm = {
//   nsec: string;
// };

export function Setup() {
  const [_state, actions] = useMegaStore();

  const [_showNsecField, setShowNsecField] = createSignal(false);

  function anon() {
    actions.save();
  }

  function imp() {
    setShowNsecField(true);
  }

  // const [_importForm, { Form, Field }] = createForm<ImportForm>({
  //   initialValues: {
  //     nsec: "",
  //   },
  // });

  // const handleSubmit: SubmitHandler<ImportForm> = async (f: ImportForm) => {
  //   try {
  //     console.log(f.nsec);
  //     await actions.import(f.nsec);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  return (
    <>
      <main class="flex flex-col items-start w-full p-4 gap-8 max-w-[30rem]">
        <p>
          Welcome to <span class="font-bold">Superposition</span>. We're glad
          you're here. You will serve the role of an oracle.
        </p>
        <p>
          Do you want to make an anonymous nostr identity or import an existing
          nsec?
        </p>
        <div class="flex flex-col gap-4 mx-auto">
          <Switch>
            {/* <Match when={showNsecField()}>
              <Form onSubmit={handleSubmit} class="flex flex-col gap-2">
                <Field name="nsec" validate={[required("Nsec is required")]}>
                  {(field, props) => (
                    <TextField
                      {...props}
                      {...field}
                      value={field.value}
                      error={field.error}
                      label="Nostr Nsec"
                    />
                  )}
                </Field>
                <Button type="submit">Submit</Button>
              </Form>
            </Match> */}
            <Match when={true}>
              <Button onClick={anon}>Anonymous</Button>
              <Button disabled onClick={imp}>
                Import
              </Button>
            </Match>
          </Switch>
        </div>
      </main>
    </>
  );
}
