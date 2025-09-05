import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/services/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) {
    redirect(`/${user?.role}`);
  } else {
    redirect("/auth");
  }
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Button>Click me</Button>
    </div>
  );
}
