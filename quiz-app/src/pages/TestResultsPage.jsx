import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTestResultsByUser } from '@/lib/api/quiz';
import Notification from '@/components/Notification';
import { Clock, CheckCircle, Trophy, Calendar } from 'lucide-react';

const TestResultsPage = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user) {
      fetchResults();
    }
  }, [user]);

  const fetchResults = async () => {
    try {
      const data = await getTestResultsByUser(user.id);
      setResults(data);
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Không thể tải kết quả test. Vui lòng thử lại.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
    if (percentage >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải kết quả...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 pt-28">
      <div className="max-w-6xl mx-auto px-4">
        {notification && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-primary/20 ring-1 ring-primary/10 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Kết quả bài test của tôi</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">Xem lại lịch sử làm bài và kết quả đạt được</p>
            </div>
          </div>
        </div>

        {results.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Bạn chưa hoàn thành bài test nào.</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Hãy thử làm một bài test để xem kết quả tại đây!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {results.map((result) => (
              <div key={result.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Test Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Test #{result.testId}
                      </h3>
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                        ID: {result.id}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Thực hiện lúc: {new Date(result.createdAt).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Score Summary */}
                  <div className="flex items-center gap-4">
                    {/* Score Card */}
                    <div className={`px-4 py-3 rounded-lg border-2 ${getScoreBgColor(result.percentage)}`}>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {result.correctAnswers}/{result.totalQuestions}
                        </div>
                        <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                          Số câu đúng
                        </div>
                      </div>
                    </div>

                    {/* Percentage */}
                    <div className="text-right">
                      <div className={`text-3xl font-bold ${getScoreColor(result.percentage)}`}>
                        {result.percentage.toFixed(1)}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Tỷ lệ đúng
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-500 ${
                        result.percentage >= 80 ? 'bg-green-500' :
                        result.percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Performance Badge */}
                <div className="mt-3 flex justify-end">
                  {result.percentage >= 80 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                      <Trophy className="w-3 h-3" />
                      Xuất sắc
                    </span>
                  )}
                  {result.percentage >= 60 && result.percentage < 80 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300">
                      <CheckCircle className="w-3 h-3" />
                      Khá
                    </span>
                  )}
                  {result.percentage < 60 && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                      <Clock className="w-3 h-3" />
                      Cần cải thiện
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResultsPage;