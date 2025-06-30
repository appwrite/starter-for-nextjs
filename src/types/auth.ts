export interface UCLUser {
    email: string;
    given_name: string;
    sn?: string; // surname from UCL API
    family_name?: string; // for compatibility
    full_name: string;
    cn: string;
    department: string;
    student_id?: string;
    staff_id?: string;
    is_student: boolean;
    is_staff?: boolean;
    upi: string;
    ucl_groups?: string[]; // UCL groups for role determination
    user_types?: string[];
    mail?: string; // alternative email
}

export interface AuthUser {
    id: string;
    email: string;
    given_name: string;
    family_name: string;
    sn?: string;
    full_name: string;
    cn: string;
    department: string;
    student_id?: string;
    staff_id?: string;
    is_student: boolean;
    is_staff: boolean;
    upi: string;
    role: UserRole;
    permissions: string[];
}

export enum UserRole {
    STUDENT = 'STUDENT',
    STAFF = 'STAFF',
    ADMIN = 'ADMIN'
}

export interface UCLAuthResponse {
    ok: boolean;
    token: string;
    user: UCLUser;
}