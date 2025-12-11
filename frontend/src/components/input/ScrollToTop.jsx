import React, { useState, useEffect, useCallback } from "react";

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = useCallback(() => {
        setIsVisible(window.scrollY > 0);
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
        <div
            onClick={scrollToTop}
            className={`fixed bottom-6 right-6 rounded-full z-50 transition-all hover:translate-y-[-5px] hover:scale-105 duration-300 
                ${isVisible ? "flex" : "hidden"}`}
        >
            <img className="w-16 h-auto" src="/scroll_top.png" alt="scroll to top" />
        </div>
    );
};

export default ScrollToTop;
