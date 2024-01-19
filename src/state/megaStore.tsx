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
import NDK from "@nostr-dev-kit/ndk";
import { Profile, fetchProfile } from "~/utils";
import { nip19 } from "nostr-tools";

export type MegaStore = [
  {
    kormir?: KormirProxy;
    setupStatus: "fresh" | "imported" | "saved";
    ndk: NDK;
    profile?: Profile;
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

    ndk: new NDK({
      explicitRelayUrls: [
        "wss://nostr.mutinywallet.com",
        "wss://relay.snort.social",
        "wss://nos.lol",
        "wss://nostr.fmt.wiz.biz",
        "wss://relay.damus.io",
        "wss://relay.primal.net",
        "wss://nostr.wine",
        "wss://relay.nostr.band",
        "wss://nostr.zbd.gg",
        "wss://relay.nos.social",
      ],
      enableOutboxModel: false,
    }),
    profile: undefined as Profile | undefined,
  });

  const actions = {
    async setup() {
      try {
        const kormir = await KormirProxy.new(["wss://nostr.mutinywallet.com"]);
        const pubkey = await kormir?.get_public_key();
        console.log("pubkey: ", pubkey);

        if (pubkey) {
          const npub = nip19.npubEncode(pubkey.toString());

          // ndk stuff
          await state.ndk.connect(6000);
          console.log("connected");
          const profile = await fetchProfile(state.ndk, npub);
          if (profile) {
            setState({ profile });
          } else {
            console.log("no profile found");
            setState({ profile: { npub, name: "anon" } });
          }
        }
        setState({ kormir });
      } catch (e) {
        console.error(e);
      }
    },
    save() {
      localStorage.setItem("setupStatus", "saved");
      setState({ setupStatus: "saved" });
      navigate("/");
    },
    async import(nsec: string) {
      try {
        console.log("importing nsec: ", nsec);
        // const _kor = await init();
        await state.kormir?.restore(nsec);
        setState({ setupStatus: "imported" });
        localStorage.setItem("setupStatus", "imported");
        await actions.setup();
        navigate("/");
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
