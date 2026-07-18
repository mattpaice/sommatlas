import { AtlasExperience } from "@/components/atlas/atlas-experience";
import { corpus } from "@/lib/corpus";

export default function Home() {
  return <AtlasExperience {...corpus} />;
}
