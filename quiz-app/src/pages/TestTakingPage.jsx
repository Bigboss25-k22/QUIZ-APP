import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import { useApi } from "@/hooks/useApi";
import { getTestDetails, submitTest } from "@/lib/api/quiz";
import { useAuth } from "@/contexts/AuthContext";
import Notification from "@/components/Notification";

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

const TestTakingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: testData, loading, error, callApi } = useApi(getTestDetails);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const timerRef = useRef();

  useEffect(() => {
    callApi(id).then((data) => {
      if (data && data.testDTO && data.testDTO.time) setTimeLeft(data.testDTO.time);
    });
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    if (timeLeft <= 0 || isSubmitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmit(); // Auto submit when time runs out
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isSubmitted]);

  const handleSubmit = async () => {
    if (submitting || !user || isSubmitted) return;
    
    setSubmitting(true);
    try {
      // Debug user info
      console.log('Current user:', user);
      console.log('User ID:', user.id);
      
      // Kiểm tra user có id không
      const userId = user.id || user.userId || user.user_id || 1; // Fallback to 1 for testing
      
      console.log('Using userId:', userId);
      
      // Chuyển đổi answers thành format backend yêu cầu (A/B/C/D)
      const responses = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: parseInt(questionId),
        selectedOption: selectedOption.replace('option', '') // "optionA" => "A"
      }));

      console.log('Submitting data:', {
        testId: parseInt(id),
        userId: userId,
        responses: responses
      });

      const response = await submitTest(parseInt(id), userId, responses);
      setResult(response);
      setIsSubmitted(true);
      clearInterval(timerRef.current);
      setNotification({
        type: 'success',
        message: `Bạn đã hoàn thành bài test! Điểm số: ${response.correctAnswers}/${response.totalQuestions} (${response.percentage.toFixed(1)}%)`
      });
    } catch (error) {
      console.error('Submit error:', error);
      setNotification({
        type: 'error',
        message: 'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!testData) return null;

  const testInfo = testData.testDTO || {};
  const questions = testData.questions || [];
  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  // Nếu không có questions, hiển thị thông báo
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 pt-28">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Không có câu hỏi nào</h2>
            <p className="text-gray-600 mb-4">Bài test này chưa có câu hỏi hoặc dữ liệu không tải được.</p>
            <div className="text-left bg-gray-100 p-4 rounded-lg">
              <pre>{JSON.stringify(testData, null, 2)}</pre>
            </div>
            <button 
              onClick={() => navigate('/tests')}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSelect = (qid, optKey) => {
    if (!isSubmitted) {
      setAnswers((prev) => ({ ...prev, [qid]: optKey }));
    }
  };

  const getOptionClassName = (question, optionKey) => {
    if (!isSubmitted) {
      return answers[question.id] === optionKey 
        ? "bg-primary/10 border-primary text-primary ring-1 ring-primary/20" 
        : "border-border hover:bg-primary/5 hover:border-primary/40 dark:hover:border-primary/50";
    }

    // Sau khi submit, hiển thị kết quả
    const userAnswer = answers[question.id];
    const correctAnswer = question.correctOption;
    const isCorrectOption = optionKey.charAt(optionKey.length - 1) === correctAnswer; // A, B, C, D
    const isUserChoice = userAnswer === optionKey;

    if (isCorrectOption) {
      return 'bg-green-500 text-white border-green-500'; // Đáp án đúng - màu xanh lá
    } else if (isUserChoice && !isCorrectOption) {
      return 'bg-red-500 text-white border-red-500'; // Đáp án sai mà user chọn - màu đỏ
    } else {
      return 'bg-gray-100 text-gray-500 border-gray-300'; // Các đáp án khác
    }
  };

  const getQuestionResultIcon = (question) => {
    if (!isSubmitted) return null;
    
    const userAnswer = answers[question.id];
    const correctAnswer = question.correctOption;
    const isCorrect = userAnswer && userAnswer.charAt(userAnswer.length - 1) === correctAnswer;

    return isCorrect ? (
      <CheckCircle className="w-6 h-6 text-green-500 ml-2" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500 ml-2" />
    );
  };

  return (
    <div className="max-w-5xl mx-auto pt-28 pb-10 px-4 flex flex-col gap-6">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Result Summary */}
        {isSubmitted && result && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Kết quả bài test</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-4 rounded-lg text-center border border-blue-200 dark:border-blue-700">
                <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{result.correctAnswers}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Số câu đúng</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center border border-gray-200 dark:border-gray-600">
                <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{result.totalQuestions}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Tổng số câu</div>
              </div>
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-lg text-center border border-green-200 dark:border-green-700">
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {result.percentage.toFixed(1)}%
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">Tỷ lệ đúng</div>
              </div>
            </div>
          </div>
        )}

        {/* Highlighted Test Header */}
        <div className="w-full rounded-2xl shadow-xl border-2 border-primary/30 ring-1 ring-primary/20 overflow-hidden bg-white/95 dark:bg-background/95">
          <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent px-6 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow">📝</div>
              <div>
                <div className="text-xl font-bold leading-tight">{testInfo.title || testInfo.name || "Bài kiểm tra"}</div>
                {testInfo.description ? (
                  <div className="text-sm text-foreground/70 line-clamp-1">{testInfo.description}</div>
                ) : null}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {!isSubmitted && (
                <span className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-300/50 text-red-700 dark:text-red-300 font-medium">
                  ⏱️ {formatTime(timeLeft)}
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-medium">
                📚 {testInfo.time ? `${Math.floor(testInfo.time / 60)} phút` : "Không giới hạn"}
              </span>
            </div>
          </div>
        </div>

        {/* Body: Sidebar + Question */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar: List of question numbers in a rectangle box */}
          <div className="md:w-1/5 w-full md:sticky md:top-24">
            <div className="bg-white/95 dark:bg-background/95 rounded-xl shadow-lg border-2 border-primary/20 ring-1 ring-primary/10 p-4">
              <div className="grid grid-cols-5 gap-2 mb-4 w-full">
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrent(idx)}
                    className={`aspect-square min-w-0 w-full rounded-lg border-2 flex items-center justify-center font-bold transition-all duration-150
                    ${current === idx ? "bg-primary text-primary-foreground border-primary shadow" : answers[q.id] ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600 text-emerald-700 dark:text-emerald-300" : "bg-background border-border text-foreground/70 hover:border-primary/40 dark:hover:border-primary/50"}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || isSubmitted}
                className="w-full mt-2 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/80 transition-colors shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Đang nộp bài...' : isSubmitted ? 'Đã nộp bài' : 'Nộp bài'}
              </button>
            </div>
          </div>
          {/* Main content: Current question */}
          <div className="flex-1 bg-white/95 dark:bg-background/95 rounded-2xl shadow-xl border-2 border-primary/20 ring-1 ring-primary/10 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-semibold flex items-center">
                Câu {current + 1} / {questions.length}
                {getQuestionResultIcon(questions[current])}
              </div>
              {!isSubmitted && (
                <div className="flex items-center gap-2">
                  <span className="text-primary font-bold text-lg animate-pulse" key={timeLeft}>⏰ {formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
            <div className="mb-4">
              <div className="font-medium mb-2">
                {questions[current]?.questionText || "Không có nội dung câu hỏi"}
              </div>
              <div className="space-y-2">
                {["optionA", "optionB", "optionC", "optionD"].map((optKey) => (
                  questions[current]?.[optKey] ? (
                    <label key={optKey} className={`block px-4 py-2 rounded-lg border cursor-pointer transition-all duration-150 ${getOptionClassName(questions[current], optKey)}`}
                    >
                      <input
                        type="radio"
                        name={`q_${questions[current].id}`}
                        value={optKey}
                        checked={answers[questions[current].id] === optKey}
                        onChange={() => handleSelect(questions[current].id, optKey)}
                        disabled={isSubmitted}
                        className="mr-2"
                      />
                      {optKey.charAt(optKey.length - 1)}. {questions[current][optKey]}
                    </label>
                  ) : null
                ))}
              </div>
            </div>
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="px-4 py-2 rounded-full bg-border text-foreground/70 font-semibold disabled:opacity-50"
              >
                Câu trước
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                disabled={current === questions.length - 1}
                className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50"
              >
                Câu tiếp
              </button>
            </div>
          </div>
        </div>

        {/* Back to Tests Button */}
        {isSubmitted && (
          <div className="text-center">
            <button
              onClick={() => navigate('/tests')}
              className="bg-gray-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-600"
            >
              Quay lại danh sách test
            </button>
          </div>
        )}
    </div>
  );
};

export default TestTakingPage;
