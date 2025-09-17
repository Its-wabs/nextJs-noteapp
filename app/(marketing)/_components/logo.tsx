import Image from "next/image";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
const font =  Poppins({
    subsets: ["latin"],
    weight: ["400","600"]

});
const Logo = () => {
    return ( 
        <div className="hidden md:flex items-center gap-x-2">
            <Image
            src="/typhoon-normal.svg"
            height="40"
            width="40"
            alt="logo"
            className="dark:hidden"
            >
            </Image>
             <Image
            src="/typhoon-dark.svg"
            height="40"
            width="40"
            alt="logo"
            className="hidden dark:block"
            >
            </Image>
            <p className={cn("font-semibold",font.className)}>
                Typeflow
            </p>
            
        </div>

     );
}
 
export default Logo;
