import { ref, get } from "firebase/database";
import { db } from "./firebase";
import {  IDormitory, ISlot, IUser, IWM } from "../interfaces";

export const getDormitories = async (): Promise<IDormitory[]> => {
  const dormRef = ref(db, "Dormitories");
  const snapshot = await get(dormRef);

  const dormitories: IDormitory[] = [];
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    dormitories.push({
      id: Number(childSnapshot.key),
      adress: childData.adress,
    });
  });

  return dormitories;
};


export const getUser = async(id: string): Promise<IUser|null> =>{
  const dormRef = ref(db, "Users");
  const snapshot = await get(dormRef);

  let user: IUser|null = null;
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    if (id==childSnapshot.key) 
    {user={
      id: childSnapshot.key,
    first_name: childData.first_name,
    dormitory: childData.dormitory,
    last_name: childData.last_name,
    pat_name: childData.pat_name,
    mail: childData.mail,
    room: childData.room,
    social_net: childData.social_net
    }
  }});

  return user;
}


export const getWM = async (): Promise<IWM[]> => {
  const dormRef = ref(db, "WM");
  const snapshot = await get(dormRef);

  const wms: IWM[] = [];
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    wms.push({
      id: Number(childSnapshot.key),
      dormitory_id: childData.dormitory_id,
      floor: childData.floor,
      is_working: childData.is_working,
    });
  });
  return wms;
};


export const getDormitoryAdressById = async (
  id: number
): Promise<string | null> => {
  const dormitories = await getDormitories();
  const dormitory = dormitories.find((dorm) => dorm.id === id);

  if (dormitory) {
    return dormitory.adress;
  }

  return null;
};

export const getDormitoryIdById = async (
  id: number
): Promise<number | null> => {
  const dormitories = await getDormitories();
  const dormitory = dormitories.find((dorm) => dorm.id === id);

  if (dormitory) {
    if (dormitory.id)
      return dormitory.id;
  }

  return null;
};



export const getWMIdByDormId = async (
  id: number
): Promise<IWM[] | null> => {
  const wm = await getWM();
  const dormitory_wm: IWM[] = [];
  wm.forEach((wash_m) => {
    if (wash_m.dormitory_id == id && wash_m.is_working)
      dormitory_wm.push(wash_m);
    console.log(wash_m.floor);
  })
  return dormitory_wm;
};


export const getSlots = async (day: string): Promise<ISlot[]> => {
  const slotsRef = ref(db, "Slots");
  const snapshot = await get(slotsRef);
  let curDate = new Date(day);
  curDate.setHours(0);
  curDate.setMinutes(0);
  curDate.setSeconds(0);

  let curDate_end = new Date(curDate);
  curDate_end.setHours(23);
  curDate_end.setMinutes(59);
  curDate_end.setSeconds(59);
  console.log('slotsgeting');
  let slots_day: ISlot[] = [];
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    const dateParts = childData.start.split(/[- :]/); // Разбиваем строку по символам "-", " " и ":"
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0 (январь)
    const day = parseInt(dateParts[2], 10);
    const hour = parseInt(dateParts[3], 10);
    const minute = parseInt(dateParts[4], 10);

    const date = new Date(year, month, day, hour, minute);
    
    if (date > curDate && date < curDate_end) {

      slots_day.push({
        id: String(childSnapshot.key),
        user_id: childData.user_id,
        wm_id: childData.wm_id,
        start: childData.start,
      });
    }
  }
  );

  return slots_day;
};

export const getSlotsByWMids = async (
  wms: IWM[],
  day: string,
): Promise<ISlot[] | null> => {
  let slots_day = await getSlots(day);
  console.log('wmsslotsbywmsid');
  const slots_for_wm: ISlot[] = [];
  if (wms.length == 0) {
    console.log(null);
  }

  wms.forEach((wash_m) => {
    slots_day.forEach((slot) => {
      let slot_date = new Date(slot.start)
      if (wash_m.id == slot.wm_id) {
        console.log(slot_date);
        slots_for_wm.push(slot);
      }
    })

  })
  return slots_for_wm;
};