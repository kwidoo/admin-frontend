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
