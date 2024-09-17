import { CheckInJSON } from "@/index-handlers/types";

//Currently the process of checking-in is simply moving the user on to the next page. 
//However, in the future this is the entrance to the application so initial processing/analytics would go here.
export default function checkIn(): CheckInJSON {
  return { direction: "/register" };
}
