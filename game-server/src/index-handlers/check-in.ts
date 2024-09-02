import { ParsedQs } from "qs";
import { CheckInJSON} from "./types";

export default function checkIn(): CheckInJSON {
  return { direction: "/register" };
}
