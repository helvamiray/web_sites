import { useEffect, useRef, useState } from "react";
import { IconBrandInstagram, IconBrandLinkedin, IconMail, IconPhone } from "@tabler/icons-react";
import { useMagneticButton } from "@/hooks/useMagneticButton";
import { VEGA_CONTACTS, VEGA_SOCIAL_HREF } from "@/utils/contacts";
import { contactService } from "@/lib/contactService";
import {
  ContactChannelsDock,
  type ContactChannelItem,
} from "@/components/ui/ContactChannelsDock";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const TEL_HREF = `tel:${VEGA_CONTACTS.phone.replace(/\s/g, "")}`;
const MAIL_HREF = `mailto:${VEGA_CONTACTS.email}`;

const CONTACT_CHANNEL_ITEMS: readonly ContactChannelItem[] = [
  {
    channel: "instagram",
    label: "Instagram",
    href: VEGA_SOCIAL_HREF.instagram,
    Icon: IconBrandInstagram,
  },
  {
    channel: "linkedin",
    label: "LinkedIn",
    href: VEGA_SOCIAL_HREF.linkedin,
    Icon: IconBrandLinkedin,
  },
  { channel: "phone", label: "Telefon", href: TEL_HREF, Icon: IconPhone },
  { channel: "mail", label: "E-posta", href: MAIL_HREF, Icon: IconMail },
];

const VALUE_CARDS = [
  {
    title: "24 Saat İçinde Dönüş",
    body: "Uzman mühendis ekibi",
  },
  {
    title: "3B Dijital İkiz Desteği",
    body: "Gerçekçi proje ön izleme",
  },
  {
    title: "Premium Marka Çözümleri",
    body: "Daikin • Mitsubishi • Samsung",
  },
] as const;

const QuoteSimple = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const btnRef = useMagneticButton(0.22);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--lux-mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--lux-my", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    contactService.create({
      type: "contact",
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim() || undefined,
    });
    const subject = encodeURIComponent(`Teklif Talebi — ${form.name}`);
    const body = encodeURIComponent(
      `Ad Soyad: ${form.name}\nE-posta: ${form.email}\n\nMesaj:\n${form.message}`,
    );
    window.location.href = `mailto:${VEGA_CONTACTS.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="iletisim"
      className="contact-section lux-contact lux-contact--showroom"
      aria-label="İletişim"
    >
      <div className="lux-contact__layer lux-contact__layer--wash" aria-hidden />
      <div className="lux-contact__layer lux-contact__layer--glow-a" aria-hidden />
      <div className="lux-contact__layer lux-contact__layer--glow-b" aria-hidden />
      <div className="lux-contact__layer lux-contact__layer--grid" aria-hidden />
      <div className="lux-contact__layer lux-contact__layer--noise" aria-hidden />
      <div className="lux-contact__layer lux-contact__layer--mouse" aria-hidden />

      <div className="lux-contact__grid lux-contact__grid--showroom">
        <div className="lux-contact__col lux-contact__col--left lux-contact__col--studio">
          <span className="lux-contact__eyebrow lux-contact__eyebrow--showroom">İletişim</span>
          <h2 className="lux-contact__heading lux-contact__heading--showroom">
            <span className="lux-contact__heading-primary">Projenizi</span>
            <span className="lux-contact__heading-accent lux-contact__heading-accent--showroom">
              Birlikte Tasarlayalım
            </span>
          </h2>
          <p className="lux-contact__lead lux-contact__lead--showroom">
            HVAC ve enerji mühendisliğinde bir sonraki adım için ekibimizle doğrudan görüşün —
            teknik netlik, hızlı geri dönüş.
          </p>

          <ul className="lux-contact__value-cards">
            {VALUE_CARDS.map((card) => (
              <li key={card.title} className="lux-contact__value-card">
                <span className="lux-contact__value-card-title">{card.title}</span>
                <span className="lux-contact__value-card-body">{card.body}</span>
              </li>
            ))}
          </ul>

          <ContactChannelsDock
            items={CONTACT_CHANNEL_ITEMS}
            caption="Engineering Contact Channel"
            className="lux-contact-dock--studio"
          />
        </div>

        <div className="lux-contact__col lux-contact__col--form">
          {submitted ? (
            <div className="lux-contact-form-shell lux-contact-form-shell--showroom">
              <div className="lux-contact-form-inner lux-contact-form-inner--showroom">
                <div className="lux-contact-success lux-contact-success--showroom border-0 bg-transparent p-0 shadow-none">
                  <span className="lux-contact-success__mark" aria-hidden>
                    ✓
                  </span>
                  <h3 className="lux-contact-success__title">Mesajınız iletildi</h3>
                  <p className="lux-contact__lead lux-contact__lead--showroom lux-contact-success__text mb-0 max-w-md text-center mx-auto text-sm">
                    En kısa sürede sizinle iletişime geçeceğiz.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="lux-contact-form-shell lux-contact-form-shell--showroom">
              <div className="lux-contact-form-inner lux-contact-form-inner--showroom">
                <div className="lux-contact-form-fields">
                  <input
                    type="text"
                    placeholder="Ad Soyad *"
                    value={form.name}
                    onChange={update("name")}
                    required
                    aria-label="Ad Soyad"
                    className="lux-contact-input lux-contact-input--showroom"
                  />
                  <input
                    type="email"
                    placeholder="E-posta *"
                    value={form.email}
                    onChange={update("email")}
                    required
                    aria-label="E-posta"
                    className="lux-contact-input lux-contact-input--showroom"
                  />
                  <textarea
                    placeholder="Mesajınız"
                    value={form.message}
                    onChange={update("message")}
                    rows={4}
                    aria-label="Mesajınız"
                    className="lux-contact-textarea lux-contact-textarea--showroom"
                  />
                  <button
                    ref={btnRef}
                    type="button"
                    className="lux-contact-submit lux-contact-submit--showroom quote-send-btn"
                    onClick={handleSubmit}
                    aria-label="Mühendislik görüşmesi başlat"
                  >
                    <span className="lux-contact-submit__shine" aria-hidden />
                    <span className="lux-contact-submit__label">Mühendislik Görüşmesi Başlat</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuoteSimple;
