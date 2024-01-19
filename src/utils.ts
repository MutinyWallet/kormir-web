import NDK from "@nostr-dev-kit/ndk";
import { nip19 } from "nostr-tools";

/// Sometimes we catch an error as `unknown` so this turns it into an Error.
export function eify(e: unknown): Error {
  if (e instanceof Error) {
    return e;
  } else if (typeof e === "string") {
    return new Error(e);
  } else {
    return new Error("Unknown error");
  }
}

export type Profile = {
  image?: string;
  name: string;
  npub: string;
};

export async function fetchProfile(
  ndk: NDK,
  npub: string,
): Promise<Profile | undefined> {
  const hexpub = nip19.decode(npub);
  console.log(hexpub.data.toString());
  const profileEvent = await ndk.fetchEvent({
    kinds: [0],
    authors: [hexpub.data.toString()],
    limit: 1,
  });

  if (!profileEvent) {
    return;
  }

  try {
    const content = JSON.parse(profileEvent.content);

    const profile = {
      npub: npub,
      image: content.picture,
      name: content.name,
    };

    return profile;
  } catch (e) {
    console.error(e);
  }
}
