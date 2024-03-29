// @refresh reload
import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";

import { Router } from "~/router";

export default function App() {
  return (
    <Suspense>
      <Title>Superposition</Title>
      <Router />
      <div class="h-8" />
    </Suspense>
  );
}
