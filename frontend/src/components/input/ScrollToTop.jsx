import React, { useState, useEffect, useCallback } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible(window.scrollY > 300);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        
        return () => {
            window.removeEventListener("scroll", toggleVisibility);
        };
    }, [toggleVisibility]); 

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <button
            onClick={scrollToTop}
            type="button"
            aria-label="Cuộn lên đầu trang"
            className={`fixed bottom-6 right-6 rounded-full z-50 transition-all hover:translate-y-[-5px] hover:scale-105 duration-300 cursor-pointer
                ${isVisible ? "flex" : "hidden"}`}
        >
            <img className="w-16 h-auto" src="/scroll_top.png" alt="Cuộn lên đầu trang" />
        </button>
    );
};

export default ScrollToTop;
