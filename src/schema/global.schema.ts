import { z } from "zod";

export const imageSchema = z.string().nullish();

export type ImageResponse = {
  id: string;
  url: string;
};


export type TOptions ={
  value:string;
  label:string;

}[];