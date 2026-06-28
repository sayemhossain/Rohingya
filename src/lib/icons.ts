// An icon value can be either a react-icons name (e.g. "HiHeart") or an
// uploaded image/SVG URL. This detects the uploaded-asset case.
export function isIconImage(value?: string): boolean {
  if (!value) return false;
  return (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/") ||
    value.startsWith("data:")
  );
}
