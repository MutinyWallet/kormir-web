import { createStore } from "solid-js/store";
import initKormir, { Kormir } from "@benthecarman/kormir-wasm";
import { ParentComponent, createContext, onMount, useContext } from "solid-js";

export type MegaStore = [
  {
    kormir?: Kormir;
  },
  {
    setup: () => void;
    hello: () => void;
  },
];

const MegaStoreContext = createContext<MegaStore>();

export const Provider: ParentComponent = (props) => {
  const [state, setState] = createStore({
    kormir: undefined as Kormir | undefined,
  });

  const actions = {
    async setup() {
      await initKormir();
      const kormir = await Kormir.new(["wss://nostr.mutinywallet.com"]);
      setState({ kormir });
    },
    async hello() {
      console.log("Hello");
    },
  };

  onMount(async () => {
    await actions.setup();
  });

  const store = [state, actions] as MegaStore;

  return (
    <MegaStoreContext.Provider value={store}>
      {props.children}
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
