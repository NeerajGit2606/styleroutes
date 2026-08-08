import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#12181c",
          border: "1.5px solid #c6a15a",
          borderRadius: "50%",
          color: "#c6a15a",
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        SR
      </div>
    ),
    { ...size }
  );
}
