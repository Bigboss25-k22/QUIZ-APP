import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useApi } from "@/hooks/useApi";
import { getTestList } from "@/lib/api/quiz";


function TestListPage() {
  const [page, setPage] = useState(0);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  const { data: response, error, loading, callApi } = useApi(() => 
    getTestList(page, 10, category || null, debouncedSearch || null)
  );
  
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    callApi();
    // eslint-disable-next-line
  }, [page, category, debouncedSearch]);

  const handleStart = (testId) => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(`/test/${testId}`);
    }
  };

  const handlePrevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (response && !response.last) {
      setPage(page + 1);
    }
  };

  const tests = response?.content || [];
  const totalPages = response?.totalPages || 0;
  const currentPage = response?.currentPage ?? 0;

  return (
    <div className="max-w-6xl mx-auto pt-32 pb-10 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Danh sách bài Test</h1>
        
        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên bài test..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(0);
              }}
              className="w-full px-4 py-2 border border-border rounded-lg bg-white dark:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Tất cả danh mục</option>
              <option value="Math">Toán học</option>
              <option value="Science">Khoa học</option>
              <option value="English">Tiếng Anh</option>
              <option value="History">Lịch sử</option>
              <option value="General">Tổng hợp</option>
            </select>
          </div>
        </div>

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
                  {test.category && (
                    <span className="inline-block px-2 py-1 text-xs bg-primary/10 text-primary rounded-full mb-2">
                      {test.category}
                    </span>
                  )}
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

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
            >
              Trước
            </button>
            <span className="text-sm text-foreground/70">
              Trang {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={response?.last}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/80 transition-colors"
            >
              Sau
            </button>
          </div>
        )}
    </div>
  );
}

export default TestListPage;
