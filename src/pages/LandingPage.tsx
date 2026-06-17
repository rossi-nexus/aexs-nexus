import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CONTACT_EMAIL = "contact@test.aexs.no";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-background">
      {/* Background image — vessel in fog, clearly visible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: 'url("/atmosphere/bg-hero.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.7,
        }}
      />
      {/* Soft edge vignette only — no flat overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, hsl(240 20% 4% / 0.55) 0%, transparent 25%, transparent 70%, hsl(240 20% 4% / 0.7) 100%)",
        }}
      />

      {/* Content */}
      <main className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="relative max-w-3xl">
          <p className="mb-6 text-label uppercase tracking-[0.2em] text-foreground-muted">
            ÆXS · NEXUS
          </p>
          <h1 className="bg-gradient-to-r from-[#4A7AB5] via-[#4FADA0] to-[#4DAF6F] bg-clip-text text-4xl font-semibold leading-tight text-transparent sm:text-5xl md:text-6xl">
            Enable Access. Leverage Excess.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-body text-foreground">
            Discovery and verification for security, defence, preparedness, and
            critical-infrastructure procurement.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="bg-gradient-to-r from-[#4A7AB5] via-[#4FADA0] to-[#4DAF6F] text-white hover:opacity-90"
              onClick={() => navigate("/login")}
            >
              Sign in
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
            >
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=NEXUS%20pilot%20access%20request`}
              >
                Request access
              </a>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-10 px-6 pb-5 text-center">
        <p className="text-[11px] uppercase tracking-[0.15em] text-foreground-muted/80">
          ÆXS · {CONTACT_EMAIL} · Restricted access — pilot evaluation by invitation
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
