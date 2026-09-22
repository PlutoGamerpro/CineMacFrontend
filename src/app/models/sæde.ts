export interface sæde{
    id: number;
    række: string;
    nummer: number;
    salId: number;
    // new fileds added
    
    isAvailable: boolean;
    isOccupied: boolean;
    isSelected?: boolean;
}