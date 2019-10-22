import { Gender } from './global';

// authentication
export interface RegInfo {
    email: string;
    password: string;
    name: string;
    countryCode: string;
    phoneNo: string;
};

export type TACArticle = {
    id: number;
    content: string;
    datePublished: string;
    state: string;
}

export type TACItem = {
    id: number;
    name: string;
    lang: string;
    articleScope: string;
    articles: TACArticle[];
    mandatory: boolean;
    enabled: boolean;
    agreed?: boolean;
}

export type RetrieveInfo = {
    manid?: string;
    manusername?: string;
}

export type UserUpdateInfo = {
    manid?: string;
    manusername?: string;
    username: string;
    password: string;
}

export type UserRolePermissions = {
    id: number;
    name: string;
}

export type UserRole = {
    id: number;
    name: string;
    permissions: UserRolePermissions[];
}

export interface User {
    id: number;
    name: string;
    username: string;
    enabled: boolean;
    accountNonExpired?: boolean;
    credentialsNonExpired?: boolean;
    accountNonLocked?: boolean;
    roles?: UserRole[];
};

export interface UserProfile {
    cellphoneCountryCode: string;
    cellphone: string;
    datebirth?: string;      // YYYY/MM/DD
    gender?: Gender;
    photoUrl?: string;       // URL
    termsAndConditionAgreements?: string;           // Agreed with TAC?
    emailVerified: boolean;
    cellphoneVerified: boolean;
}

