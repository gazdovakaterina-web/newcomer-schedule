import { redirect } from "next/navigation";
import { sampleSchedule } from "@/lib/sample-data";

export default function Home() {
  redirect(`/schedule/${sampleSchedule.slug}`);
}
