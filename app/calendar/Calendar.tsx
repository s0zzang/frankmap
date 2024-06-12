"use client";

import fetchData from "./FetchData";
import "./calendar.scss";
import { useEffect, useState } from "react";

/** 받아온 User의 인터페이스 구축  */

interface EmotionData {
  post_id: number;
  user_id: number;
  emotion: number;
  date: string;
}

const Calendar = () => {
  /* -------------------- Data fetching -------------------- */
  const [data, setData] = useState<EmotionData[]>([]); // Supabase로부터 가져온 데이터를 저장할 상태

  useEffect(() => {
    const getData = async () => {
      const fetchedData = await fetchData();
      setData(fetchedData);
      console.log("데이터", data);
    };
    getData();
  }, []);

  /* ----------------- calendar ----------------- */

  const [selectedDate, setSelectedDate] = useState<Date>(new Date()); /** 현재 날짜를 가져오는 state */
  /** 클릭 한 날짜로 데이터를 변경하는 함수 */
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  /** 지정 된 타입으로 현재년도 현재월 반환 해주는 함수 */
  const getCurrentMonthYear = (): string => {
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" };
    return selectedDate.toLocaleDateString("ko-KR", options);
  };

  /** 이전 달로 넘어가는 함수 */
  const goToPreviousMonth = (): void => {
    const previousMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, selectedDate.getDate());
    console.log("<< go to previous month");
    setSelectedDate(previousMonth);
  };

  /** 다음 달로 넘어가는 함수 */
  const goToNextMonth = (): void => {
    const nextMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, selectedDate.getDate());
    console.log("go to next month >> ");
    setSelectedDate(nextMonth);
  };

  /** 현재 선택된 달의 일 수를 반환 하는 함수. */
  const getDaysInMonth = (): number => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  /** 시작날짜를 가져오는 함수 */
  const getStartDayOfWeek = (): number => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    return new Date(year, month, 1).getDay();
  };

  /** 받아온 데이터에서 이미지를 맵핑 하는 함수  */
  const getEmojiByEmotion = (emotion: number): string => {
    switch (emotion) {
      case 1:
        return "/emotion1.svg";
      case 2:
        return "/emotion2.svg";
      case 3:
        return "/emotion3.svg";
      default:
        return "";
    }
  };

  /** 그리드 랜더 해주는 함수  */
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth();
    const startDayOfWeek = getStartDayOfWeek();
    const blanksBefore: number[] = Array.from({ length: startDayOfWeek }, (_, index) => index);
    const days: number[] = Array.from({ length: daysInMonth }, (_, index) => index + 1);
    const titleOfDays: string[] = ["일", "월", "화", "수", "목", "금", "토"];

    return (
      <div className="calendarGrid">
        {titleOfDays.map((title, index) => (
          <div key={index} className={`calendarCell calendarHeader`}>
            {title}
          </div>
        ))}
        {blanksBefore.map((day) => (
          <div key={`blank-${day}`} className={`calendarCell`}></div>
        ))}
        {days.map((day) => {
          const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1);
          const formattedDate = currentDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
          const dailyData: any = data.find((item: EmotionData) => item.date === formattedDate); // 해당 날짜의 데이터 가져오기
          const emoji = dailyData ? getEmojiByEmotion(dailyData.emotion) : ""; // 해당 날짜의 이모지 가져오기

          return (
            <div
              key={day}
              className={`calendarCell ${day === selectedDate.getDate() ? "selected" : ""}`}
              onClick={() => handleDateClick(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day))}
            >
              {emoji ? <img src={emoji} alt="emoji" style={{ width: "20px", height: "20px" }}></img> : day}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="calendar">
        <div className="calendarHeader">
          <button onClick={goToPreviousMonth}>&lt;</button>
          <span>{getCurrentMonthYear()}</span>
          <button onClick={goToNextMonth}>&gt;</button>
        </div>
        {renderCalendarGrid()}
      </div>
    </>
  );
};

export default Calendar;
