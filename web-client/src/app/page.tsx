'use client';

import Link from "next/link";
import Footer from "./shared/Footer";
import { useState, useEffect } from "react"
import { CheckInJSON } from "@/types/index-handler-types";

export default function Home() {

  let [getStartedHref, setGetStartedHref] = useState("/");

  useEffect(() => {
    async function fetchData() {
      if (typeof window === "undefined") {
        return;
      }
      
      let playerIdToken = localStorage.getItem("playerIdToken") || "";
      
      let fetchUrl = `https://sillypoint.net:4000/check-in?playerIdToken=${playerIdToken}`;

      try {
        let response = await fetch(fetchUrl);
        if(response.ok) {
          let responseJSON: CheckInJSON = await response.json();
          setGetStartedHref(responseJSON.direction);
        }
      } catch {
        // do nothing. client will be bricked to only direct home
      }
    }  
    fetchData();  
  }, []);

  return (
    <>
      <main className="h-[90dvh] flex flex-col justify-center items-center gap-11 ls:gap-9">
        <div className="flex flex-col justify-center items-center gap-5 ls:gap-1">
          <h1 className="pink font-bold text-4xl md:text-6xl ls:text-3xl">SillyPoint.net!</h1>
          <h2 className="white font-bold text-xl md:text-3xl ls:text-lg">Multiplayer Hand Cricket</h2>
        </div>
        <nav className="flex flex-col ls:flex-row justify-center items-center gap-5">
          <Link href='/rules' className="button w-40 sm:w-48 ls:w-40 h-12 sm:h-16 ls:h-12">
            <span className="white font-bold text-lg ls:text-lg sm:text-xl">Rules</span>
          </Link>
          <Link href={getStartedHref} className="button w-40 sm:w-48 ls:w-40 h-12 sm:h-16 ls:h-12">
            <span className="white font-bold text-lg ls:text-lg sm:text-xl">Get Started!</span>
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
