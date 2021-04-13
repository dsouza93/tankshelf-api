import formidable from "formidable";

export type WaterTypes = "freshwater" | "saltwater" | "terrarium";

export interface BaseTank {
    name: string;
    description: string;
    type: WaterTypes;
    image?: number;
    stream?: string;
    age?: number;
}

export interface Tank extends BaseTank {
    tankID?: number;
    images: formidable.Files;
}

export type TankKeys = keyof Tank;