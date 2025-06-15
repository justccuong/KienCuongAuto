import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaFacebook,
  FaTiktok,
  FaComments
} from "react-icons/fa";

// Dữ liệu chi nhánh (có thể load từ backend nếu cần mở rộng)
const branches = [
  {
    id: "tru-so-chinh",
    name: "TRỤ SỞ Kiên Cường Auto",
    location: "771 Đình Ấm – Khai Quang – Vĩnh Yên – Vĩnh Phúc",
    hotline: "0966 812 888",
    image: "/anh-co-so/truso.jpg",
    description:
      "Trụ sở chính Kiên Cường Auto tại Vĩnh Yên là điểm đến tin cậy hàng đầu trong khu vực cho những ai quan tâm đến lĩnh vực ô tô đã qua sử dụng. Với không gian rộng rãi, cơ sở vật chất hiện đại và đội ngũ chuyên viên giàu kinh nghiệm, nơi đây khẳng định vị thế vững chắc trong lòng khách hàng suốt nhiều năm qua.",
    mapsUrl: "https://maps.app.goo.gl/H84qg4ffRP1tbiP96",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.876167948284!2d105.6574498!3d21.258984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fb470524de59%3A0x83213dd31a47e656!2zK2hp4bq_dGkgQ3VyZ29uZyBBdXRv!5e0!3m2!1svi!2s!4v1717220582345!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/kiencuongmuabanoto",
      tiktok: "https://www.tiktok.com/@kiencuongotovinhphuc",
      zalo: "https://zalo.me/0966812888",
    },
  },
  {
    id: "cs1",
    name: "Kiên Cường Auto Cơ Sở 1",
    location: "464 Đình Ấm – Khai Quang – Vĩnh Yên – Vĩnh Phúc",
    hotline: "0986 388 922",
    image: "/anh-co-so/cs1.jpg",
    description:
      "Cơ sở 1 tại Vĩnh Yên mang đến trải nghiệm mua bán ô tô chuyên nghiệp với quy trình rõ ràng, dịch vụ hỗ trợ tận tình và đội ngũ tư vấn am hiểu thị trường. Uy tín tại địa phương được xây dựng từ sự minh bạch trong chất lượng xe và cam kết đồng hành lâu dài cùng khách hàng.",
    mapsUrl: "https://maps.app.goo.gl/YFZ3DPxt4984Tcxs8",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d592.337713386737!2d105.6296851518264!3d21.297363904213476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fb4f3b353e83%3A0x7b624c94c9afd10c!2zS2nDqm4gQ8aw4budbmcgQXV0byBjxqEgc-G7nyAxLTI!5e1!3m2!1svi!2s!4v1749930401611!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/Muabanxeotovinhphuc",
      tiktok: "https://www.tiktok.com/@kiencuongcoso1",
      zalo: "https://zalo.me/0986388922",
    },
  },
  {
    id: "cs2",
    name: "Kiên Cường Auto Cơ Sở 2",
    location: "464 Đình Ấm – Khai Quang – Vĩnh Yên – Vĩnh Phúc",
    hotline: "0366 691 888",
    image: "/anh-co-so/cs2.jpg",
    description:
      "Cơ sở 2 là một phần không thể thiếu trong hệ thống Kiên Cường Auto tại Vĩnh Yên. Đặt tại khu vực thuận tiện di chuyển, cơ sở này được khách hàng đánh giá cao nhờ cách làm việc chỉn chu, chính sách hậu mãi rõ ràng và tinh thần phục vụ chu đáo, thân thiện.",
    mapsUrl: "https://maps.app.goo.gl/YFZ3DPxt4984Tcxs8",
   mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d592.337713386737!2d105.6296851518264!3d21.297363904213476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fb4f3b353e83%3A0x7b624c94c9afd10c!2zS2nDqm4gQ8aw4budbmcgQXV0byBjxqEgc-G7nyAxLTI!5e1!3m2!1svi!2s!4v1749930401611!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/Salon.oto.Kien.Cuong",
      tiktok: "https://www.tiktok.com/@kiencuongcoso2",
      zalo: "https://zalo.me/0366691888",
    },
  },
  {
    id: "cs4",
    name: "Kiên Cường Auto Tuyên Quang – Cơ Sở 4",
    location: "Km5 – Lưỡng Vượng – TP. Tuyên Quang",
    hotline: "0848 724 999",
    image: "/anh-co-so/cs4.jpg",
    description:
      "Tại Tuyên Quang, cơ sở 4 được xem là điểm tựa đáng tin cậy cho khách hàng khu vực miền núi phía Bắc khi cần tìm mua ô tô đã qua sử dụng. Với sự am hiểu thị trường địa phương và tiêu chuẩn kiểm định nghiêm ngặt, cơ sở này ngày càng khẳng định chỗ đứng vững chắc trong ngành.",
    mapsUrl: "https://maps.app.goo.gl/FTabEamchk3hknQo6",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m17!1m11!1m3!1d1184.1740596236564!2d105.2263781863643!3d21.77370978766105!2m2!1f0!2f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134b18e4dbbfced%3A0x7ac2ffd70f89acb4!2zS2nDqm4gQ8aw4budbmcgQXV0byBUdXnDqm4gUXVhbmc!5e1!3m2!1svi!2s!4v1749929836596!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/profile.php?id=100079900017493",
      tiktok: "https://www.tiktok.com/@kiencuongautotuyenquang",
      zalo: "https://zalo.me/0848724999",
    },
  },
  {
    id: "cs5",
    name: "Kiên Cường Auto Việt Trì – Cơ Sở 5",
    location: "559 Đại Lộ Hùng Vương – Phường Bến Gót – TP. Việt Trì – Phú Thọ",
    hotline: "0987 771 022",
    image: "/anh-co-so/cs5.jpg",
    description:
      "Cơ sở 5 tại Việt Trì là một mô hình hoạt động đa năng, kết hợp giữa showroom xe cũ và trung tâm chăm sóc, bảo dưỡng uy tín. Tại đây, khách hàng không chỉ yên tâm khi lựa chọn xe mà còn được hỗ trợ tối đa về kỹ thuật và các dịch vụ sau bán hàng chất lượng cao.",
    mapsUrl: "https://maps.app.goo.gl/vGpwKpPqCM8a6dYv8",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d613.1106969475786!2d105.4290299!3d21.3040777!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134f33de9e8b189%3A0xf8f413ac359e9bab!2zS2nDqm4gQ8aw4budbmcgQXV0byBWaeG7h3QgVHLDrA!5e1!3m2!1svi!2s!4v1749930274054!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/profile.php?id=61556633194418",
      tiktok: "https://www.tiktok.com/@kiencuongcoso5",
      zalo: "https://zalo.me/0987771022",
    },
  },
  {
    id: "cs6",
    name: "Kiên Cường Auto Bình Dương – Cơ Sở 6",
    location: "278, DT743, Kp. Đông An, P. Tân Đông Hiệp, TP. Dĩ An, Bình Dương",
    hotline: "0385 882 418",
    image: "/anh-co-so/cs6.jpg",
    description:
      "Cơ sở 6 tại Bình Dương đóng vai trò là cầu nối giữa Kiên Cường Auto và khách hàng khu vực phía Nam. Với cách làm việc chuyên nghiệp, tư vấn tận tâm và dịch vụ minh bạch, nơi đây đang dần trở thành một địa chỉ quen thuộc và được tin tưởng rộng rãi tại địa phương.",
    mapsUrl: "https://maps.app.goo.gl/SD8oAjt9qWpg17J88",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4494.0790128982935!2d106.7760871!3d10.913912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3174d90033e34447%3A0xaeb60f66c94aab63!2zS2nDqm4gQ8aw4budbmcgQXV0byBDaGkgTmjDoW5oIE1p4buBbiBOYW0!5e1!3m2!1svi!2s!4v1749930518724!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/kiencuongautobinhduong",
      tiktok: "https://www.tiktok.com/@kiencuongautobinhduong",
      zalo: "https://zalo.me/0385882418",
    },
  },
  {
    id: "cs7",
    name: "Kiên Cường Auto Bình Xuyên – Cơ Sở 7",
    location: "QL2 – Hương Canh – Bình Xuyên – Vĩnh Phúc",
    hotline: "0962 969 926",
    image: "/anh-co-so/cs7.jpg",
    description:
      "Nằm tại Bình Xuyên – Vĩnh Phúc, cơ sở 7 nổi bật với sự am hiểu nhu cầu thị trường địa phương và phong cách phục vụ gần gũi, nhiệt tình. Khách hàng khi đến đây luôn cảm nhận được sự thoải mái, tin tưởng trong quá trình chọn lựa và giao dịch xe cũ.",
    mapsUrl: "https://maps.app.goo.gl/gL2eHzf3KePzMCpb8",
    mapsEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d2142.489683567937!2d105.6588394!3d21.2569547!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134fb470524de59%3A0x83213dd31a47e656!2zw5QgVMO0IEtpw6puIEPGsOG7nW5nIFbEqW5oIFBow7pj!5e1!3m2!1svi!2s!4v1749930565399!5m2!1svi!2s",
    socials: {
      facebook: "https://www.facebook.com/noithatotoG7",
      tiktok: "https://www.tiktok.com/@kiencuongbinhxuyen",
      zalo: "https://zalo.me/0962969926",
    },
  },
];



