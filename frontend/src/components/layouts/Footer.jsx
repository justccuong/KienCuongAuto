import React, { useState } from "react";

const Footer = () =>{
    return(
        <>
          <div className="bg-gray-100 ">
            <footer className="w-95 xl:w-[70%] mx-auto pb-24 text-gray-500 text-base p-7">
                <div className="flex flex-col md:flex-row text-center md:text-left gap-8">
                  <div className="basis-1/3">
                    <div className="flex flex-col items-center">
                      <img src="/logo_done.png" alt="logo-lib-hub" className="w-44 h-auto mb-1" />
                    </div>
                    <div className="">
                      <p className="mb-8 md:mb-20 text-center text-[15px]"><q><span className="underline decoration-sky-500/30">Uy tín </span> tạo nên thương hiệu <span className="underline decoration-pink-500/30">- Chất lượng </span></q> dẫn lối thành công.</p>
                    </div>
                    <div className="text-gray-400 hover:text-pornhub-200 hover:duration-100 text-sm text-center">Copyright © KienCuongAuto 2025</div>
                  </div>
                  <div className="basis-1/6 mt-7">
                    <div className="uppercase font-semibold tracking-wider text-gray-600 mb-4">Danh mục</div>
                    <div className="flex flex-col gap-3">
                      <a href="/home" className="ct-top-menu-item block py-1">TRANG CHỦ</a>
                      <a href="/about-kien-cuong" className="ct-top-menu-item block py-1">VỀ KIÊN CƯỜNG</a>
                      <a href="/branches" className="ct-top-menu-item block py-1">CÁC CHI NHÁNH</a>
                      <a href="/about-kien-cuong" className="ct-top-menu-item block py-1">TÌM MUA XE</a>
                    </div>  
                  </div>

                  <div className="basis-1/6 mt-7">
                    <div className="uppercase font-semibold tracking-wider text-gray-600 mb-4">Theo dõi chúng tôi</div>
                    <div className="flex flex-col gap-3">
                      <div className=""><a href="https://www.facebook.com/kiencuongmedia" className="ct-link">Facebook</a></div>
                      <div className=""><a href="https://youtube.com/@kiencuongmedia?si=_QcFTt9bfZmdvvaP" className="ct-link">Youtube</a></div>
                      <div className=""><a href="https://www.tiktok.com/@kiencuongmedia?_t=ZS-8xDi5xLrRrz&_r=1" className="ct-link">TikTok</a></div>
                      <div className=""><a href="https://zalo.me/0562736868" className="ct-link">Hotline: 0562 73 6868</a></div>

      
                    </div>  
                  </div>
                  <div className="basis-1/3 mt-7">
                  <div className="uppercase font-semibold text-gray-600 mb-4 tracking-wide">Liên Hệ Chúng tôi</div>
                  <div className="mb-4 text-sm">We&apos;re Always Happy to Help</div>
                  <div className=" mb-16 text-xl font-medium"><a className="ct-link" href="mailto:jsclub.fpt@gmail.com">KienCuongAuto.vn</a></div>
                  <div className=""><a href="https://github.com/justccuong" target="blank" className="text-gray-400 hover:text-pornhub-200 hover:duration-100 text-sm">Powered by KienCuongAuto</a></div>
                  </div>           
                </div>
            </footer> {/*End Footer*/}    
          </div>
         
        </>
    )
}

export default Footer