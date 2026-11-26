/** Remounts on every navigation, so each page settles in the same way. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-in">{children}</div>;
}
