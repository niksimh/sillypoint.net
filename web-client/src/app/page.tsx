'use client';

import Link from "next/link";
import Footer from "../shared/Footer";
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
      
      let fetchUrl = `http://localhost:4000/check-in?playerIdToken=${playerIdToken}`;

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
      <h1>SillyPoint!</h1>
      <h2>Multiplayer Hand Cricket!</h2>
      <nav>
        <Link href='/rules'>Rules</Link>
        <Link href={getStartedHref}>Get Started</Link>
      </nav>
      <Footer />
    </>
  );
}
