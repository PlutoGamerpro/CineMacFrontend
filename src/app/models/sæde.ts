export interface sæde{
    id: number;
    række: string | number;
    nummer: number;
    salId: number;
    // new fileds added
    
    isAvailable: boolean;
    isOccupied: boolean;
    isSelected?: boolean;
}