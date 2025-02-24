import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const testimonials = [
  {
    img: "assets/img/testimonial-1.jpg",
    text: "Service impeccable et équipe très professionnelle. Je recommande vivement !",
    name: "Jean Dupont",
    profession: "Entrepreneur",
  },
  {
    img: "assets/img/testimonial-2.jpg",
    text: "Une expérience exceptionnelle, du début à la fin. Merci pour votre travail incroyable.",
    name: "Sophie Martin",
    profession: "Designer",
  },
  {
    img: "assets/img/testimonial-3.jpg",
    text: "Très satisfait de la qualité et de l’accompagnement offert par cette entreprise.",
    name: "Luc Bernard",
    profession: "Développeur",
  },
  {
    img: "assets/img/testimonial-4.jpg",
    text: "Un service client au top, je recommande les yeux fermés !",
    name: "Marie Lefèvre",
    profession: "Consultante",
  },
];

function Testimonia() {
  return (
    <div className="container-fluid testimonial pb-5">
      <div className="container pb-5">
        <div className="text-center mx-auto pb-5" style={{ maxWidth: 800 }}>
          <h4 className="text-primary">Témoignages</h4>
          <h1 className="display-5 mb-4">Ce que disent nos clients</h1>
          <p className="mb-0">
            Découvrez les avis de nos clients satisfaits.
          </p>
        </div>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Pagination, Navigation, Autoplay]}
          slidesPerView={2}
          spaceBetween={30}
          pagination={{ clickable: true }}
          navigation
          autoplay={{ delay: 3000 }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div className="testimonial-item bg-white shadow-lg rounded-lg p-6 text-center">
                <div className="testimonial-quote-left text-primary">
                  <i className="fas fa-quote-left fa-2x"></i>
                </div>
                <div className="testimonial-img my-3">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="img-fluid rounded-circle border-2 border-primary"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                </div>
                <div className="testimonial-text">
                  <p className="mb-0 italic">"{item.text}"</p>
                </div>
                <div className="testimonial-title mt-3">
                  <h4 className="mb-0">{item.name}</h4>
                  <p className="mb-0 text-muted">{item.profession}</p>
                </div>
                <div className="d-flex justify-center text-primary mt-2">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star"></i>
                  ))}
                </div>
                <div className="testimonial-quote-right text-primary mt-2">
                  <i className="fas fa-quote-right fa-2x"></i>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Testimonia;
