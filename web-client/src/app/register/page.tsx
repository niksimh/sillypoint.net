'use client';

import Header from "@/shared/Header";
import Footer from "@/shared/Footer";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { RegisterJSON } from "@/types/index-handler-types";

export default function RegisterPage() {
  const router = useRouter();

  let [submissionStatus, setSubmissionStatus] = useState("pendingSubmission");
  
  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    //Prevent default 
    e.preventDefault();
    
    let submitInput = (document.getElementById("submitInput") as HTMLInputElement);

    //If event was placed on queue before disabling, noop
    if (submitInput.disabled) {
      return;
    }

    //Prevent further form submissions 
    submitInput.disabled = true;

    //Get the entered username and setup fetch url
    let username = (document.getElementById("usernameBox") as HTMLInputElement).value;
    let fetchUrl = `http://localhost:4000/register?username=${username}`;

    try {
      let response = await fetch(fetchUrl);
      if (response.ok) {
        let responseJSON: RegisterJSON = await response.json();
        if(responseJSON.error) {
          setSubmissionStatus(responseJSON.data);
        } else {
          localStorage.setItem("playerIdToken", responseJSON.data);
          router.push('/game');
        }
      }
    } catch {
      // do nothing. server is down.
    }
    
    //Allow submissions again
    submitInput.disabled = false;
  }

  let additionalMessage;
  switch(submissionStatus) {
    case "pendingSubmission":
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
    case "undefinedUsername":
      console.log("Please don't meddle with the client");
      break;
  }

  return (
    <>
      <Header title='Register'/>
      <form onSubmit={submitHandler}>
        <label htmlFor="usernameBox">Enter a username to play! Or leave it blank to get a random one.</label>
        <br />
        <input type="text" id="usernameBox" name="usernameBox" />
        <br />
        { additionalMessage }
        <br />
        <input type="submit" id="submitInput" value="submit" />
      </form>
      <Footer />    
  </>
  );
}
