import { useEffect, useState } from 'react';

export default function TimerBar({ createdAt }) {
  const totalMs = 24 * 60 * 60 * 1000;
  const createdTime = new Date(createdAt).getTime();
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const elapsed = now - createdTime;
      const p = Math.min(100, Math.max(0, (elapsed / totalMs) * 100));
      setPercent(p);
    };

    update();
    const iv = setInterval(update, 60 * 1000); // update each minute
    return () => clearInterval(iv);
  }, [createdTime]);

  const checkpoints = [25, 50, 75].map(p => (
    <div
      key={p}
      className="absolute top-0 h-full w-[2px] bg-gray-600"
      style={{ left: `${p}%` }}
    />
  ));

  return (
    <div className="relative w-full h-3 bg-gray-700 rounded-xl overflow-hidden mt-2">
      <div
        className="h-full bg-green-500 transition-all duration-1000"
        style={{ width: `${percent}%` }}
      />
      {checkpoints}
    </div>
  );
}
