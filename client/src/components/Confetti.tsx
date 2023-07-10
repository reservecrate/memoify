import { Button } from '@nextui-org/react';
import confetti from 'canvas-confetti';

const Confetti = () => {
  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 400
    });
  };
  return (
    <Button color='gradient' onPressStart={handleConfetti}>
      click me for confetti!
    </Button>
  );
};

export default Confetti;
