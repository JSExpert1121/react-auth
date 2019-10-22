export interface StoreRegInfo {
    name: {
        ko: string;
        en: string;
    };
    address: string;
    BusinessNo: string;
    owner: string;
    ownerPhone: string;
}

export interface StoreInfo extends StoreRegInfo {
    id: string;
}