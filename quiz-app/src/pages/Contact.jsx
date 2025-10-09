import React from "react";

const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-4 text-primary">Liên hệ</h1>
      <p className="mb-4 text-gray-700">Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, hãy liên hệ với chúng tôi qua các thông tin dưới đây:</p>
      <ul className="mb-4 text-gray-700">
        <li><strong>Email:</strong> quizapp@example.com</li>
        <li><strong>Hotline:</strong> 0123 456 789</li>
        <li><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</li>
      </ul>
      <p className="text-gray-600">Hoặc gửi tin nhắn trực tiếp qua form liên hệ (tính năng sẽ cập nhật sau).</p>
    </div>
  );
};

export default Contact;
