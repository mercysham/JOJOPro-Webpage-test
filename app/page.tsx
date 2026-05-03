import { ParticleBackground } from "./components/particle-background";
import { AnimatedFolder } from "./components/animated-folder";

export default function Home() {
  const projects = [
    { id: "1", title: "Project Alpha", image: "/globe.svg" },
    { id: "2", title: "Project Beta", image: "/window.svg" },
    { id: "3", title: "Project Gamma", image: "/file.svg" },
  ];

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8">
      <ParticleBackground />
      <div className="relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8">JOJOPro</h1>
        <AnimatedFolder title="Projects" projects={projects} />
      </div>
    </main>
  );
}
