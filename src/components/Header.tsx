import { A, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { useMegaStore } from "~/state/megaStore";

export function Header() {
  const navigate = useNavigate();
  const [state, _actions] = useMegaStore();
  if (state.setupStatus === "fresh") {
    navigate("/setup", { replace: true });
  }
  return (
    <header class="w-full border-b border-white flex justify-between p-4 items-center">
      <div class="flex flex-col gap-1">
        <A href="/" class="no-underline">
          <h1 class="text-4xl drop-shadow-text-glow font-bold">
            Superposition
          </h1>
        </A>
        <p>"It's an oracle thing!"</p>
      </div>
      <A href="/profile" class="no-underline">
        <div class="text-black bg-white w-8 h-8 rounded-full flex items-center justify-center">
          <Show when={state.profile?.image} fallback={":)"}>
            <img
              src={state.profile?.image}
              class="w-full h-full rounded-full"
            />
          </Show>
        </div>
      </A>
    </header>
  );
}
