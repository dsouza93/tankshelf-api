type WaterTypes = "freshwater" | "saltwater" | "terrarium";

export interface BaseTank {
    name: string;
    description: string;
    type: WaterTypes;
    image: string;
    stream?: string;
    age?: number;
}

export interface Tank extends BaseTank {
    id: number;
}

export type TankKeys = keyof Tank;