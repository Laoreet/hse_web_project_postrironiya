import React, { useEffect, useState, ChangeEvent } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, set, remove } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { getDormitoryIdById, getSlotsByWMids, getWMIdByDormId } from '../lib/firebase-service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Dashboard: React.FC = () => {

  const [user, setUser] = useState<any>(null);
  const navigator = useNavigate();
  const [wms, setWms] = useState<IWM[]>([]);
  const [slots, setSlots] = useState<ISlot[]>([]);
  const time_arr: string[] = ['09:00', '11:00', '15:00', '17:00', '19:00', '21:00'];
  const [busyslot, setBusySlot] = useState<ISlot | null>(null);
  const [busyslot_wm_floor, setBusySlotWM] = useState<number | null>(0);
  const [slotMatrix, setMatrix] = useState<[number, string[]][]>([]);
  const [week, setWeek]= useState<string[]>([]);
  const [day_slots, setDaySlots] = useState<ISlot[]|null>([]);

  useEffect(() => {
    const today = new Date();
    today.setMinutes(0);
    today.setHours(0);
    today.setSeconds(0);
    let day: number;
    let month: number;
    let year: number;
  
    let weeks: string[] = [];
    day = today.getDate();
    month = today.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
    year = today.getFullYear();

    // Форматирование дня и месяца, чтобы добавить ведущий ноль, если число меньше 10
    const formattedDay = day < 10 ? `0${day}` : `${day}`;
    const formattedMonth = month < 10 ? `0${month}` : `${month}`;

    const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;
    if (week!=null)
      {if (formattedDate!=week[0])
    for (let i = 0; i < 7; i++) {
      day = today.getDate();
      month = today.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
      year = today.getFullYear();
  
      // Форматирование дня и месяца, чтобы добавить ведущий ноль, если число меньше 10
      const formattedDay = day < 10 ? `0${day}` : `${day}`;
      const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  
      const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
      console.log(formattedDate);
      weeks.push(formattedDate);
      today.setDate(today.getDate() + 1); // Увеличиваем дату на один день для следующей итерации
    }
    setWeek(weeks);
  }}, []);

  const [selectedOption, setSelectedOption] = useState(week[0]);

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    setDaySlots(null);
  
  
  
  
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        getWMIdByDormId(userData.dormitory).then((wms) => {
          if (wms!=null)
          setWms(wms);
        });

    } else {
      navigator("/login"); // Перенаправляем на страницу авторизации, если пользователь не авторизован
    }
  }, []);

  useEffect(()=> {
   
  })

  useEffect(()=> {
    getSlotsByWMids(wms, selectedOption).then((slots) => {
      if (slots!=null)
      setSlots(slots);
    });
  })

useEffect(() => {

  let slotMat: [number, string[]][] = [];

  let user_do_laundry: Boolean;
  user_do_laundry=false;
  wms.forEach((wm)=> {


    let slots_wm: string[] = [];
    time_arr.forEach((time)=>{

      let busi_slot: Boolean;
      busi_slot=false;
      slots.forEach((slot)=>{

        if (slot.start.substring(slot.start.length-5)==time && wm.id==slot.wm_id)
          {slots_wm.push('grey');
            busi_slot=true;
            if (slot.user_id==user.mail){
              if (busyslot==null)
              
                {console.log('llllllllll')
              setBusySlotWM(wm.floor)
              user_do_laundry=true;
              setBusySlot(slot);}
              else if (busyslot.start.substring(0, busyslot.start.length-6)!=selectedOption){
                setBusySlotWM(wm.floor)
              user_do_laundry=true;
              setBusySlot(slot);
              }

            }
          }
           

    })
    const curDate = new Date();
    //          console.log(curDate);
    const timeParts = time.split(/[- :]/);
  const hour = parseInt(timeParts[0], 10);
  const minute = parseInt(timeParts[1], 10);
  const day = new Date(selectedOption);
  const date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
  
  console.log(date);
  if (curDate> date)
            {
              console.log('ldlld');
              if (!busi_slot)
              slots_wm.push('grey');}
  else {
    if (!busi_slot)
    slots_wm.push('blue');}
          }
        
  )

  slotMat.push([wm.floor,slots_wm]);
  setMatrix(slotMat);
}
)
if (user_do_laundry==false ) {
  console.log('--------------------------');
  if (busyslot==null)
  {setBusySlot(null);
  setBusySlotWM(null);}
  else if (busyslot.start.substring(0, busyslot.start.length-6)!=selectedOption){
    setBusySlotWM(null);
  setBusySlot(null);
  }
}

})



const chooseSlot = async (floor: number, time: string) => {

  if (busyslot==null)
  {let wmid: number;
  wmid=0;
  wms.forEach((wm)=>{
    if (wm.floor==floor)
      wmid=wm.id;
  })
  let currentDate = new Date(selectedOption);
  let year = currentDate.getFullYear();
  let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // добавляем нуль спереди, если месяц < 10
  let day = String(currentDate.getDate()).padStart(2, '0'); // добавляем нуль спереди, если день < 10

const dateString = year+'-'+month+'-'+day+' ';
        let slotData = {
          wm_id: wmid,
          user_id: user.mail,
          start: dateString+time,
        };
  const slotsRef = ref(db, `Slots/`+dateString+time+String(wmid));
  await set( slotsRef, slotData);}
  else {

    toast('Вы уже стираетесь в этот день!')
  }
}

const resetSlot = async () => {
  if (busyslot!=null)
  {let slot_date = new Date(busyslot.start);
  let year = slot_date.getFullYear();
  let month = String(slot_date.getMonth() + 1).padStart(2, '0'); // добавляем нуль спереди, если месяц < 10
  let day = String(slot_date.getDate()).padStart(2, '0'); // добавляем нуль спереди, если день < 10
if (slot_date>new Date())
{
  const slotsRef = ref(db, `Slots/`+busyslot.start+String(busyslot.wm_id))
  await remove(slotsRef);
  setBusySlot(null);}
  else {

    toast('Вы уже не можете отменить слот!')

  }
      }
}

  // Render the data here

  return (
    <div className='container'>
      <h1>Слоты</h1>
<h2>Выберите дату</h2>
<div>
      <label htmlFor="dropdown">Choose an option:</label>
      <select id="dropdown" value={selectedOption} onChange={handleSelectChange}>
        {week?.map((d)=>(
        <option value={d}>{d}</option>
        ))}
      </select>
      <p>You selected: {selectedOption}</p>
    </div>

      {busyslot !== null ? <div><p>У вас имеется запись на {busyslot?.start} на {busyslot_wm_floor} этаже</p>
      <button onClick={() => resetSlot()}>Отменить</button>
      <ToastContainer /></div> : 
   <div> <p>Вы не записаны на сегодня</p>
    <p>Выберите слот</p></div>}
      <div className='dashboard'>
        <h2>Список слотов</h2>
        <br></br>
        <table>
          
{ 
  slotMatrix.map((el) => (
    
<tr>
  <td>{el[0]} этаж</td>
  {time_arr.map((_, i) => (
   el[1][i] === "grey" ?
        <td key={i}><button style={{background:'grey'}}>{time_arr[i]}</button></td>
      : 
      <td key={i}><button style={{background:'blue'}} onClick={() => chooseSlot(el[0], time_arr[i])}>{time_arr[i]}</button></td>
      )
    )
    }
</tr>

  ))
}
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
