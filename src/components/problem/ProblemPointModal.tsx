import React, { Component } from 'react';
import { useState } from "react";

import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { memberInfoState } from 'recoil/userState';
import { axiosInstance } from 'apis/axiosConfig';

interface ModalProps {
  title: string;
  point: number;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, point, isOpen, onClose }) => {
  const location = useLocation();
  const [visible, setVisible] = useState(isOpen);
  const navigate = useNavigate();

  
  const content = 100;
  const [totalPoint, setTotalPoint] = useState(content + point); // 합산된 점수 값 저장
  const { memberInfo, memberId, isLoggedIn } = useRecoilValue(memberInfoState);

  const [pointAdd, setPointAdd] = useState(0);

  const navigateToList = () => {
    navigate("/problem");
  };

  const saveSolution = async () => {
    try {
      const request = {
        problemId: location.state.problemId,
        solver: memberInfo.nickname,
      };
      const response = await axiosInstance.post(`/api/solution`, request);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClose = () => {
    if (title === "정답입니다!") {
      saveSolution();
    }
    setVisible(false);
    onClose();
  };


  return visible ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="relative z-10 w-11/12 max-w-md p-6 mx-auto bg-white rounded-md shadow-lg ">
        <div className="mt-4">
          <h2 className="text-lg font-medium leading-6 text-gray-900">
            {title}
          </h2>
          <div className="mt-4">
            <p className="text-l text-gray-500">
              점수 {point} 점 획득 
            </p>
          </div>
        </div>

        <div className="flex-col gap-2 mt-5 sm:mt-6">
          <div className="flex flex-row justify-between">
            <button
              type="button"
              className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm mr-2"
              onClick={navigateToList}
            >
              문제 리스트로 이동
            </button>
            <button
              type="button"
              className="flex-1 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm ml-2"
              onClick={handleClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Modal;

