'use client';

import Header from "../../shared/Header";
import Footer from "../../shared/Footer";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  let [submissionState, setSubmissionState] = useState("pending");
  
  function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    (document.getElementById("joinButton") as HTMLButtonElement).disabled = true;

    e.preventDefault();

    let username = (document.getElementById("usernameBox") as HTMLInputElement).value;
    let fetchUrl = `http://localhost:4000/register?username=${username}`

    fetch(fetchUrl)
      .then((response) => {
        if(response.ok) {
          response.json()
            .then((registerResult) => {
              if(registerResult.error) {
                setSubmissionState(registerResult.reason);
              } else {
                localStorage.setItem("playerIdToken", registerResult.playerIdToken);
                router.push('/game')
              }
              (document.getElementById("joinButton") as HTMLButtonElement).disabled = false;
            })
            .catch(() => {
              (document.getElementById("joinButton") as HTMLButtonElement).disabled = false;
            })
        }
      })
      .catch(() => {
        (document.getElementById("joinButton") as HTMLButtonElement).disabled = false;
      }) 
    }

  let additionalMessage;
  switch(submissionState) {
    case "pending":
      additionalMessage = "";
      break;
    case "notAlphaNumeric":
      additionalMessage = "Please make sure your username only contains letters and numbers"
      break;
    case "hasBadWord":
      additionalMessage = "Please make sure your username is appropriate"
      break;
    case "tooLong":
      additionalMessage = "Please make sure your username is 15 characters or less";
      break;
  }

  return (
    <>
      <Header title='Register'/>
      <form onSubmit={submitHandler}>
        <label htmlFor="usernameBox">Enter a username to play! Or leave it blank to get a random one.</label>
        <input type="text" id="usernameBox" name="usernameBox" />
        { additionalMessage }
        <input type="submit" id="joinButton" value="Join" />
      </form>
      <Footer />    
  </>
  );
}
