import { OrbitingCircles } from "./OrbitingCircles";
// I have added this portion from the OrbitalCircles effect code section at the top from the  Magic UI website. 
export function Frameworks() {
  const circle1 = [
    "cplusplus", "css3", "git", "html5", "javascript", "microsoft",
    "react", "tailwindcss", "vitejs"
  ];

  const circle2 = [
    "gsap", "spline", "bootstrap", "java", "chatgpt", "deepseek",
    "lightroom", "capcut", "canva"
  ];

  const circle3 = [
    "python", "nextjs", "figma", "Photoshop"
  ];

  return (
    <div className="relative overflow-hidden flex h-[28rem] w-full items-center justify-center">
      {/* Outer Circle (Biggest) */}
      <OrbitingCircles iconSize={38} radius={180} duration={24}>
        {circle1.map((skill, idx) => (
          <Icon key={`circle1-${idx}`} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>

      {/* Middle Circle */}
      <OrbitingCircles iconSize={32} radius={125} duration={20} reverse>
        {circle2.map((skill, idx) => (
          <Icon key={`circle2-${idx}`} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>

      {/* Inner Circle */}
      <OrbitingCircles iconSize={26} radius={75} duration={16}>
        {circle3.map((skill, idx) => (
          <Icon key={`circle3-${idx}`} src={`assets/logos/${skill}.svg`} />
        ))}
      </OrbitingCircles>
    </div>
  );
}

const Icon = ({ src }) => (
  <img
    src={src}
    alt=""
    className="w-[2.25rem] h-[2.25rem] rounded-sm duration-200 hover:scale-110"
  />
);
