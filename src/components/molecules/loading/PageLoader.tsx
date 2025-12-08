import Spinner from "../../atoms/feedback/Spinner";

export function PageLoader() {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <div className="relative">
        <Spinner size={74} thickness={4} className="text-blue-200" />
        <Spinner size={74} thickness={4} className="absolute left-0 top-0 text-blue-500" />
      </div>
    </div>
  );
}

export default PageLoader;
