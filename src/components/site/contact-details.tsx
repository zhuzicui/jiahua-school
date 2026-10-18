import { Building07, Mail01, MarkerPin02, MessageChatCircle, Phone, Train } from "@untitledui/icons";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { getSettings } from "@/lib/content";
import { T } from "./localized";

export const mapUrl = (address: string, place: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${address}`)}`;

/** Address, room, email, phone, WeChat. The same settings feed the footer. */
export const ContactDetails = ({ locale, compact }: { locale: Locale; compact?: boolean }) => {
    const t = getDictionary(locale).contact;
    const { contact } = getSettings();
    const rows = [
        {
            icon: MarkerPin02,
            label: t.address,
            content: (
                <>
                    {contact.place}, {contact.address}
                    <br />
                    <a href={mapUrl(contact.address, contact.place)} target="_blank" rel="noopener noreferrer" className="link">
                        {t.map}
                    </a>
                </>
            ),
        },
        { icon: Train, label: t.metro, content: <T value={contact.metro} locale={locale} /> },
        { icon: Building07, label: t.rooms, content: <T value={contact.room} locale={locale} /> },
        ...(compact
            ? []
            : [
                  {
                      icon: Mail01,
                      label: t.email,
                      content: (
                          <a href={`mailto:${contact.email}`} className="link">
                              {contact.email}
                          </a>
                      ),
                  },
                  {
                      icon: Phone,
                      label: t.phone,
                      content: (
                          <span className="flex flex-wrap gap-x-4">
                              {contact.phones.map((p) => (
                                  <a key={p} href={`tel:${p.replace(/\D/g, "")}`} className="link tabular-nums">
                                      {p}
                                  </a>
                              ))}
                          </span>
                      ),
                  },
                  { icon: MessageChatCircle, label: t.wechat, content: <span className="font-medium text-primary">{contact.wechat}</span> },
              ]),
    ];

    return (
        <dl className="flex flex-col gap-5">
            {rows.map(({ icon: Icon, label, content }) => (
                <div key={label} className="flex gap-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-secondary text-fg-brand-primary">
                        <Icon aria-hidden="true" className="size-5" />
                    </span>
                    <div>
                        <dt className="text-sm font-semibold text-primary">{label}</dt>
                        <dd className="mt-0.5 text-md text-tertiary">{content}</dd>
                    </div>
                </div>
            ))}
        </dl>
    );
};