const BranchDetail = () => {
  const { id } = useParams();
  const branch = branches.find((b) => b.id === id);
  const [cars, setCars] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách xe:", error);
      }
    };

    fetchCars();
  }, []);

  if (!branch)
    return (
      <div className="text-center text-red-600 mt-10">
        Không tìm thấy chi nhánh!
      </div>
    );

  return (
    <section className="bg-white min-h-screen text-black py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/branches"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Quay lại danh sách chi nhánh
        </Link>

        <img
          src={branch.image}
          alt={branch.name}
          className="w-full h-64 object-cover rounded-2xl mb-6 shadow"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-4">{branch.name}</h1>
        <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
          <FaMapMarkerAlt />
          {branch.location}
        </p>
        <p className="text-gray-700 text-lg mb-2 flex items-center gap-2">
          <FaPhoneAlt />
          {branch.hotline}
        </p>
        <p className="text-gray-600 mt-4">{branch.description}</p>

        {/* Mạng xã hội */}
        <div className="flex items-center gap-6 mt-6 text-2xl">
          {branch.socials.facebook && (
            <a
              href={branch.socials.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900"
            >
              <FaFacebook />
            </a>
          )}
          {branch.socials.tiktok && (
            <a
              href={branch.socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-gray-800"
            >
              <FaTiktok />
            </a>
          )}
          {branch.socials.zalo && (
            <a
              href={branch.socials.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700"
            >
              <FaComments />
            </a>
          )}
        </div>

        {/* Danh sách xe */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-4">Xe đang bán</h2>

          <div className="flex flex-wrap gap-3 mb-6">
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              Tất cả
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              SUV
            </button>
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              Sedan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <div
                key={car._id}
                className="border rounded-xl overflow-hidden shadow cursor-pointer transform transition-transform duration-300 hover:scale-105"
                onClick={() => navigate(`/cars/${car._id}`)}
              >
                <img
                  src={car.images?.[0]}
                  alt={car.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4 text-black">
                  <h3 className="text-xl font-semibold">{car.name}</h3>
                  <p className="text-red-800 font-bold text-lg my-2">
                    {car.price}
                  </p>
                  <div className="flex justify-between text-sm text-gray-700 mt-4">
                    <div>
                      <span className="font-semibold">Năm:</span> {car.year}
                    </div>
                    <div>
                      <span className="font-semibold">Số:</span> {car.gearbox}
                    </div>
                    <div>
                      <span className="font-semibold">Km:</span>{" "}
                      {car.kilometers}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bản đồ */}
        {branch.mapsUrl && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Bản đồ</h2>
            <a
              href={branch.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition mb-6"
            >
              🚗 Dẫn tôi tới cửa hàng
            </a>
            <div className="rounded-xl overflow-hidden shadow-lg h-[400px]">
              <iframe
                src={branch.mapsEmbed}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                title="Google Map"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BranchDetail;
