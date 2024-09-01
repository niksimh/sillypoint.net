'use client';

import Link from "next/link";
import Footer from "../shared/Footer";
import { useState, useEffect } from "react"

export default function Home() {

  let [getStartedHref, setGetStartedHref] = useState("/");

  useEffect(() => {
    async function fetchData() {
      let playerIdJWT = "";
      
      if (typeof window !== "undefined") {
        playerIdJWT = localStorage.getItem("playerIdJWT") || "";
      }

      let fetchUrl = `http://localhost:4000/check-in?playerIdToken=${playerIdJWT}`

      try {
        let response = await fetch(fetchUrl);
        if(response.ok) {
          let responseJSON = await response.json();
          console.log(responseJSON);
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
