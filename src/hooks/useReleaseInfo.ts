import { useEffect, useState } from "react";

type ReleaseInfo = {
  version?: string | null;
  lastUpdate?: string | null;
  microservice?: string | null;
  note?: string[] | null;
};

export function useRelease() {
  const [release, setRelease] = useState<ReleaseInfo | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch("/release.json")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted) setRelease(data);
      })
      .catch(() => {
        if (isMounted) setRelease(null);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return release;
}
