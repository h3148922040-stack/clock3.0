
import React, { useState } from 'react';

interface GearProps {
  teeth: number;
  radius: number;
  rotation: number;
  color: string;
  x: number;
  y: number;
  label?: string;
  description?: string;
  isFocused?: boolean;
  isDimmed?: boolean;
  isSkeleton?: boolean;
  onHover?: (desc: string | null, label?: string) => void;
}

const Gear: React.FC<GearProps> = ({ 
  teeth, radius, rotation, color, x, y, label, description, 
  isFocused, isDimmed, isSkeleton, onHover 
}) => {
  const [internalHover, setInternalHover] = useState(false);
  
  const toothHeight = radius * 0.2;
  const innerRadius = radius - toothHeight * 0.5;
  const outerRadius = radius + toothHeight * 0.5;
  const hubRadius = radius * 0.15;
  const rimWidth = isSkeleton ? radius * 0.2 : radius * 0.3; // Wider rim for easier hovering
  
  const points: string[] = [];
  const angleStep = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const angle = i * angleStep;
    const p1 = `${x + Math.cos(angle - angleStep * 0.25) * innerRadius},${y + Math.sin(angle - angleStep * 0.25) * innerRadius}`;
    const p2 = `${x + Math.cos(angle - angleStep * 0.12) * outerRadius},${y + Math.sin(angle - angleStep * 0.12) * outerRadius}`;
    const p3 = `${x + Math.cos(angle + angleStep * 0.12) * outerRadius},${y + Math.sin(angle + angleStep * 0.12) * outerRadius}`;
    const p4 = `${x + Math.cos(angle + angleStep * 0.25) * innerRadius},${y + Math.sin(angle + angleStep * 0.25) * innerRadius}`;
    points.push(p1, p2, p3, p4);
  }

  const gradientId = `grad-${teeth}-${radius}-${color.replace('#', '')}`;
  const displayOpacity = isFocused ? 1 : (isDimmed ? 0.2 : 0.8);
  const active = internalHover || isFocused;

  return (
    <g 
      style={{ cursor: 'pointer', opacity: displayOpacity, transition: 'opacity 0.4s ease' }}
      onMouseEnter={() => { setInternalHover(true); onHover?.(description || null, label); }}
      onMouseLeave={() => { setInternalHover(false); onHover?.(null); }}
    >
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity={active ? "0.6" : "0.3"} />
          <stop offset="50%" stopColor={color} />
          <stop offset="100%" stopColor="black" stopOpacity="0.4" />
        </radialGradient>
      </defs>

      {/* DYNAMIC HIT AREA: Ring shape for skeleton gears allows hovering layers beneath */}
      {isSkeleton ? (
        <path
          d={`
            M ${x + (radius + 10)}, ${y}
            A ${radius + 10} ${radius + 10} 0 1 0 ${x - (radius + 10)}, ${y}
            A ${radius + 10} ${radius + 10} 0 1 0 ${x + (radius + 10)}, ${y}
            M ${x + (radius - rimWidth)}, ${y}
            A ${radius - rimWidth} ${radius - rimWidth} 0 1 1 ${x - (radius - rimWidth)}, ${y}
            A ${radius - rimWidth} ${radius - rimWidth} 0 1 1 ${x + (radius - rimWidth)}, ${y}
          `}
          fill="transparent"
          fillRule="evenodd"
          stroke="none"
        />
      ) : (
        <circle cx={x} cy={y} r={radius + 10} fill="transparent" stroke="none" />
      )}

      <g style={{ 
        transform: `rotate(${rotation}deg)`, 
        transformOrigin: `${x}px ${y}px`, 
        transition: 'transform 0.05s linear'
      }}>
        {active && (
          <polygon
            points={points.join(' ')}
            fill="none"
            stroke="rgba(251, 191, 36, 0.5)"
            strokeWidth="10"
            style={{ filter: 'blur(6px)' }}
          />
        )}

        <path
          d={`
            M ${points[0]} 
            ${points.slice(1).map(p => `L ${p}`).join(' ')} 
            Z
            ${isSkeleton ? `
              M ${x + (radius - rimWidth)}, ${y}
              A ${radius - rimWidth} ${radius - rimWidth} 0 1 0 ${x - (radius - rimWidth)}, ${y}
              A ${radius - rimWidth} ${radius - rimWidth} 0 1 0 ${x + (radius - rimWidth)}, ${y}
            ` : ''}
          `}
          fillRule="evenodd"
          fill={`url(#${gradientId})`}
          stroke="rgba(0,0,0,0.3)"
          strokeWidth="1"
        />

        {[0, 60, 120, 180, 240, 300].map(angle => (
          <rect
            key={angle}
            x={x - (radius * 0.04)}
            y={y - (radius * 0.95)}
            width={radius * 0.08}
            height={radius * 0.9}
            fill={`url(#${gradientId})`}
            style={{ transform: `rotate(${angle}deg)`, transformOrigin: `${x}px ${y}px` }}
          />
        ))}

        <circle cx={x} cy={y} r={hubRadius} fill={`url(#${gradientId})`} stroke="rgba(0,0,0,0.4)" strokeWidth="1" />
        <circle cx={x} cy={y} r={hubRadius * 0.3} fill="#2d2016" />
      </g>

      {label && (
        <text
          x={x}
          y={y + radius + 18}
          textAnchor="middle"
          fill={active ? "#92400e" : "#4a3728"}
          className="text-[10px] font-bold select-none transition-colors"
        >
          {label}
        </text>
      )}
    </g>
  );
};

export default Gear;
