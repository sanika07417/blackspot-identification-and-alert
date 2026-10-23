import { cn } from "@/lib/utils";

/**
 * Full-bleed photographic backdrop shared by the login and registration pages.
 * The image sits behind a navy scrim so the form card always keeps contrast,
 * whatever the photo underneath looks like.
 */
export function AuthShell({ image, imageAlt, overlay, children }) {
  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <img
        src={image}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1920}
        height={1088}
        className="absolute inset-0 size-full object-cover"
      />
      <div className={cn("absolute inset-0", overlay)} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="road-stripe" />
      </div>
      <span className="sr-only">{imageAlt}</span>
      <div className="relative flex w-full justify-center">{children}</div>
    </div>
  );
}
