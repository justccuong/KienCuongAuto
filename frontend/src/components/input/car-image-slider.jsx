import { useState } from "react";

export function CarImageSlider({ images, selected, onSelect }) {
  return (
    <div>
      {/* Ảnh chính */}
      <img
        src={images[selected]}
        alt="Car"
        className="w-full h-64 object-cover rounded-xl border"
      />

      {/* Ảnh nhỏ chọn */}
      <div className="flex gap-2 mt-3">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Thumb ${index}`}
            onClick={() => onSelect(index)}
            className={`w-20 h-14 object-cover rounded-md cursor-pointer border ${
              index === selected ? "border-blue-500" : "border-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
