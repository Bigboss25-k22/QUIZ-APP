import { Mail, MapPin, Phone } from "lucide-react";
import { Surface } from "@/ui/components/surface";
import { Eyebrow, PageTitle } from "@/ui/components/typography";

const contacts = [
  { icon: Mail, label: "Email", value: "quizapp@example.com", href: "mailto:quizapp@example.com" },
  { icon: Phone, label: "Hotline", value: "0123 456 789", href: "tel:0123456789" },
  { icon: MapPin, label: "Địa chỉ", value: "123 Đường ABC, TP. Hồ Chí Minh" },
];

export default function ContactPage() {
  return <main className="assessment-grid min-h-[calc(100vh-4rem)] px-5 py-16"><Surface className="mx-auto max-w-2xl" padding="lg"><Eyebrow>Liên hệ</Eyebrow><PageTitle className="mt-3 text-4xl">Cần hỗ trợ?</PageTitle><p className="mt-4 max-w-lg leading-7 text-slate">Gửi câu hỏi hoặc góp ý về trải nghiệm luyện tập. Chúng tôi sẽ phản hồi qua kênh bạn chọn.</p><dl className="mt-8 divide-y divide-line">{contacts.map(({ icon: Icon, label, value, href }) => <div key={label} className="flex gap-4 py-5 first:pt-0 last:pb-0"><span className="grid size-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-cobalt-soft text-cobalt"><Icon size={18} aria-hidden="true"/></span><div><dt className="font-mono text-[0.68rem] uppercase tracking-wider text-slate">{label}</dt><dd className="mt-1 font-semibold">{href ? <a className="hover:text-cobalt hover:underline" href={href}>{value}</a> : value}</dd></div></div>)}</dl></Surface></main>;
}
