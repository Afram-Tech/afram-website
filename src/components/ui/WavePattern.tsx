import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * The Afram Exchange banner backdrop, ported from the platform's
 * ListingUnlockBanner: a soft teal glow, the isometric diamond lattice
 * fading in from one side, and the Afram mark as a faint watermark.
 *
 * The lattice covers one side only (`side`), fading out before the middle,
 * so the container reads as a surface with a corner detail, not a pattern.
 *
 * Decorative only: hidden from assistive tech and never takes clicks. The
 * parent needs `relative overflow-hidden`, and the content `relative`.
 */
const MARK = [
  "M38.5809 24.2615C38.576 24.2692 38.5707 24.2762 38.5658 24.2836C37.8288 25.3701 36.8229 26.2603 35.6439 26.8578H35.6018L35.6103 26.875C35.3555 27.0026 35.0922 27.1168 34.822 27.216C34.8049 27.2223 34.788 27.2283 34.7709 27.2346C32.7216 27.9573 30.528 27.7761 28.6771 26.8578C27.8335 26.4394 27.061 25.8681 26.4063 25.1594C26.4035 25.1563 26.4004 25.1528 26.3972 25.1496C26.1505 24.8776 25.7061 24.2836 25.7061 24.2836C25.4877 23.9664 25.2897 23.6289 25.1159 23.2721L20.9543 14.7492L17.7597 8.20611C17.6258 7.87596 17.4695 7.55632 17.2932 7.2507C17.2929 7.25 17.2929 7.2493 17.2922 7.24895C16.0487 5.09386 13.799 3.59276 11.1847 3.38738C11.1847 3.38738 11.1847 3.38738 11.1847 3.38703C11.9309 2.29179 12.9501 1.39702 14.1449 0.801908C14.1536 0.797702 14.1624 0.793146 14.1708 0.788941C14.3541 0.698167 14.542 0.614403 14.734 0.538349C14.747 0.533442 14.7596 0.528185 14.7729 0.523278C15.6908 0.169296 16.6417 1.46989e-05 17.5806 1.46989e-05C18.7743 1.46989e-05 19.9484 0.273388 21.0125 0.788941C21.3879 0.970138 21.7492 1.18183 22.093 1.4226C22.0955 1.42436 22.0986 1.42611 22.1011 1.42856C22.8423 1.95673 23.4865 2.61248 24.0021 3.3632C24.0021 3.3632 24.4601 4.03822 24.6403 4.40692L28.8005 12.9274L31.9926 19.4649C32.1205 19.7782 32.2688 20.081 32.4353 20.3715C33.6791 22.547 35.9464 24.0621 38.5809 24.2615Z",
  "M23.886 24.9901C23.3077 25.8386 22.5216 26.534 21.6016 27.004C20.7643 27.4322 19.8159 27.6737 18.8108 27.6737C16.5663 27.6737 14.6033 26.4691 13.5322 24.6715L13.0941 23.7785L12.6238 22.8203L10.1266 17.7307C10.0285 17.4934 9.91562 17.2642 9.78945 17.0434C8.81442 15.3348 7.0431 14.1404 4.98089 13.9648C5.55077 13.0952 6.33794 12.3806 7.26496 11.8977C8.1047 11.4603 9.05905 11.2132 10.0712 11.2132C12.3511 11.2132 14.3376 12.4668 15.3796 14.3226L15.6768 14.9286C15.6768 14.9293 15.6771 14.93 15.6778 14.9307L16.192 15.9772L18.7256 21.1415C18.849 21.4569 18.9979 21.7598 19.17 22.0471C20.1506 23.686 21.8806 24.8247 23.886 24.9901Z",
  "M11.3413 24.8087C11.2817 24.896 11.2201 24.9815 11.1559 25.0653C10.6071 25.754 9.9282 26.3347 9.1568 26.77C8.15969 27.3336 7.00837 27.655 5.7817 27.655C5.04324 27.655 4.33212 27.5386 3.66551 27.3227C3.27999 27.198 2.90988 27.0402 2.55765 26.8527C1.15819 26.0459 0.175102 24.5718 0.00652228 22.8808C-0.020114 22.6147 0.034911 22.3456 0.170195 22.115C0.170896 22.1139 0.171597 22.1125 0.172298 22.1115C0.832248 20.9819 2.05892 20.1835 3.46118 20.2224C7.34062 20.331 6.10799 23.3041 9.82096 24.4831C10.3081 24.6381 10.8121 24.7649 11.3413 24.8087Z",
];

export function WavePattern({
  side = "right",
  className,
}: {
  /** Which side the lattice fades in from (and where the mark sits). */
  side?: "right" | "left";
  className?: string;
}) {
  const id = `iso-${useId().replace(/:/g, "")}`;
  const right = side === "right";
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -top-1/2 h-[200%] w-[46%] rounded-full bg-brand-300 opacity-[0.16] blur-[70px]",
          right ? "-right-[6%]" : "-left-[6%]",
        )}
      />
      <svg
        className={cn(
          "absolute inset-y-0 h-full w-[42%]",
          right
            ? "right-0 [mask-image:linear-gradient(90deg,transparent,black_70%)]"
            : "left-0 [mask-image:linear-gradient(270deg,transparent,black_70%)]",
        )}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={id} width="40" height="23.09" patternUnits="userSpaceOnUse">
            <path
              d="M0 11.545 L20 0 L40 11.545 L20 23.09 Z M20 0 V23.09"
              fill="none"
              stroke="var(--color-brand-600)"
              strokeOpacity="0.11"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <svg
        className={cn(
          "absolute -bottom-[18%] h-[75%] w-auto opacity-[0.06]",
          right ? "right-[3%]" : "left-[3%]",
        )}
        viewBox="0 0 38.581 27.6793"
        fill="none"
      >
        {MARK.map((d) => (
          <path key={d.slice(0, 12)} d={d} fill="var(--color-brand-600)" />
        ))}
      </svg>
    </div>
  );
}
