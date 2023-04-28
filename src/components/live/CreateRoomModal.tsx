import React, { useState } from "react";
import CreateScheduleModal from "./CreateScheduleModal";
import { axiosInstance } from "apis/axiosConfig";
import { useRecoilValue } from "recoil";
import { memberInfoState } from "recoil/userState";
import Popup from "./PopUp";
import { TextField } from '@mui/material';

type CreateRoomModalProps = {
  onClose: () => void;
  events: EventProp[];
};

interface EventProp {
  title: string;
  startDate: Date;
  endDate: Date;
  type: string;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({
  onClose,
  events,
}) => {
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState(1);
  const [mentoringRoomId, setMentoringRoomId] = useState<number>();

  const handleNextClick = () => {
    if (title === "" || description === "") {
      window.alert("방 제목과 소개글을 채워주세요.");
    } else {
      // axios로 방 데이터 추가
      axiosInstance({
        url: `/api/room`,
        method: "post",
        data: {
          title: title,
          description: description,
          mentorId: memberId,
          mentorName: memberInfo.nickname,
        },
      })
        .then(async (res) => {
          if (res.data["code"] == "200 OK") {
            setMentoringRoomId(res.data["data"]);
            setStep(2);

            // 방 생성 이후에 알림
            await axiosInstance
              .post(`/api/publish`, {
                mentorName: memberInfo.nickname,
              })
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            window.alert(res.data["msg"]);
          }
        })
        .catch((err) => {
          window.alert("방이 정상적으로 생성되지 못했습니다.");
          console.log(err);
        });
    }
  };

  return (
    <Popup>
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold mb-4">방 생성</h2>
          <form>
            <div className="mb-4">
              <TextField
                id="title"
                label="제목"
                className="w-full border-gray-300 rounded-md px-4 py-2"
                onChange={(e) => setTitle(e.target.value)}
                variant="filled"
              />
            </div>
            <div className="mb-4">
              <TextField
                id="description"
                label="소개글"
                className="w-full border-gray-300 rounded-md px-4 py-2"
                onChange={(e) => setDescription(e.target.value)}
                variant="filled"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-accent-400 text-white px-3 py-2 rounded-md"
                onClick={handleNextClick}
              >
                일정 추가
              </button>
              <button type="button" className="ml-4 mr-4" onClick={onClose}>
                취소
              </button>
            </div>
          </form>
        </div>
      )}
      {step === 2 && (
        <CreateScheduleModal
          onClose={onClose}
          events={events}
          mentoringRoomId={mentoringRoomId}
        />
      )}
    </Popup>
  );
};

export default CreateRoomModal;
