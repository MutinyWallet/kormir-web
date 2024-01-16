// @refresh reload
import { Route, Routes } from "@solidjs/router";
import { Match, Switch } from "solid-js";

import { Home, NotFound, New, Profile, SuperPosition, Setup } from "~/routes";
import { Provider as MegaStoreProvider } from "~/state/megaStore";

export function Router() {
  return (
    <Switch>
      <Match when={true}>
        <MegaStoreProvider>
          <Routes>
            <Route path="/" component={Home} />
            <Route path="/setup" component={Setup} />
            <Route path="/new" component={New} />
            <Route path="/profile" component={Profile} />
            <Route path="/sup/:id" component={SuperPosition} />
            <Route path="/*all" component={NotFound} />
          </Routes>
        </MegaStoreProvider>
      </Match>
    </Switch>
  );
}
