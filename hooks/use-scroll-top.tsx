import { useEffect, useState } from "react"

export const useScrollTop = ( threshold = 10) => {
    const [scrolled,setScrolled] = useState(false);

    useEffect(()=> {
        const handlescroll = () => {
            if (window.scrollY > threshold) {
                setScrolled(true);

            } else {
                setScrolled(false);
            }
        }
        window.addEventListener("scroll",handlescroll);
        return () => window.removeEventListener("scroll",handlescroll);
    },[threshold]);
return scrolled;
}