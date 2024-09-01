import { ParsedQs } from "qs";

export default function checkIn(queryParam: ParsedQs) {
  return { direction: "/register" };
}
