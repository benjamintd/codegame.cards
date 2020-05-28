import ReactGA from "react-ga";

export const initAnalytics = () => {
  if (process.env.NODE_ENV === "production") {
    ReactGA.initialize(process.env.GA_ID);
  }
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};

export const logEvent = (category: string, action: string, options = {}) => {
  if (category && action) {
    ReactGA.event({ category, action, ...options });
  }
};
export const logException = (description: string, fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal });
  }
};
