import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";

import { useActorsMap } from "@/hooks/useActorsMap";
import { ActorsMap } from "@/components/map/ActorsMap";
import { Button } from "@/components/ui/button";
import { useSessionContext } from "@/contexts/SessionContext";
import { cn } from "@/lib/utils";

const ActorsMapPage = () => {
  const navigate = useNavigate();
  const { isAdmin } = useSessionContext();
  const { data, loading, error, refresh } = useActorsMap();

  const SUB_VIEWS = [
    { key: "collection", label: "My Collection", to: "/actors/collection" },
    { key: "database", label: "Database", to: "/actors/database" },
    ...(isAdmin
      ? [{ key: "archived", label: "Archived", to: "/actors/archived" }]
      : []),
    { key: "map", label: "Map", to: "/actors/map" },
  ];

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      <div className="px-8 pt-8 pb-0 shrink-0">
        <div className="flex items-start justify-between mb-4 gap-4">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.18em] text-foreground-muted mb-1">
              Actors / Map
            </div>
            <h1 className="text-2xl font-semibold text-foreground">Actors</h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="h-8">
              <RefreshCw className={cn("w-3.5 h-3.5 mr-1.5", loading && "animate-spin")} />
              Refresh
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => navigate("/actors/new")}
              className="h-8"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add actor
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-border -mx-1 px-1 overflow-x-auto">
          {SUB_VIEWS.map((v) => {
            const active = v.key === "map";
            return (
              <button
                key={v.key}
                onClick={() => navigate(v.to)}
                className={cn(
                  "relative px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                  "after:absolute after:left-2 after:right-2 after:-bottom-px after:h-[2px] after:rounded-t",
                  active
                    ? "text-foreground after:bg-accent-teal"
                    : "text-foreground-secondary hover:text-foreground after:bg-transparent",
                )}
              >
                {v.label}
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-3 text-body-sm text-destructive">Error: {error.message}</div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0 p-4">
        <ActorsMap actors={data} viewStorageKey="actorsMapView" />
      </div>
    </div>
  );
};

export default ActorsMapPage;
