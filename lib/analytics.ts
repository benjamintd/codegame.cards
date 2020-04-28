import ReactGA from "react-ga";
import { hotjar } from "react-hotjar";

export const initGA = () => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.initialize("UA-72962798-6");
    hotjar.initialize(1787488, 6);
  }
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category: string, action: string) => {
  if (category && action) {
    ReactGA.event({ category, action });
  }
};
export const logException = (description: string, fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
