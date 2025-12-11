import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { toast } from "react-toastify";

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data);
        setName(res.data.name || "");
        setPhone(res.data.phone || "");
      } catch (err) {
        toast.error("Không lấy được thông tin người dùng");
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/auth/me", { name, phone });
      setUser(res.data.user);
      toast.success("✅ Cập nhật thành công!");
    } catch (err) {
      toast.error("❌ Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Đang tải thông tin...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-2xl font-bold mb-4">Thông tin cá nhân</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Tên</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Số điện thoại</label>
          <input
            type="tel"
            className="w-full border p-2 rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded bg-gray-100 text-gray-600"
            value={user.email}
            disabled
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded w-full transition"
          disabled={loading}
        >
          {loading ? "Đang cập nhật..." : "Cập nhật thông tin"}
        </button>
      </form>
    </div>
  );
};

export default AccountPage;
