import React from "react";

const branches = [
  {
    name: "Trụ sở chính Kiên Cường Auto",
    location: "771 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0966812888",
    link: "/branches/tru-so-chinh",
    img: "/anh-co-so/truso.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 1",
    location: "646 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0986388922",
    link: "/branches/cs1",
    img: "/anh-co-so/cs1.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 2",
    location: "646 Đình Ấm, Khai Quang, Vĩnh Yên, Vĩnh Phúc",
    hotline: "0366691888",
    link: "/branches/cs2",
    img: "/anh-co-so/cs2.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 4 - Tuyên Quang",
    location: "Km5, Lưỡng Vượng, TP. Tuyên Quang",
    hotline: "0848724999",
    link: "/branches/cs4",
    img: "/anh-co-so/cs4.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 5 - Việt Trì",
    location: "559 Đại lộ Hùng Vương, TP. Việt Trì, Phú Thọ",
    hotline: "0987771022",
    link: "/branches/cs5",
    img: "/anh-co-so/cs5.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 6 - Bình Dương",
    location: "278 ĐT 743, Tân Đông Hiệp, TP. Dĩ An, Bình Dương",
    hotline: "0385882418",
    link: "/branches/cs6",
    img: "/anh-co-so/cs6.jpg",
  },
  {
    name: "Kiên Cường Auto Cơ sở 7 - Hương Canh",
    location: "Hương Canh, Bình Xuyên, Vĩnh Phúc",
    hotline: "0962969926",
    link: "/branches/cs7",
    img: "/anh-co-so/cs7.jpg",
  },
];

const BranchesPage = () => {
  return (
    <section className="bg-gray-50 py-14 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-gray-800">Hệ thống chi nhánh Kiên Cường Auto</h2>
          <p className="text-gray-600 mt-3 text-lg">Khám phá các chi nhánh gần bạn và lựa chọn xe ưng ý</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {branches.map((branch, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative h-52 w-full overflow-hidden">
                <img
                  src={branch.img}
                  alt={branch.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-branch.jpg";
                  }}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-black mb-2">{branch.name}</h3>
                <div className="text-sm text-gray-700 mb-1 flex items-center">
                  <i className="fas fa-map-marker-alt text-green-500 mr-2"></i>
                  <span>{branch.location}</span>
                </div>
                <div className="text-sm text-gray-700 mb-3 flex items-center">
                  <i className="fas fa-phone-alt text-blue-500 mr-2"></i>
                  <span>{branch.hotline}</span>
                </div>
                <a
                  href={branch.link}
                  className="
                      inline-block w-full text-center mt-auto
                      bg-red-600 text-white py-2 px-4 
                      rounded-xl font-semibold 
                      hover:bg-red-700 
                      shadow-md hover:shadow-lg 
                      transition duration-300
                    "
                >
                  Xem xe tại chi nhánh
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchesPage;
