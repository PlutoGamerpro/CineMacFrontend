export interface Booking {
    id: number;
    navn: string;
    email: string;
    spilletidId: number;
    sædeId: number;
    bookingTidspunkt: string;
    spilletid?: { id: number; startTime: string; film?: { title: string } };
    sæde?: { id: number; række?: number; nummer?: number };
}
