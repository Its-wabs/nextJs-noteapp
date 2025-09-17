"use client";
import { Button } from "@/components/ui/button";
import { useConvexAuth } from "convex/react";
import { SignInButton,SignUpButton } from "@clerk/clerk-react";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/spinner";
import Link from "next/link";
const Heading = () => {
    const {isAuthenticated, isLoading} = useConvexAuth();
    const [text,setText] = useState('');
    const msg = "Your ideal shit is here";
    const [index, setIndex] = useState(0);

    useEffect(() => {
        
            const timeout = setTimeout(() => {
                if(index < msg.length) {
setText((prev) => prev + msg[index]);
                setIndex((prev) => prev + 1);
                }
 else {
            setTimeout(() => {

                setText('');
                setIndex(0);
                
            }, 4000);
        }
                
                
            },  100);
            return () => clearTimeout(timeout);
        
        
       
            
        

    },[text,index]);
    return ( 
        <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl md:text-6xl">
                 {text}  <span className="animate-pulse">|</span>
            </h1>
            <h3 className="text-base sm:text-xl md:text-2xl font-medium">better, stronger smarter</h3>
{isLoading && (
    <div className="w-full flex items-center justify-center">
        <Spinner size={"lg"}/>
    </div>
)}
{isAuthenticated && !isLoading && (
<Button className="relative cursor-pointer group overflow-hidden" asChild>
    <Link href={"/documents"}>
                <span className="transition-all duration-300 group-hover:translate-x-3.5">Start</span>
                <ArrowRight className="h-4 w-4 ml-2 transition-all duration-300 transform group-hover:translate-x-4 group-hover:opacity-0" />
                </Link>
                </Button>
)}
{!isAuthenticated && !isLoading && (
    <SignUpButton mode="modal">
                        <Button className="relative cursor-pointer group overflow-hidden"   size="sm"><span className="transition-all duration-300 group-hover:translate-x-3.5">Get TypeFlow free</span>
                            <ArrowRight className="h-4 w-4 ml-2 transition-all duration-300 transform group-hover:translate-x-4 group-hover:opacity-0" />
                        </Button>

                    </SignUpButton>

)}
            

        </div>
    
     );
}
 
export default Heading;