// pages/Admin/EditCar.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditCar = () => {
  const { id } = useParams();
  const [car, setCar] = useState({});

  useEffect(() => {
    fetch(`/api/cars/detail/${id}`)
      .then((res) => res.json())
      .then((data) => setCar(data.car));
  }, [id]);

  const handleChange = (e) => {
    setCar({ ...car, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(car),
    });

    if (res.ok) {
      alert("✅ Cập nhật thành công");
    } else {
      const error = await res.json();
      alert(`❌ Lỗi: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">Chỉnh sửa ô tô</h2>
      <input name="name" value={car.name || ""} onChange={handleChange} placeholder="Tên xe" />
      <input name="year" value={car.year || ""} onChange={handleChange} placeholder="Năm sản xuất" />
      <input name="kilometers" value={car.kilometers || ""} onChange={handleChange} placeholder="Số km đã đi" />
      <input name="fuel" value={car.fuel || ""} onChange={handleChange} placeholder="Nhiên liệu" />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded">Lưu thay đổi</button>
    </form>
  );
};

export default EditCar;
