import { Surface } from "@/ui/components/surface";
import { Eyebrow, PageTitle } from "@/ui/components/typography";

const faqs = [
  ["Làm cách nào để bắt đầu?", "Tạo tài khoản, chọn một đề trong kho đề và bắt đầu phiên luyện tập đầu tiên."],
  ["Kết quả được lưu ở đâu?", "Sau khi nộp bài, kết quả được lưu trong mục Kết quả của tài khoản."],
  ["Tôi có thể đăng nhập bằng Google không?", "Chức năng đăng nhập Google đang được chuẩn bị và sẽ hiển thị khi hệ thống xác thực hỗ trợ."],
];

export default function HelpPage() {
  return <main className="mx-auto max-w-4xl px-5 py-16"><Eyebrow>Trợ giúp</Eyebrow><PageTitle className="mt-3 max-w-3xl text-4xl leading-tight sm:text-5xl">Mọi thứ bạn cần để bắt đầu.</PageTitle><div className="mt-10 space-y-3">{faqs.map(([question, answer]) => <Surface key={question} padding="none" tone="flat"><details className="group p-6"><summary className="cursor-pointer list-none font-display font-bold marker:hidden">{question}<span className="float-right text-cobalt transition-transform group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-3 max-w-2xl leading-7 text-slate">{answer}</p></details></Surface>)}</div></main>;
}
