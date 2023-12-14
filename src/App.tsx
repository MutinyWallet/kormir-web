// @refresh reload
import { Title } from "@solidjs/meta";
import { Suspense } from "solid-js";

import { Router } from "~/router";

export default function App() {
  return (
    <Suspense>
      <Title>Kormir</Title>
      <Router />
    </Suspense>
  );
}
