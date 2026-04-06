export default function MeshGradientBg() {
  return (
    <div 
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(at 40% 20%, hsla(280, 100%, 74%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 0%, hsla(189, 100%, 56%, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 50%, hsla(355, 100%, 93%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 50%, hsla(340, 100%, 76%, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, hsla(22, 100%, 77%, 0.3) 0px, transparent 50%),
          radial-gradient(at 80% 100%, hsla(242, 100%, 70%, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 0%, hsla(343, 100%, 76%, 0.3) 0px, transparent 50%)
        `,
        filter: "blur(40px)",
        zIndex: -1
      }}
    />
  );
}
