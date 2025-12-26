// AuthLayout is intentionally minimal: routing controls which pages use it.
// Previously it forced theme changes or toggled header visibility via context; that
// approach was unnecessary and has been removed. Keep this as a simple wrapper
// in case auth-specific layout logic is needed later.

export function AuthLayout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
