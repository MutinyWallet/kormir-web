// import NDK from "@nostr-dev-kit/ndk";
import { createResource } from "solid-js";
import { Button, Header, PreKeyValue } from "~/components";
import { useMegaStore } from "~/state/megaStore";
import { nip19 } from "nostr-tools";

// async function fetchProfile(hexpub: string) {
//   const ndk = new NDK({
//     explicitRelayUrls: [
//       "wss://nostr.mutinywallet.com",
//       "wss://relay.snort.social",
//       "wss://nos.lol",
//       "wss://nostr.fmt.wiz.biz",
//       "wss://relay.damus.io",
//       "wss://relay.primal.net",
//       "wss://nostr.wine",
//       "wss://relay.nostr.band",
//       "wss://nostr.zbd.gg",
//       "wss://relay.nos.social",
//     ],
//     enableOutboxModel: false,
//   });

//   await ndk.connect(6000);

//   console.log("connected");

//   const profileEvent = await ndk.fetchEvent({
//     kinds: [0],
//     authors: [hexpub],
//     limit: 1,
//   });

//   console.log(profileEvent);

//   return "hey";
// }

export function Profile() {
  const [state, _actions] = useMegaStore();

  const [pubKey] = createResource(async () => {
    const hexpub = await state.kormir?.get_public_key();
    // return hexpub;
    if (hexpub) {
      const npub = nip19.npubEncode(hexpub.toString());
      return { hexpub, npub };
    }
  });

  // const [user] = createResource(() => pubKey()?.hexpub, fetchProfile);

  async function signOut() {
    return new Promise((resolve, reject) => {
      // clear the kormir -> oracle indexeddb
      const DBDeleteRequest = window.indexedDB.deleteDatabase("kormir");

      DBDeleteRequest.onerror = (_event) => {
        console.error("Error deleting database.");
        reject();
      };

      DBDeleteRequest.onsuccess = (_event) => {
        console.log("Database deleted successfully");

        resolve(undefined);
      };

      localStorage.removeItem("setupStatus");

      // redirect to home
      window.location.href = "/";
    });
  }
  return (
    <>
      <Header />
      <main class="flex flex-col items-start w-full p-4 gap-4 max-w-[30rem]">
        <h2 class="text-2xl font-semibold">{state.profile?.name}</h2>
        <PreKeyValue key="npub">
          <a
            class="whitespace-pre-wrap break-all"
            href={`https://njump.me/${state.profile?.npub}`}
          >
            {state.profile?.npub}
          </a>
        </PreKeyValue>
        <Button onClick={signOut}>Sign Out</Button>
      </main>
    </>
  );
}
