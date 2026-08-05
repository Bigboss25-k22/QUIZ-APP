import { AuthGate } from "@/features/auth/ui/auth-gate";
import { ExamSession } from "@/features/quiz/ui/exam-session";

export default function QuizTakingPage() {
  return <AuthGate><ExamSession/></AuthGate>;
}
