import type { ComponentType, CSSProperties } from "react";
import clsx from "clsx";

interface ContactDockIconProps {
  className?: string;
  stroke?: number | string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
}

export type ContactChannelId = "instagram" | "linkedin" | "phone" | "mail";

export interface ContactChannelItem {
  label: string;
  href: string;
  channel: ContactChannelId;
  Icon: ComponentType<ContactDockIconProps>;
}

interface ContactChannelsDockProps {
  items: readonly ContactChannelItem[];
  className?: string;
  /** Küçük alt başlık (ör. “Engineering Contact Channel”) */
  caption?: string;
}

const iconStroke = 1.4;

/**
 * Premium floating dock — tek cam kabuk, kanal bazlı ikon vurgusu (Arc / Apple dock hissi).
 */
export function ContactChannelsDock({ items, className, caption }: ContactChannelsDockProps) {
  return (
    <div className="lux-contact-dock-bar__wrap">
      <nav
        className={clsx("lux-contact-dock lux-contact-dock--showroom lux-contact-dock-bar", className)}
        aria-label="İletişim kanalları"
      >
        <svg className="lux-contact-dock-bar__defs" width={0} height={0} aria-hidden focusable="false">
          <defs>
            <linearGradient
              id="lux-contact-ig-gradient"
              x1="0%"
              y1="100%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#e8a163" />
              <stop offset="45%" stopColor="#d34f8f" />
              <stop offset="100%" stopColor="#7c5cdb" />
            </linearGradient>
            <linearGradient id="lux-contact-li-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ec8f5" />
              <stop offset="100%" stopColor="#3a8fd4" />
            </linearGradient>
          </defs>
        </svg>

        <div className="lux-contact-dock-bar__shell">
          <ul className="lux-contact-dock-bar__list">
            {items.map(({ label, href, channel, Icon }) => {
              const external = href.startsWith("http");
              const strokeStyle =
                channel === "instagram"
                  ? { stroke: "url(#lux-contact-ig-gradient)" as const }
                  : channel === "linkedin"
                    ? { stroke: "url(#lux-contact-li-gradient)" as const }
                    : undefined;

              return (
                <li key={label}>
                  <a
                    href={href}
                    data-channel={channel}
                    className="lux-contact-dock-bar__link"
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <Icon
                      className={clsx(
                        "lux-contact-dock-bar__icon",
                        channel === "phone" && "lux-contact-dock-bar__icon--mono",
                        channel === "mail" && "lux-contact-dock-bar__icon--mono",
                      )}
                      stroke={iconStroke}
                      style={strokeStyle}
                      aria-hidden
                    />
                    <span className="lux-contact-dock-bar__text">{label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
      {caption ? (
        <p className="lux-contact-dock-bar__caption">{caption}</p>
      ) : null}
    </div>
  );
}
