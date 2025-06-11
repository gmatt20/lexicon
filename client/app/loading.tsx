import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <Spinner
      role="status"
      className="h-screen w-screen flex items-center justify-center"
      size="lg"
      color="primary"
      label="Loading..."
    />
  );
}
