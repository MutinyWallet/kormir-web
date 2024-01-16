import { createStore } from "solid-js/store";
import { KormirProxy } from "./kormirProxy";
import {
  ParentComponent,
  Show,
  createContext,
  onMount,
  useContext,
} from "solid-js";
import { useNavigate } from "@solidjs/router";
import init, { Kormir } from "@benthecarman/kormir-wasm";

export type MegaStore = [
  {
    kormir?: KormirProxy;
    setupStatus: "fresh" | "imported" | "saved";
  },
  {
    setup: () => void;
    save: () => void;
    import: (nsec: string) => Promise<void>;
  },
];

const MegaStoreContext = createContext<MegaStore>();

export const Provider: ParentComponent = (props) => {
  const navigate = useNavigate();
  const [state, setState] = createStore({
    kormir: undefined as KormirProxy | undefined,
    setupStatus:
      (localStorage.getItem("setupStatus") as "fresh" | "imported" | "saved") ||
      "fresh",
  });

  const actions = {
    async setup() {
      const kormir = await KormirProxy.new(["wss://nostr.mutinywallet.com"]);
      setState({ kormir });
    },
    save() {
      localStorage.setItem("setupStatus", "saved");
      setState({ setupStatus: "saved" });
      navigate("/");
    },
    async import(nsec: string) {
      try {
        console.log("importing nsec: ", nsec);
        const _kor = await init();
        await Kormir.restore(nsec);
        // await state.kormir?.restore(nsec);
        // const pubkey = await state.kormir?.get_public_key();
        // console.log("pubkey: ", pubkey);
        setState({ setupStatus: "imported" });
        localStorage.setItem("setupStatus", "imported");
        // window.location.href = "/";
      } catch (e) {
        console.error(e);
      }
    },
  };

  onMount(async () => {
    await actions.setup();
  });

  const store = [state, actions] as MegaStore;

  return (
    <MegaStoreContext.Provider value={store}>
      <Show when={state.kormir !== undefined}>{props.children}</Show>
    </MegaStoreContext.Provider>
  );
};

export function useMegaStore() {
  // This is a trick to narrow the typescript types: https://docs.solidjs.com/references/api-reference/component-apis/createContext
  const context = useContext(MegaStoreContext);
  if (!context) {
    throw new Error("useMegaStore: cannot find a MegaStoreContext");
  }
  return context;
}
