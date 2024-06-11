import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { IDormitory, ISlot, IWM } from "../interfaces";

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

  return  wms;
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

    if (wash_m.dormitory_id==id && wash_m.is_working)
      dormitory_wm.push(wash_m)
  })
    return dormitory_wm;
};


export const getSlots = async (day: string): Promise<ISlot[]> => {
  const slotsRef = ref(db, "Slots");
  const snapshot = await get(slotsRef);
  const curDate = new Date(day);
  curDate.setHours(0);
  curDate.setMinutes(0);
  curDate.setSeconds(0);
  const slots: ISlot[] = [];
  snapshot.forEach((childSnapshot) => {
    const childData = childSnapshot.val();
    const dateParts = childData.start.split(/[- :]/); // Разбиваем строку по символам "-", " " и ":"
const year = parseInt(dateParts[0], 10);
const month = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0 (январь)
const day = parseInt(dateParts[2], 10);
const hour = parseInt(dateParts[3], 10);
const minute = parseInt(dateParts[4], 10);

const date = new Date(year, month, day, hour, minute);

//console.log(date);
//console.log(curDate);
    if (date>curDate)
    {
     /// console.log('ddd')
      slots.push({
      id: String(childSnapshot.key),
      user_id: childData.user_id,
      wm_id: childData.wm_id,
      start: childData.start,
    });
  }
  }
);

  return slots;
};

export const getSlotsByWMids = async (
 wms: IWM[],
 day: string,
): Promise<ISlot[] | null> => {
  let date = new Date(day);

  const slots = await getSlots(day);
  date.setHours(23);
  date.setMinutes(59);
  date.setSeconds(59);

  const slots_for_wm: ISlot[] = [];
  wms.forEach((wash_m) => {
    slots.forEach((slot) => {
      let slot_date= new Date(slot.start)
      if (wash_m.id==slot.wm_id && slot_date<date)
        slots_for_wm.push(slot)
    })
    
  })
    return slots_for_wm;
};




