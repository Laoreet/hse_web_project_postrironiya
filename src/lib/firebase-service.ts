import { ref, get } from "firebase/database";
import { db } from "./firebase";
import { IDormitory } from "../interfaces";

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
