import { useNavigate } from "@solidjs/router";
import { Header } from "~/components";
import { EventCreator } from "~/components/EventCreator";

export function New() {
  const navigate = useNavigate();

  const onSave = async () => {
    navigate("/");
  };

  return (
    <>
      <Header />
      <main>
        <h2 class="text-2xl font-bold my-4">New</h2>
        <EventCreator onSave={onSave} />
      </main>
    </>
  );
}
