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
                      <p className="mb-8 md:mb-20 text-center text-[15px]"><q>Today <span className="underline decoration-sky-500/30">a reader</span>, tomorrow <span className="underline decoration-pink-500/30">a leader.</span></q> -Margaret Fuller</p>
                    </div>
                    <div className="text-gray-400 hover:text-pornhub-200 hover:duration-100 text-sm text-center">Copyright © Libhub 2025</div>
                  </div>
                  <div className="basis-1/6 mt-7">
                    <div className="uppercase font-semibold tracking-wider text-gray-600 mb-4">Danh mục</div>
                    <div className="flex flex-col gap-3">
                      <div className=""><a href="#" className="ct-link">TRANG CHỦ</a></div>
                      <div className=""><a href="#" className="ct-link">TÌM MUA XE</a></div>
                      <div className=""><a href="#" className="ct-link">BÁN XE</a></div>
                      <div className=""><a href="#" className="ct-link">VỀ KIÊN CƯỜNG</a></div>
                      <div className=""><a href="#" className="ct-link">HÌNH THỨC</a></div>
                      <div className=""><a href="#" className="ct-link">LIÊN HỆ</a></div>
                    </div>  
                  </div>

                  <div className="basis-1/6 mt-7">
                    <div className="uppercase font-semibold tracking-wider text-gray-600 mb-4">Theo dõi chúng tôi</div>
                    <div className="flex flex-col gap-3">
                      <div className=""><a href="https://www.facebook.com/kiencuongmuabanoto" className="ct-link">Facebook</a></div>
                      <div className=""><a href="https://www.youtube.com/@kiencuongmedia" className="ct-link">Youtube</a></div>
                      <div className=""><a href="https://www.tiktok.com/@kiencuongotovinhphuc" className="ct-link">TikTok</a></div>
      
                    </div>  
                  </div>
                  <div className="basis-1/3 mt-7">
                  <div className="uppercase font-semibold text-gray-600 mb-4 tracking-wide">Liên Hệ Chúng tôi</div>
                  <div className="mb-4 text-sm">We&apos;re Always Happy to Help</div>
                  <div className=" mb-16 text-xl font-medium"><a className="ct-link" href="mailto:jsclub.fpt@gmail.com">KienCuongAuto.vn</a></div>
                  <div className=""><a href="https://sso.jsclub.dev/login?appUrl=https://s.jsclub.dev" target="blank" className="text-gray-400 hover:text-pornhub-200 hover:duration-100 text-sm">Powered by Team 4</a></div>
                  </div>           
                </div>
            </footer> {/*End Footer*/}    
          </div>
         
        </>
    )
}

export default Footer