// src/types/interfaces.ts
export interface MenuItem {
    id: number;
    name: string;
    slug: string;
    url: string;
    icon: string | null;
    parentId: number | null;
    order: number;
    permissions: string;
    children?: MenuItem[]; // Children are optional
}


export interface PivotData {
    customer_type: 'admin' | 'customer';
    login_id: number;
    customer_id: number;
}

export interface Login {
    id: number | null;
    loginValue: string;
    loginValueType: 'EMAIL' | 'PHONE';
    name: string | null;
    password: string | null;
    pivot: PivotData | null;
}

export interface AuthResponse {
    success: boolean;
    data: Login[];
    message: string;
    token: string;
}

export interface AuthState {
    user: {
        token: string | null; // bearer token
    };
    isAuthenticated: boolean;
}

export interface Password {
    password: string | null;
    notify: boolean;
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

export interface DataItem {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    id: number | null;
    enableEdit?: boolean;
    enableDelete?: boolean;
}

// Define Contact type if contacts have structured data
export interface Contact extends DataItem {
    id: number | null;
    name: string | null;
    customerId: number | null;
    contactType: 'PHONE' | 'EMAIL' | 'WHATSAPP' | 'TELEGRAM';
    contactValue: string | null;
};

export interface Customer extends DataItem {
    id: number | null;
    firstName: string;
    lastName: string;
    gender: 'MALE' | 'FEMALE';
    dateOfBirth: string;
    preferredContact: 'PHONE' | 'EMAIL';
    countryId: number | null;
    city: string;
    isActive: boolean;
    isSubscribed: boolean;
    isVerified: boolean;
    isPartner: boolean;
    contractIsSigned: boolean;
    confirmPersonalData: boolean;
    referralCode: string | number | null;
    partnerCode: string | number | null;
    idru: string | null;
    qualificationPeriod: string;
    qualificationRank: 'A' | 'R';
    totalOrdered: number;
    bundleEnable: boolean;
    notes: string;
    contacts: Array<Contact>;
    password: string | null;
};

export interface Country extends DataItem {
    id: number;
    name: string;
}

export type CustomerType = 'client' | 'partner' | 'business-partner';
