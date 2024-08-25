'use client';

import Link from "next/link";
import Footer from "../shared/Footer";
import { useState } from "react"

export default function Home() {

  let [getStartedHref, setGetStartedHref] = useState("/");

  let playerIdJWT = "";
  if (typeof window !== "undefined") {
    playerIdJWT = localStorage.getItem("playerIdJWT") || "";
  }

  let fetchUrl = `http://localhost:4000/check-in?playerIdToken=${playerIdJWT}`

  fetch(fetchUrl)
    .then((response) => {
      if(response.ok) {
        response.json().then((directionJson) =>{
          setGetStartedHref(directionJson.direction);
        })
      }
    })
    .catch((response) => {}) //do nothing. href=/

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
