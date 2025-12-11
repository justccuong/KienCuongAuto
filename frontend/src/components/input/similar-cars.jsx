export function SimilarCars() {
  // Dummy data
  const cars = [
    {
      id: 1,
      name: "Toyota Fortuner 2020",
      price: "980 Triệu",
      img: "/car1.jpg"
    },
    {
      id: 2,
      name: "Hyundai SantaFe 2021",
      price: "1.030 Triệu",
      img: "/car2.jpg"
    },
    {
      id: 3,
      name: "Mazda CX-8 2022",
      price: "1.150 Triệu",
      img: "/car3.jpg"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cars.map((car) => (
        <div key={car.id} className="border rounded-lg p-3 shadow hover:shadow-md transition">
          <img src={car.img} alt={car.name} className="h-40 w-full object-cover rounded-md mb-2" />
          <h4 className="font-semibold text-base">{car.name}</h4>
          <p className="text-gray-600">{car.price}</p>
        </div>
      ))}
    </div>
  );
}
