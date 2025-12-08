import Spinner from "../../atoms/feedback/Spinner";

export type SplashProps = {
  message?: string;
  className?: string;
};

/**
 * Splash/loading screen (no external assets).
 */
export function Splash({ message = "Loading AstraAI…", className = "" }: SplashProps) {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 text-slate-800 ${className}`}
    >
      <Spinner size={48} thickness={4} className="text-blue-500" />
      <div className="text-sm font-medium">{message}</div>
    </div>
  );
}

export default Splash;
