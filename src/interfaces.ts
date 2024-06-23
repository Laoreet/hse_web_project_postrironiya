export interface IDormitory {
    id?: number;
    adress: string;
  }
  
  export interface ISlot {
    id: string;
    start: string;
    user_id: string;
    wm_id: number;
  }
  
  export interface IUser {
    id: string;
    mail: string;
    dormitory: number;
    first_name?: string;
    last_name?: string;
    pat_name?: string;
    password?: string;
    room?: number;
    social_net?: string;
  }
  
  export interface IWM {
    id: number;
    dormitory_id: number;
    floor: number;
    is_working: number;
  }
  