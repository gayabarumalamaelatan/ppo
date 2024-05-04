import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const CardCarousel = () => {
    const settings = {
        // Untuk mengatur jumlah konten karousel yangh ditampilkan
        dots: true,
        infinite: true,
        speed: 500,
        slidesToScroll: 1,
        slidesToShow: 1,
        adaptiveHeight: true,
        variableWidth: true,
        autoplay: true,
        autoplaySpeed: 4000,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
                }
            },
            {
            breakpoint: 600,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                initialSlide: 2
                }
            },
            {
            breakpoint: 480,
            settings: {
                rows: 1,
                slidesToShow: 1,
                slidesToScroll: 1
                }
            }
        ]
    }
    return (
            <Slider {...settings}>
                {data.map((d) => (
                    <div className='card content carousel' style="width: 18rem">
                        <img src={d.img} alt=''/>
                        <div className='card-body content carousel'>
                            <p className='card-title'>{d.name}</p>
                            <p className='card-text'>{d.review}</p>
                            <button className='btn btn-primary'>Learn More</button>
                        </div>
                    </div>
                ))}
            </Slider>
    )
}

const data = [
    {
        name:'Imbal Hasil Treasury AS Kamis Naik Tipis Mencerna Keputusan Kebijakan Suku Bunga The Fed',
        img:'/dist/img/photo1.jpg',
        review:'(Vibiznews – Bonds) Imbal hasil Treasury AS naik tipis pada hari Kamis mencerna hasil pertemuan terbaru Federal Reserve.Imbal hasil Treasury 10-tahun naik lebih dari dua basis poin menjadi 4,612%.Imbal hasil Treasury 2 tahun berada di 4,943% setelah naik kurang dari satu basis poin..',
    },
    {
        name:'Rupiah menguat setelah imbal hasil Treasury AS menurun',
        img: '/dist/img/photo2.jpg',
        review:'Jakarta (ANTARA) - Nilai tukar rupiah terhadap dolar AS awal pekan ditutup menguat setelah imbal hasil Treasury Amerika Serikat (AS) menurun',
    },
    {
        name:'Harga emas turun seiring naiknya U.S. Treasury',
        img:'/dist/img/photo3.jpg',
        review:'Jakarta (ANTARA) - Harga emas berjangka di divisi COMEX New York Mercantile Exchange menurun pada Senin (Selasa pagi WIB) seiring kenaikan U.S. Treasury.',
    }
]

export default CardCarousel