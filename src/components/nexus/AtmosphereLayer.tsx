import { cn } from "@/lib/utils";

type Variant = "login" | "hero" | "empty" | "pipeline";

const VARIANTS: Record<
  Variant,
  { url: string; opacity: number; vignette?: string; pos: string; size?: string }
> = {
  login: {
    url: "/atmosphere/bg-login.jpg",
    opacity: 0.7,
    // Contain so the whole coastal scene (sky, terrain, radom, sea) is visible
    // and the radom doesn't dominate the frame.
    size: "contain",
    vignette:
      "radial-gradient(ellipse at center, transparent 35%, hsl(240 20% 4% / 0.25) 75%, hsl(240 20% 4% / 0.55) 100%)",
    pos: "center center",
  },
  hero: {
    url: "/atmosphere/bg-hero.jpg",
    opacity: 0.65,
    vignette:
      "radial-gradient(ellipse at center, transparent 40%, hsl(240 20% 4% / 0.28) 78%, hsl(240 20% 4% / 0.6) 100%)",
    pos: "center center",
  },
  empty: {
    url: "/atmosphere/bg-empty.jpg",
    opacity: 0.4,
    vignette:
      "linear-gradient(180deg, hsl(240 20% 4% / 0.45) 0%, transparent 25%, transparent 70%, hsl(240 20% 4% / 0.55) 100%)",
    pos: "center bottom",
  },
  pipeline: {
    url: "/atmosphere/bg-empty.jpg",
    opacity: 0.25,
    vignette:
      "linear-gradient(180deg, hsl(240 20% 4% / 0.35) 0%, transparent 20%, transparent 75%, hsl(240 20% 4% / 0.45) 100%)",
    pos: "center bottom",
  },
};

interface Props {
  variant: Variant;
  className?: string;
  /** When false, falls back to flat surface (no image layer at all). */
  enabled?: boolean;
  children?: React.ReactNode;
}

const AtmosphereLayer = ({ variant, className, enabled = true, children }: Props) => {
  const cfg = VARIANTS[variant];
  const hasAsset = enabled && !!cfg.url;

  return (
    <div className={cn("relative isolate", className)}>
      {hasAsset && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-no-repeat"
            style={{
              backgroundImage: `url("${cfg.url}")`,
              backgroundPosition: cfg.pos,
              backgroundSize: cfg.size ?? "cover",
              backgroundAttachment: "fixed",
              opacity: cfg.opacity,
            }}
          />
          {cfg.vignette && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 -z-10"
              style={{ backgroundImage: cfg.vignette }}
            />
          )}
        </>
      )}
      {children}
    </div>
  );
};

export default AtmosphereLayer;
