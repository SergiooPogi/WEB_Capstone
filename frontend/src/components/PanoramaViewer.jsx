import { useEffect, useRef, useState } from "react";

/**
 * PanoramaViewer — interactive 360° equirectangular panorama viewer.
 * Uses @photo-sphere-viewer/core loaded dynamically to avoid SSR issues.
 */
export function PanoramaViewer({ src, height = "420px" }) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    let cancelled = false;

    async function init() {
      try {
        // Destroy previous instance
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }

        const { Viewer } = await import("@photo-sphere-viewer/core");

        // Import CSS dynamically
        await import("@photo-sphere-viewer/core/index.css");

        if (cancelled || !containerRef.current) return;

        viewerRef.current = new Viewer({
          container: containerRef.current,
          panorama: src,
          defaultZoomLvl: 50,
          touchmoveTwoFingers: false,
          mousewheelCtrlKey: false,
          navbar: ["zoom", "fullscreen"],
          loadingImg: null,
          loadingTxt: "Loading 360° view...",
        });

        viewerRef.current.addEventListener("ready", () => {
          if (!cancelled) setLoading(false);
        });

        viewerRef.current.addEventListener("panorama-loaded", () => {
          if (!cancelled) setLoading(false);
        });

      } catch (err) {
        console.error("PanoramaViewer error:", err);
        if (!cancelled) {
          setError("Failed to load 360° viewer.");
          setLoading(false);
        }
      }
    }

    init();

    return () => {
      cancelled = true;
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [src]);

  if (error) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center bg-gray-900 rounded-xl text-white text-sm"
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ position: "relative", height, borderRadius: "12px", overflow: "hidden" }}>
      {loading && (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            background: "#0d1f5c", borderRadius: "12px",
          }}
        >
          <div style={{
            width: 48, height: 48, border: "4px solid #F5C400",
            borderTopColor: "transparent", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", marginBottom: 12,
          }} />
          <p style={{ color: "#FFDC5F", fontSize: 13 }}>Loading 360° view…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}
