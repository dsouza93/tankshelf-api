type WaterTypes = "freshwater" | "saltwater";

export interface BaseTank {
    name: string;
    description: string;
    waterType: WaterTypes;
    image: string;
    stream?: string;
    age?: number;
}

export interface Tank {
    id: number;
}