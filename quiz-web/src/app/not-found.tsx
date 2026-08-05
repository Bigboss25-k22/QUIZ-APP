import { ButtonLink } from "@/ui/components/button";
import { Surface } from "@/ui/components/surface";
import { Eyebrow, PageTitle } from "@/ui/components/typography";

export default function NotFound() {
  return <main className="assessment-grid grid min-h-screen place-items-center p-6"><Surface className="max-w-md text-center" padding="lg"><Eyebrow>404</Eyebrow><PageTitle className="mt-3 text-4xl">Không tìm thấy trang.</PageTitle><p className="mt-3 leading-7 text-slate">Đường dẫn này không còn tồn tại hoặc đã được thay đổi.</p><ButtonLink className="mt-6" href="/">Về trang chủ</ButtonLink></Surface></main>;
}
