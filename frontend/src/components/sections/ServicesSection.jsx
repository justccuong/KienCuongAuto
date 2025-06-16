import React from "react";
import {
  FaUsers,
  FaTags,
  FaCheckSquare,
  FaTruck,
  FaCreditCard,
  FaCar,
} from "react-icons/fa";

const strengths = [
  {
    icon: <FaUsers className="text-3xl mb-4" />,
    title: "Đội ngũ nhân viên chuyên nghiệp",
    desc: "Đội ngũ nhân viên tâm huyết với nghề, được đào tạo chuyên nghiệp, bài bản về chuyên môn, tư vấn nhiệt tình, chăm sóc chu đáo, tạo cảm giác thoải mái nhất cho mọi khách hàng.",
  },
  {
    icon: <FaTags className="text-3xl mb-4" />,
    title: "Giá cả cạnh tranh",
    desc: "Giá cả sản phẩm hợp lý cùng các chương trình khuyến mãi ưu đãi hấp dẫn nhất. Bên cạnh đó còn có các dịch vụ hậu mãi bảo hành sửa chữa chu đáo với đội ngũ kỹ thuật tay nghề cao.",
  },
  {
    icon: <FaCheckSquare className="text-3xl mb-4" />,
    title: "Uy tín hàng đầu",
    desc: "“Chữ tín luôn được đặt hàng đầu”. Ô Tô Kiên Cường lấy uy tín làm kim chỉ nam để hoạt động và phát triển, cung cấp xe cũ chất lượng giá tốt.",
  },
  {
    icon: <FaTruck className="text-3xl mb-4" />,
    title: "Hỗ trợ giao xe nhanh tận nơi",
    desc: "Dù ở xa hay gần, khách hàng không phải lo lắng bởi khi mua xe tại Ô Tô Kiên Cường, chúng tôi sẽ giao xe tận nơi nhanh chóng đúng thời hạn theo yêu cầu của quý khách.",
  },
  {
    icon: <FaCreditCard className="text-3xl mb-4" />,
    title: "Hỗ trợ trả góp thủ tục nhanh",
    desc: "Hỗ trợ khách hàng mua xe trả góp lên đến 70% giá trị xe, thời gian vay tối đa 7 năm, lãi tính theo dư nợ giảm dần. Thủ tục đơn giản, nhanh gọn.",
  },
  {
    icon: <FaCar className="text-3xl mb-4" />,
    title: "Xe có sẵn lái trải nghiệm",
    desc: "Showroom trưng bày các mẫu xe có sẵn, giúp khách hàng trải nghiệm thực tế để có cái nhìn chân thật hơn và lựa chọn dòng xe phù hợp.",
  },
];

const StrengthsSection = () => {
  return (
    <section className="bg-gray-50 py-12 px-4 text-center">
      <h2 className="text-3xl font-bold mb-10">Thế mạnh của Ô Tô Kiên Cường</h2>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {strengths.map((item, index) => (
          <div key={index} className="p-6 bg-white rounded-xl shadow hover:shadow-md transition">
            <div className="text-primary">{item.icon}</div>
            <h3 className="font-semibold text-lg mt-2 mb-3">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StrengthsSection;
