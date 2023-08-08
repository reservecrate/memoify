import { useState, useContext } from 'react';
import { AppContext } from '../../App';
import IMemo from '../../interfaces/Memo';

const CreateMemoModal = ({
  isOpen,
  onClose,
  memo
}): { isOpen: boolean; onClose: () => void; memo: IMemo } => {
  const { loggedInUser } = useContext(AppContext);

  return <div></div>;
};
