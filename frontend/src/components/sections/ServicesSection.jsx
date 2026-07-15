import React from "react";
import {
  Users,
  Tag,
  BadgeCheck,
  Truck,
  CreditCard,
  Car,
} from "lucide-react";

const strengths = [
  {
    icon: <Users size={24} />,
    title: "Đội ngũ chuyên nghiệp",
    desc: "Nhân viên tận tâm, được đào tạo bài bản, sẵn sàng tư vấn 24/7.",
  },
  {
    icon: <Tag size={24} />,
    title: "Giá cả cạnh tranh",
    desc: "Cam kết giá tốt nhất thị trường cùng nhiều chương trình ưu đãi hấp dẫn.",
  },
  {
    icon: <BadgeCheck size={24} />,
    title: "Uy tín hàng đầu",
    desc: "Chữ tín là kim chỉ nam. Cam kết chất lượng xe và pháp lý minh bạch.",
  },
  {
    icon: <Truck size={24} />,
    title: "Giao xe tận nhà",
    desc: "Hỗ trợ vận chuyển xe an toàn đến tận tay khách hàng trên toàn quốc.",
  },
  {
    icon: <CreditCard size={24} />,
    title: "Hỗ trợ trả góp 70%",
    desc: "Thủ tục nhanh gọn, lãi suất ưu đãi, thời gian vay linh hoạt tới 7 năm.",
  },
  {
    icon: <Car size={24} />,
    title: "Lái thử miễn phí",
    desc: "Trải nghiệm thực tế các dòng xe có sẵn tại showroom trước khi quyết định.",
  },
];

const ServicesSection = () => {
  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Vì sao chọn Kiên Cường Auto?</h2>
          <div className="w-20 h-1 bg-red-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {strengths.map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-2xl text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;