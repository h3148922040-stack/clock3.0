
import React from 'react';

const ClockFace: React.FC<{ size: number }> = ({ size }) => {
  const center = size / 2;
  const radius = size / 2 - 20;

  return (
    <g className="pointer-events-none">
      {/* Outer Rim */}
      <circle cx={center} cy={center} r={radius} fill="none" stroke="#4a3728" strokeWidth="8" />
      <circle cx={center} cy={center} r={radius - 10} fill="rgba(255,255,255,0.3)" stroke="#4a3728" strokeWidth="2" />

      {/* Ticks */}
      {[...Array(60)].map((_, i) => {
        const isMajor = i % 5 === 0;
        const length = isMajor ? 15 : 8;
        const angle = (i * 6 * Math.PI) / 180;
        const x1 = center + Math.cos(angle) * (radius - 15);
        const y1 = center + Math.sin(angle) * (radius - 15);
        const x2 = center + Math.cos(angle) * (radius - 15 - length);
        const y2 = center + Math.sin(angle) * (radius - 15 - length);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#4a3728"
            strokeWidth={isMajor ? 3 : 1}
          />
        );
      })}

      {/* Numbers */}
      {[...Array(12)].map((_, i) => {
        const num = i === 0 ? 12 : i;
        const angle = ((i * 30 - 90) * Math.PI) / 180;
        const x = center + Math.cos(angle) * (radius - 45);
        const y = center + Math.sin(angle) * (radius - 45);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            alignmentBaseline="middle"
            fill="#4a3728"
            className="text-2xl font-bold select-none"
          >
            {num}
          </text>
        );
      })}
    </g>
  );
};

export default ClockFace;
