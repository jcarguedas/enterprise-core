type IconProps = {
  className?: string;
};

function IconBase({
  children,
  className,
}: IconProps & {
  children: React.ReactNode;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      focusable="false"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
}

export function DashboardIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M4 13h6V4H4v9Z" />
      <path d="M14 20h6V11h-6v9Z" />
      <path d="M4 20h6v-3H4v3Z" />
      <path d="M14 7h6V4h-6v3Z" />
    </IconBase>
  );
}

export function UsersIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M16 19v-1.5A3.5 3.5 0 0 0 12.5 14h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <path d="M10 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M20 19v-1.2a3 3 0 0 0-2.2-2.9" />
      <path d="M15.5 4.2a3 3 0 0 1 0 5.6" />
    </IconBase>
  );
}

export function RolesIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M12 3 5 6v5c0 4.4 2.8 8.4 7 10 4.2-1.6 7-5.6 7-10V6l-7-3Z" />
      <path d="m9.5 12 1.7 1.7 3.5-3.7" />
    </IconBase>
  );
}

export function SystemIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 13.5v-7Z" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
      <path d="M8 9h.01" />
      <path d="M11 9h5" />
      <path d="M8 12h.01" />
      <path d="M11 12h3" />
    </IconBase>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
      <path d="m18.5 14.3.3 2.5-2.2 1.3-2.1-1a7 7 0 0 1-1.5.6L12.3 20H9.7L9 17.7a7 7 0 0 1-1.5-.6l-2.1 1-2.2-1.3.3-2.5a6.9 6.9 0 0 1-.8-1.3L.7 11.5V9l2-1.5c.2-.5.5-.9.8-1.3l-.3-2.5 2.2-1.3 2.1 1c.5-.2 1-.5 1.5-.6L9.7.5h2.6l.7 2.3c.5.1 1 .3 1.5.6l2.1-1 2.2 1.3-.3 2.5c.3.4.6.8.8 1.3l2 1.5v2.5l-2 1.5c-.2.5-.5.9-.8 1.3Z" />
    </IconBase>
  );
}

export function EyeIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
    </IconBase>
  );
}

export function EyeOffIcon({ className }: IconProps) {
  return (
    <IconBase className={className}>
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.5 5.5A9.3 9.3 0 0 1 12 5c6 0 9.5 7 9.5 7a14 14 0 0 1-2.8 3.7" />
      <path d="M6.6 6.7C4 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.5 0 2.8-.4 4-1" />
    </IconBase>
  );
}
