'use client';

import Header from "@/app/shared/Header";
import Footer from "@/app/shared/Footer";
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
    let fetchUrl = `${process.env.NEXT_PUBLIC_GAME_SERVER_URL}/register?username=${encodeURIComponent(username)}`;

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
    
    //Allow submissions again and clear box.
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
      <main className="h-[80dvh] ls:h-[75dvh] flex justify-center items-center px-12">
        <form onSubmit={submitHandler} className="flex flex-col justify-center items-center gap-10 ls:gap-5">
          <label 
            htmlFor="usernameBox"
            className="text-center font-bold text-xl sm:text-2xl ls:text-lg"
          >
            <span>Enter a username to play! </span>
            <span className="inline-block">Or leave it blank to get a random one.</span>
          </label>
          <div className="flex justify-center items-center gap-5">
            <input 
              type="text" id="usernameBox" name="usernameBox" autoComplete="off"        
              className="black font-bold rounded h-12 w-52 sm:w-72 p-5"
            /> 
            <input 
              className="button button-translate font-bold h-12 w-20 sm:w-24" 
              type="submit" 
              id="submitInput" 
              value="Submit"
             />
          </div>  
          {
            additionalMessage ?
            <span className="white text-center underline font-bold">{ additionalMessage}</span> :
            <span>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          }          
        </form>
      </main>
      <Footer />    
  </>
  );
}
