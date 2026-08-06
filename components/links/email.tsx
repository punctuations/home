"use client";

export const Email = () => {
  return (
    <div
      style={{
        width: "240px",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.07), 0 12px 32px rgba(0,0,0,0.12)",
        fontFamily: "monospace",
        overflow: "hidden",
      }}
      className="reciept"
    >
      <div
        style={{
          padding: "12px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 14H0V2H16V14ZM12 6H10V8H6V6H4V8H6V10H10V8H12V6H14V4H12V6ZM2 6H4V4H2V6Z"
            fill="black"
          />
        </svg>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <a
            href="mailto:contact@thew.sh"
            aria-hidden="true"
            tabIndex={-1}
            style={{
              position: "absolute",
              width: "1px",
              height: "1px",
              overflow: "hidden",
              clipPath: "inset(50%)",
              whiteSpace: "nowrap",
            }}
          >
            contact@thew.sh
          </a>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "bold",
              color: "#0f172a",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            m [at] thew [dot] sh
          </span>
        </div>
      </div>
    </div>
  );
};
