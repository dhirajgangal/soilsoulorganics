/** Sets the browser tab title while a page is open. */
import { useEffect } from "react";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
