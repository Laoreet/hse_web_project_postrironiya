import React, { useEffect, useState, ChangeEvent } from 'react';
import { IDormitory, ISlot, IUser, IWM } from '../interfaces';
import { db } from '../lib/firebase';
import { getDatabase, ref, child, get, onValue, off, set, remove, update } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { getSlotsByWMids, getUser, getWMIdByDormId } from '../lib/firebase-service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'firebase/database';

const SlotSchedule: React.FC = () => {


  const [user, setUser] = useState<any>(null);
  const navigator = useNavigate();
  const [wms, setWms] = useState<IWM[]>([]);
  const [slots, setSlots] = useState<ISlot[] | null>(null);
  const time_arr: string[] = ['09:00', '11:00', '15:00', '17:00', '19:00', '21:00'];
  const [busyslot, setBusySlot] = useState<ISlot | null>(null);
  const [busyslot_wm_floor, setBusySlotWM] = useState<number | null>(0);
  const [slotMatrix, setMatrix] = useState<[number, string[]][]>([]);
  const [week, setWeek] = useState<string[]>([]);

  


  //пполучить слот в Date формате
  function get_slot_in_date_format(start: String) {
    const dateParts = start.split(/[- :]/); // Разбиваем строку по символам "-", " " и ":"
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0 (январь)
    const day = parseInt(dateParts[2], 10);
    const hour = parseInt(dateParts[3], 10);
    const minute = parseInt(dateParts[4], 10);
    const date = new Date(year, month, day, hour, minute);
    return date
  }

//установка времени 00 00
  function set_null_time(date: Date) {
    date.setMinutes(0);
    date.setHours(0);
    date.setSeconds(0);
    return date
  }

  //функция для 
  function get_date_for_dropdown_list(day: number, month: number, year: number) {
    let formattedDay = day < 10 ? `0${day}` : `${day}`;
    let formattedMonth = month < 10 ? `0${month}` : `${month}`;
    let formattedDate = `${formattedDay}.${formattedMonth}.${year}`;
    return formattedDate;
  }


  //функция для получения дней ближайшей недели и помещения в week
  useEffect(() => { // 1
    console.log('week_Set');

    let today = set_null_time(new Date());
    let day: number;
    let month: number;
    let year: number;
    let weeks: string[] = [];
    day = today.getDate();
    month = today.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
    year = today.getFullYear();
    // Форматирование дня и месяца
    let formattedDate = get_date_for_dropdown_list(day, month, year);
    if (week != null) {
      if (formattedDate != week[0])
        for (let i = 0; i < 7; i++) {
          day = today.getDate();
          month = today.getMonth() + 1; // Месяцы начинаются с 0, поэтому добавляем 1
          year = today.getFullYear();
          // Форматирование дня и месяца, чтобы добавить ведущий ноль, если число меньше 10
          let formattedDay = day < 10 ? `0${day}` : `${day}`;
          let formattedMonth = month < 10 ? `0${month}` : `${month}`;
          let formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
          console.log(formattedDate);
          weeks.push(formattedDate);
          today.setDate(today.getDate() + 1); // Увеличиваем дату на один день для следующей итерации
        }
      setWeek(weeks);
    }
  }, []);


  //константа выбранного дня ближайшей недели
  const [selectedOption, setSelectedOption] = useState(week[0]);

  // обработка смены дня недели
  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
    console.log(event.target.value)
  };



  // при изменении слотов обновить матрицу слотов
  useEffect(() => {
    console.log('use effect slots update')
    if (slots) {
      if (selectedOption != null) { 
        console.log(selectedOption);
        slots_matrix(selectedOption); }
      else {
        slots_matrix(new Date().toDateString());
      }
    }
    else {
       if (selectedOption == null) {
       let now = set_null_time(new Date());
      slots_update(now.toDateString());
       }
      else
      slots_update(selectedOption);
    }
  }, [slots]);


  // получение юзера, стиральных машин
  useEffect(() => { 
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      console.log('user_Set')
      getWMIdByDormId(userData.dormitory).then((wms) => {
        if (wms != null) {
          setWms(wms);
          console.log('wms_Set')
          if (selectedOption == null) {
            let now = set_null_time(new Date());
            slots_update(now.toDateString());
          }
          else
            slots_update(selectedOption);
        }
      });
    } else {
      navigator("/login"); // Перенаправляем на страницу авторизации, если пользователь не авторизован
    }
  }, []);

