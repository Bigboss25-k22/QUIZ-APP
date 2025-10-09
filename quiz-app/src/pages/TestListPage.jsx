import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import { getTestList } from "@/lib/api/quiz";


function TestListPage() {
  const { data: tests, error, loading, callApi } = useApi(getTestList);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    callApi();
    // eslint-disable-next-line
  }, []);

  const handleStart = (testId) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/test/${testId}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-32 pb-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Danh sách bài Test</h1>
        {loading && (
          <div className="text-center text-lg text-primary font-semibold py-8">Đang tải...</div>
        )}
        {error && (
          <div className="text-center text-red-500 font-semibold py-8">{error}</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(tests) && tests.length > 0 ? (
            tests.map((test) => (
              <div
                key={test.id}
                className="bg-white/90 dark:bg-background/90 border border-border rounded-2xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl transition-shadow"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-1">{test.title}</h2>
                  {test.description && (
                    <div className="text-xs text-foreground/60 mb-2 line-clamp-2">{test.description}</div>
                  )}
                  <div className="text-sm text-foreground/70 mb-4">
                    <span className="font-medium">Thời gian:</span> {Math.round((test.time || 0) / 60)} phút
                  </div>
                </div>
                <button
                  onClick={() => handleStart(test.id)}
                  className="mt-4 w-full inline-block text-center rounded-full bg-primary text-primary-foreground font-semibold py-2 hover:bg-primary/80 transition-colors"
                >
                  Bắt đầu
                </button>
              </div>
            ))
          ) : !loading && !error ? (
            <div className="col-span-full text-center text-foreground/60 py-8">Không có bài test nào.</div>
          ) : null}
        </div>
    </div>
  );
}

export default TestListPage;
