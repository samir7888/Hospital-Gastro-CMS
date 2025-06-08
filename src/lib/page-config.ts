import { z } from "zod";

export enum ETabs {
  Home = "home",
  About = "about",
  Services = "services",
  Doctors = "doctors",
  News = "news",
}

export const tabsSchema = z.nativeEnum(ETabs);

// Page configuration
export const pageConfigs: Record<ETabs, Record<string, any>> = {
  [ETabs.Home]: {
    apiEndpoint: "/home-page",
    queryKey: ["home-page"],
    dataPath: "heroSection",
    cardTitle: "Home Hero Section",
    cardDescription: "Update the hero content for your homepage",
  },
  [ETabs.About]: {
    apiEndpoint: "/about-page",
    queryKey: ["about-page"],
    dataPath: "heroSection",
    cardTitle: "About Hero Section",
    cardDescription: "Update the about section of your website",
  },
  [ETabs.Services]: {
    apiEndpoint: "/services-page",
    queryKey: ["services-page"],
    dataPath: "heroSection",
    cardTitle: "Services Hero Section",
    cardDescription: "Update the hero content for your services page",
  },
  [ETabs.Doctors]: {
    apiEndpoint: "/doctors-page",
    queryKey: ["doctors-page"],
    dataPath: "heroSection",
    cardTitle: "Doctors Hero Section",
    cardDescription: "Update the hero content for your doctors page",
  },
  [ETabs.News]: {
    apiEndpoint: "/blogs-page",
    queryKey: ["blogs-page"],
    dataPath: "heroSection",
    cardTitle: "Blogs Hero Section",
    cardDescription: "Update the hero content for your blogs page",
  },
};
