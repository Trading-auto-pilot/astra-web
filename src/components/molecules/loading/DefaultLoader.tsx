import Spinner from "../../atoms/feedback/Spinner";

export function DefaultLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Spinner />
    </div>
  );
}

export default DefaultLoader;
