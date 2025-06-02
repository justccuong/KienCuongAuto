import React from "react";
import Footer from "../../components/layouts/Footer";
import Header from "../../components/layouts/Header";

export default function About() {
  return (
    <div className="w-full bg-white text-gray-900">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Tiêu đề chính */}
        <h1 className="text-5xl font-extrabold text-[#B00000] mb-16 border-l-8 border-[#B00000] pl-4">
          Kiên Cường Auto
        </h1>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Bên trái: Nội dung */}
          <div className="flex-1 space-y-10">
            {/* Giới thiệu công ty */}
            <section>
              <h2 className="text-3xl font-semibold mb-4 text-black">Giới thiệu công ty</h2>
              <p className="border-l-8 border-[#B00000] pl-4">
                Kiên Cường Auto là công ty chuyên kinh doanh xe ô tô đã qua sử dụng.
                Với đội ngũ chuyên viên nhiều kinh nghiệm và hệ thống showroom hiện đại,
                chúng tôi cam kết mang đến cho khách hàng những chiếc xe chất lượng, rõ ràng pháp lý và bảo hành minh bạch.
              </p>
            </section>

            {/* Sứ mệnh */}
            <section>
              <h2 className="text-3xl font-semibold mb-4 text-black">Sứ mệnh</h2>
              <p className="border-l-8 border-[#B00000] pl-4">
                Giúp khách hàng lựa chọn xe đã qua sử dụng một cách AN TÂM và dễ dàng nhất.
              </p>
            </section>

            {/* Tầm nhìn */}
            <section>
              <h2 className="text-3xl font-semibold mb-4 text-black">Tầm nhìn</h2>
              <p className="border-l-8 border-[#B00000] pl-4">
                Trở thành thương hiệu được yêu thích hàng đầu trong lĩnh vực xe ô tô đã qua sử dụng tại Việt Nam.
              </p>
            </section>

            {/* Giá trị cốt lõi */}
            <section>
              <h2 className="text-3xl font-semibold mb-4 text-black">Giá trị cốt lõi</h2>
              <ul className="list-disc pl-10 border-l-8 border-[#B00000]">
                <li>Trung Thực</li>
                <li>Tận Tâm</li>
                <li>Tử Tế</li>
              </ul>
            </section>

            {/* Triết lý vận hành */}
            <section>
              <h2 className="text-3xl font-semibold mb-4 text-black">Triết lý vận hành</h2>
              <p className="italic text-black border-l-8 border-[#B00000] pl-4">
                “Không phân biệt”<br />
                Chúng tôi không phân biệt khách hàng theo giá trị xe, tài chính hay mục đích sử dụng.
              </p>
            </section>
          </div>

          {/* Bên phải: Logo công ty */}
          <div className="w-full lg:w-80 flex justify-center lg:justify-end">
            <img
              src="/logo.png"
              alt="Logo Công ty Kiên Cường"
              className="object-contain w-72 h-72"
            />
          </div>
        </div>

        {/* Thống kê số liệu */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          <div>
            <p className="text-5xl font-bold text-[#B00000]">15</p>
            <p className="text-gray-700 mt-2">Năm kinh doanh</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-[#B00000]">79+</p>
            <p className="text-gray-700 mt-2">Chuyên viên</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-[#B00000]">4,800+</p>
            <p className="text-gray-700 mt-2">Xe đã bán</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-[#B00000]">7</p>
            <p className="text-gray-700 mt-2">Showroom</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
