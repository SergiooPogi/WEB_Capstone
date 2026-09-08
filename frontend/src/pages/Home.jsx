import { Hero } from "../components/Hero";
import { ProblemStatement } from "../components/ProblemStatement";
import { Solution } from "../components/Solution";
import { HowItWorks } from "../components/HowItWorks";
import { TargetUsers } from "../components/TargetUsers";
import { Impact } from "../components/Impact";

export function Home() {
  return (
    <main>
      <Hero />
      <ProblemStatement />
      <Solution />
      <HowItWorks />
      <TargetUsers />
      <Impact />
    </main>
  );
}