//функция для обновления списка слотов и запуск обновления матрицы
  async function slots_update(new_date: string) {
    console.log('slots_update function')
    try {
      let new_slots = await getSlotsByWMids(wms, new_date);
      setSlots(new_slots);
      slots_matrix(new_date);
    } catch (error) {
      console.error("Error fetching slots:", error);
    }
  }

//функция для формировании матрицы слотов
  function slots_matrix(date_selected: String | null = null) {
    console.log('MATRIX_BUILD')
    let slotMat: [number, string[]][] = [];
    let user_do_laundry: Boolean = false;
    let curDate = new Date(selectedOption);
    console.log('selectedDate:');
    console.log(selectedOption);

    if (date_selected !== null) {
      curDate = new Date(date_selected.toString());
    } 
    
    let now = new Date();
    if (curDate.getDate() === now.getDate()) {
      curDate.setHours(now.getHours());
      curDate.setMinutes(now.getMinutes());
      curDate.setSeconds(now.getSeconds());
    }

    wms.forEach((wm) => {
      console.log(wm.floor);
      let slots_wm: string[] = [];
      time_arr.forEach((time) => {
        let busi_slot: Boolean = false;
        let timeParts = time.split(/[- :]/);
        let hour = parseInt(timeParts[0], 10);
        let minute = parseInt(timeParts[1], 10);
        let day = new Date(selectedOption);
        if (date_selected !== null) {
          day = new Date(date_selected.toString());
        }
        let date = new Date(day.getFullYear(), day.getMonth(), day.getDate(), hour, minute);
        if (slots !== null)
          slots.forEach((slot) => {
            console.log(slot.start);
            if (slot.start.substring(slot.start.length - 5) === time && wm.id == slot.wm_id) {
              busi_slot = true;
              if (slot.user_id === user.mail) {
                console.log('we_know_you_do_laundry')
                setBusySlotWM(wm.floor);
                user_do_laundry = true;
                setBusySlot(slot);
              }
            }
          });
        if (curDate > date || busi_slot) {
          slots_wm.push('grey');
        } else {
          slots_wm.push('blue');
        }
      });
      slotMat.push([wm.floor, slots_wm]);
    });
    setMatrix(slotMat);
    if (user_do_laundry == false) {
      setBusySlotWM(null);
      setBusySlot(null);
    }
  }

  // Render the data here
  useEffect(() => {
    if (wms) {
      const slotsRef = ref(db, 'Slots');
      onValue(slotsRef, (snapshot) => {
        console.log('Slots hearing');
        console.log('selectedDate:');
        console.log(selectedOption);
        let data = snapshot.val();
        let slotsList: ISlot[] = [];
        for (let id in data) {
          if (data.hasOwnProperty(id)) {
            slotsList.push({ id, ...data[id] });
          }
        }
        let curDate = new Date();
        if (selectedOption != null) {
          curDate = new Date(selectedOption);
        }
        curDate = set_null_time(curDate);
        let dirty_Slots: ISlot[] = [];
        slotsList.forEach(slot => {
          let date = get_slot_in_date_format(slot.start)
          let curdate_end = new Date()
          if (selectedOption != null) curdate_end = new Date(selectedOption);
          curdate_end.setHours(23);
          curdate_end.setMinutes(59);
          curdate_end.setSeconds(59);
          if (date > curDate && date < curdate_end) {
            console.log('adding slot to dirty_slots')
            dirty_Slots.push({
              id: String(slot.id),
              user_id: slot.user_id,
              wm_id: slot.wm_id,
              start: slot.start,
            });
          }
        }
        );
        let slots_for_wm: ISlot[] = [];
        wms.forEach((wash_m) => {
          dirty_Slots.forEach((slot) => {
            if (wash_m.id == slot.wm_id)
              slots_for_wm.push(slot)
          })
        })
        setSlots(slots_for_wm);
        slots_matrix();
      });
      return () => {
        off(slotsRef);
      };
    }
  }, [wms, selectedOption]);

  //для выбора слота
  const chooseSlot = async (floor: number, time: string) => {
    console.log('SLOTS_ADDING')
    if (busyslot === null) {
      let wmid: number;
      wmid = 0;
      wms.forEach((wm) => {
        if (wm.floor == floor)
          wmid = wm.id;
      })
      let currentDate = new Date()
      if (selectedOption != null)
        currentDate = new Date(selectedOption);
      let year = currentDate.getFullYear();
      let month = String(currentDate.getMonth() + 1).padStart(2, '0'); // добавляем нуль спереди, если месяц < 10
      let day = String(currentDate.getDate()).padStart(2, '0'); // добавляем нуль спереди, если день < 10
      let dateString = year + '-' + month + '-' + day + ' ';
      let slotData = {
        wm_id: wmid,
        user_id: user.mail,
        start: dateString + time,
      };
      let slotsRef = ref(db, `Slots/` + dateString + time + String(wmid));
      await set(slotsRef, slotData);
    }
    else {
      toast('Вы уже стираетесь в этот день!')
    }
  }

  //для удаления слота
  const resetSlot = async () => {
    console.log('SLOTS_RESETING');
    if (busyslot != null) {
      let slot_date = new Date(busyslot.start);
      if (slot_date > new Date()) {
        const slotsRef = ref(db, `Slots/` + busyslot.start + String(busyslot.wm_id))
        console.log(selectedOption);
        await remove(slotsRef);
        setBusySlot(null);
      }
      else {
        toast('Вы уже не можете отменить слот!');
      }
    }
  }

  const busySlot = async (time: string, floor: number) => {
    if (slots)
    {
      let wmid: number;
      wmid = 0;
      wms.forEach((wm) => {
        if (wm.floor == floor)
          wmid = wm.id;
      })
      slots?.forEach((slot) =>{
      if (slot.start.endsWith(time) && slot.wm_id==wmid){
        getUser(user.mail).then((u) =>{
          toast('Занял пользователь' + '\n' +u?.first_name+' '+ u?.last_name + ', ' +  u?.mail.replace(/,/g, '.') + ', ' + u?.social_net + ', ' + 'комната '+ u?.room);
        }); 
      }
    })
    }
  }

  return (
    <div className='container'>
      <h1>Слоты</h1>
      <h2>Выберите дату</h2>
      <div>
        <label htmlFor="dropdown_label">Choose an option:</label>
        <select id="dropdown" value={selectedOption} onChange={handleSelectChange}>
          {week?.map((d) => (
            <option value={d}>{d}</option>
          ))}
        </select>
        <p>You selected: {selectedOption}</p>
      </div>
      <ToastContainer />
      {busyslot !== null ? <div><p>У вас имеется запись на {busyslot?.start} на {busyslot_wm_floor} этаже</p>
        <button onClick={() => resetSlot()}>Отменить</button>
      </div> :
        <div> <p>Вы не записаны на сегодня</p>
          <p>Выберите слот</p></div>}
      <div>
        <h2>Список слотов</h2>
        <br></br>
        <table>
          <tbody>
            {
              slotMatrix.map((el) => (
                <tr>
                  <td>{el[0]} этаж</td>
                  {time_arr.map((_, i) => (
                    (busyslot!== null && busyslot?.start.endsWith(time_arr[i]) && el[0]==busyslot_wm_floor) ? 
                    <td key={i}><button style={{ background: 'turquoise' }} onClick={() => busySlot(time_arr[i], el[0])}>{time_arr[i]}</button></td>
                    :
                    (el[1][i] === "grey" ?
                      <td key={i}><button style={{ background: 'grey' }} onClick={() => busySlot(time_arr[i], el[0])}>{time_arr[i]}</button></td>
                      :
                      <td key={i}><button style={{ background: 'blue' }} onClick={() => chooseSlot(el[0], time_arr[i])}>{time_arr[i]}</button></td>
                    )
                ))
                  }
                </tr>
              ))
            }</tbody>
        </table>
      </div>
    </div>
  );
};

export default SlotSchedule;
