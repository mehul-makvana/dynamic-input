import React from "react";
import DynamicInput from "./components/DynamicInput";

const tags = ["React", "Next.js", "Tailwind", "JavaScript", "CSS"];

const App = () => {
  return (
    <div>
      <DynamicInput tags={tags} />
    </div>
  );
};

export default App;
