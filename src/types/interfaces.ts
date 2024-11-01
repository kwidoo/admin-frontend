// src/types/interfaces.ts

export interface MenuItem {
    id: number;
    name: string;
    slug: string;
    url: string;
    icon: string | null;
    parent_id: number | null;
    order: number;
    permissions: string;
    children: MenuItem[] | [] | null;
}

export interface PivotData {
    customer_type: 'admin' | 'customer';
    login_id: number;
    customer_id: number;
}

export interface UserData {
    id: number;
    login_value: string;
    login_value_type: 'EMAIL' | 'PHONE';
    name: string;
    pivot: PivotData;
}

export interface AuthResponse {
    success: boolean;
    data: UserData[];
    message: string;
    token: string;
}

export interface AuthState {
    user: {
        token: string | null; // bearer token
    };
    isAuthenticated: boolean;
}

export interface MicroService {
    id: number;
    name: string;
    description: string | null;
    slug: string;
    url: string | null;
    status: string;
    version: string;
}

// Define Contact type if contacts have structured data
export interface Contact {
    // Example structure if contact has fields
    type: string;
    value: string;
};

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    preferredContact: 'PHONE' | 'EMAIL';
    countryId: number;
    city: string;
    isActive: boolean;
    isSubscribed: boolean;
    isVerified: boolean;
    isSuspended: boolean;
    isPartner: boolean;
    contractIsSigned: boolean;
    confirmPersonalData: boolean;
    referralCode: string;
    partnerCode: string;
    idru: string;
    qualificationPeriod: string;
    qualificationRank: string;
    totalOrdered: number;
    bundleEnable: number;
    notes: string;
    contacts: Array<Contact>;
    password: string | null;
};
