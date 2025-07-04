export interface DatabaseUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    upi: string;
    role: string;
    department: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    profilePic?: string;
}