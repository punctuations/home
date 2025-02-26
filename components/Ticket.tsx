export default function Ticket(props: {
  name: string;
  color: string;
  desc: string;
  date: string;
  number: string;
}) {
  return (
    <div
      className="ticket relative aspect-[4/11] w-32 overflow-hidden"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Blue top section */}
      <div
        style={{ backgroundColor: props.color }}
        className="h-[27%] p-3 !border-t-0"
      >
        <div className="flex flex-col items-center text-white text-[0.75em]">
          <p className="text-lg tracking-widest">
            <sup>k</sup>
            {props.number}
          </p>
          <div className="mt-1 text-lg tracking-wider">Admit One</div>
          <div className="text-[0.75em] mt-0.5">void if detachted</div>
        </div>
      </div>

      {/* White bottom section */}
      <div className="h-[73%] p-3 flex flex-col items-center justify-between border-t-2 border-[#0a0a0a] border-dashed">
        <div className="w-full h-full flex flex-col items-center [writing-mode:vertical-lr]">
          <div style={{ color: props.color }} className="text-md rotate-180">
            Project Highlight
          </div>
          <div className="text-xl tracking-wider rotate-180">{props.name}</div>
          <div className="text-sm text-gray-700 rotate-180">{props.desc}</div>
          <div className="justify-self-end rotate-180 mx-2">{props.date}</div>
        </div>

        <div className="text-center">
          <p style={{ color: props.color }} className="text-lg tracking-widest">
            <sup className="text-black">k</sup>
            {props.number}
          </p>
        </div>
      </div>
    </div>
  );
}
