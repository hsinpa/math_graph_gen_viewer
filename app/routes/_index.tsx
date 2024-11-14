import type { MetaFunction } from "@remix-run/node";
import { MathQuizComponent } from "~/component/math_quiz_component";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex p-2">
      <MathQuizComponent></MathQuizComponent>

    </div>
  );
}

