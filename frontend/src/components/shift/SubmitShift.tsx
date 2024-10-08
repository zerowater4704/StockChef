import { submitShift } from "../../services/shiftService";
import DatePicker from "react-datepicker";
import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const SubmitShift: React.FC = () => {
  const [shiftDate, setShiftDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [finishTime, setFinishTime] = useState<string>("");

  const handleSubmit = async () => {
    if (!shiftDate || !startTime || !finishTime) {
      alert("シフト日付と時間を選択してください");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        alert("ユーザーIDが見つかりません。再度ログインしてください。");
        return;
      }
      const formattedDate = shiftDate?.toISOString().split("T")[0];
      await submitShift({
        userId,
        shiftDate: formattedDate,
        startTime,
        finishTime,
      });
    } catch (error) {
      console.log("handleSubmit: ", error);
    }
  };
  return (
    <Box>
      <h2>シフト提出</h2>
      <div>
        <DatePicker
          selected={shiftDate}
          onChange={(date) => setShiftDate(date)}
          dateFormat="yyyy/MM/dd"
          customInput={<TextField variant="outlined" label="日付を選択" />}
        />
      </div>
      <div>
        <TextField
          type="time"
          label="開始時間"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          fullWidth
        />
      </div>
      <div>
        <TextField
          type="time"
          label="終了時間"
          value={finishTime}
          onChange={(e) => setFinishTime(e.target.value)}
          fullWidth
        />
      </div>
      <Button onClick={handleSubmit}>提出</Button>
    </Box>
  );
};

export default SubmitShift;
