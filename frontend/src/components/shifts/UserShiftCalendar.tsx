import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // FullCalendarコンポーネント
import dayGridPlugin from "@fullcalendar/daygrid"; // 日付グリッドのプラグイン
import timeGridPlugin from "@fullcalendar/timegrid"; // 時間グリッドのプラグイン
import interactionPlugin from "@fullcalendar/interaction"; // クリックやドラッグ用のプラグイン
import jaLocale from "@fullcalendar/core/locales/ja";
import Modal from "react-modal";
import "./Calendar.css";
import {
  deleteShift,
  getPendingShifts,
  requestShifts,
  updateShift,
} from "../../services/userShiftService";

Modal.setAppElement("#root");

interface ShiftCalendarAuthenticated {
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ModalDate {
  date: string;
  startTime: string;
  finishTime: string;
  confirm: boolean;
}

interface CalendarEvent {
  title: string;
  start: string;
  allDay: boolean;
}

const UserShiftCalendar: React.FC<ShiftCalendarAuthenticated> = ({
  setIsAuthenticated,
}) => {
  // イベントデータの状態管理
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [modalDate, setModalData] = useState<ModalDate>({
    date: "",
    startTime: "",
    finishTime: "",
    confirm: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [errors, setErrors] = useState<string | null>(null);

  const openModal = (info: any) => {
    setModalData((prev) => ({
      ...prev,
      date: info.dateStr,
    }));
    setIsModalOpen(true);
  };

  // 月や年が変更された時に呼ばれる関数
  const handelDatesSet = async (arg: any) => {
    const year = arg.view.currentStart.getFullYear();
    const month = arg.view.currentStart.getMonth() + 1; // 正しい月を取得

    const result = await getPendingShifts(year, month);
    if (result && result.pendingShift) {
      const formattedEvents = result.pendingShift.map(
        (shift: { date: string; startTime: string; finishTime: string }) => ({
          title: `${shift.startTime} - ${shift.finishTime}`, // タイトルには時間を表示
          start: shift.date, // イベントの開始日
          allDay: true, // 終日イベントとして設定
        })
      );

      setEvents(formattedEvents);
    } else {
      setErrors(result.message);
    }
  };

  // 日付選択時に呼ばれる関数
  const handleDateClick = async () => {
    const newShift = {
      year: new Date(modalDate.date).getFullYear(),
      month: new Date(modalDate.date).getMonth() + 1,
      shifts: [
        {
          date: modalDate.date,
          startTime: modalDate.startTime,
          finishTime: modalDate.finishTime,
          confirm: modalDate.confirm,
        },
      ],
    };

    const result = await requestShifts(newShift);
    if (result && result.type !== "server" && result.type !== "error") {
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: `${modalDate.startTime} - ${modalDate.finishTime}`,
          start: modalDate.date,
          allDay: true,
        },
      ]);
      console.log("newShift: ", newShift);
      setIsAuthenticated(true);
      setIsModalOpen(false);
    } else {
      console.log("result: ", result);
      setErrors(result.message);
    }
  };

  const handelEventClick = (info: any) => {
    const clickedEvent = info.event;

    setModalData({
      date: clickedEvent.startStr,
      startTime: clickedEvent.title.split(" - ")[0],
      finishTime: clickedEvent.title.split(" - ")[1],
      confirm: false,
    });

    setIsDetailModalOpen(true);
  };

  const handelUpdateShift = async () => {
    const updatedShift = {
      year: new Date(modalDate.date).getFullYear(),
      month: new Date(modalDate.date).getMonth() + 1,
      date: modalDate.date,
      startTime: modalDate.startTime,
      finishTime: modalDate.finishTime,
    };

    const result = await updateShift(updatedShift);
    if (result && result.type !== "server" && result.type !== "error") {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.start === modalDate.date
            ? {
                ...event,
                title: `${modalDate.startTime} - ${modalDate.finishTime}`,
              }
            : event
        )
      );
      setIsDetailModalOpen(false);
    } else {
      setErrors(result.message);
    }
  };

  const handelDeleteShift = async () => {
    const deletedShift = {
      year: new Date(modalDate.date).getFullYear(),
      month: new Date(modalDate.date).getMonth() + 1,
      date: modalDate.date,
    };

    const result = await deleteShift(deletedShift);
    if (result && result.type !== "server" && result.type !== "error") {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.start !== modalDate.date)
      );
      setIsDetailModalOpen(false);
    } else {
      setErrors(result.message);
    }
  };

  const handleDayCellContent = (args: any) => {
    return args.dayNumberText.replace("日", ""); // 「日」の文字を削除して数字のみ表示
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        style={{ width: "300%" }}
        className="w-3/4 p-4 bg-white shadow-lg rounded-lg"
      >
        {" "}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // 使用するプラグイン
          initialView="dayGridMonth" // 初期表示を月グリッドに設定
          initialDate={new Date()} // 現在の日付からスタート
          events={events} // イベントデータを渡す
          dateClick={openModal} // 日付クリック時にモーダルを開く
          eventClick={handelEventClick}
          selectable={true} // 日付範囲選択を有効にする
          dayCellContent={handleDayCellContent}
          locale={jaLocale} // 日本語対応
          headerToolbar={{
            left: "title",
            center: "",
            right: "today prev next",
          }}
          datesSet={handelDatesSet}
          contentHeight="600px" // 高さのカスタマイズ
        />
      </div>

      <Modal
        isOpen={isDetailModalOpen}
        onRequestClose={() => setIsDetailModalOpen(false)}
        contentLabel="シフト修正"
        className="fixed z-50 inset-0 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">{modalDate.date}</h2>
            <button onClick={handelDeleteShift}>削除</button>
            <div>
              <label>開始時間:</label>
              <input
                type="time"
                value={modalDate.startTime}
                onChange={(e) =>
                  setModalData({ ...modalDate, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label>終了時間:</label>
              <input
                type="time"
                value={modalDate.finishTime}
                onChange={(e) =>
                  setModalData({ ...modalDate, finishTime: e.target.value })
                }
              />
            </div>
            {errors && <p className="text-red-500 text-sm">{errors}</p>}
            <div>
              <button onClick={handelUpdateShift}>修正</button>
              <button onClick={() => setIsModalOpen(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="シフト追加"
        className="fixed z-50 inset-0 overflow-y-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-40"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">{modalDate.date}</h2>
            <div>
              <label>開始時間:</label>
              <input
                type="time"
                value={modalDate.startTime}
                onChange={(e) =>
                  setModalData({ ...modalDate, startTime: e.target.value })
                }
              />
            </div>
            <div>
              <label>終了時間:</label>
              <input
                type="time"
                value={modalDate.finishTime}
                onChange={(e) =>
                  setModalData({ ...modalDate, finishTime: e.target.value })
                }
              />
            </div>
            {errors && <p className="text-red-500 text-sm">{errors}</p>}
            <div>
              <button onClick={handleDateClick}>追加</button>
              <button onClick={() => setIsModalOpen(false)}>キャンセル</button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default UserShiftCalendar;
