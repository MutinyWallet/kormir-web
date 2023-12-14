// @refresh reload
import { Route, Routes } from "@solidjs/router";
import { Match, Switch } from "solid-js";

import { Home, NotFound } from "~/routes";

export function Router() {
  return (
    <Switch>
      <Match when={true}>
        <Routes>
          <Route path="/" component={Home} />
          <Route path="/*all" component={NotFound} />
        </Routes>
      </Match>
    </Switch>
  );
}
