import React from "react";

interface LogoProps {
  variant?: "emblem" | "icon" | "full" | "horizontal";
  className?: string;
  size?: number;
  light?: boolean;
  bg?: "white" | "transparent" | "none";
}

export default function Logo({
  variant = "emblem",
  className = "",
  size,
  light = false,
  bg = "white",
}: LogoProps) {
  // Brand colors
  const forestColor = "#133E2B";
  const goldColor = "#BC9C4F";
  
  // Outer text color/icon fill behavior if not using white badge background
  const finalForest = (light && bg !== "white") ? "#FFFFFF" : forestColor;
  const finalGold = goldColor;
  const hasWhiteBg = bg === "white";

  if (variant === "horizontal") {
    const iconSize = size || 42;
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 rounded-full overflow-hidden"
        >
          {/* Circular Background */}
          {hasWhiteBg && <circle cx="200" cy="200" r="200" fill="#FFFFFF" />}
          
          {/* Double Gold Circle */}
          <circle cx="200" cy="200" r="185" stroke={finalGold} strokeWidth="5" />
          <circle cx="200" cy="200" r="172" stroke={finalGold} strokeWidth="2.5" />

          {/* Serif "H" */}
          <path
            d="M 155,100 L 195,100 L 195,108 L 187,108 L 187,150 L 213,150 L 213,108 L 205,108 L 205,100 L 245,100 L 245,108 L 237,108 L 237,212 L 245,212 L 245,220 L 205,220 L 205,212 L 213,212 L 213,165 L 187,165 L 187,212 L 195,212 L 195,220 L 155,220 L 155,212 L 163,212 L 163,108 L 155,108 Z"
            fill={finalForest}
          />

          {/* Waves / Swooshes */}
          <path
            d="M 125,150 C 130,195 185,215 228,198 C 215,208 175,208 140,185 C 125,175 118,162 125,150 Z"
            fill={finalForest}
          />
          <path
            d="M 115,175 C 120,205 165,225 210,210 C 190,218 150,215 128,195 C 118,188 112,182 115,175 Z"
            fill={finalForest}
          />

          {/* Sea Turtle */}
          <g transform="translate(245, 155) rotate(-10)">
            {/* Flippers & Head */}
            <path d="M 32,-5 C 38,-10 42,-5 42,2 C 42,8 35,10 30,5 Z" fill={finalForest} />
            <path d="M 10,12 C 12,25 5,42 -10,40 C -8,30 2,20 8,10 Z" fill={finalForest} />
            <path d="M 15,-12 C 18,-25 12,-35 2,-32 C 3,-22 8,-15 12,-10 Z" fill={finalForest} />
            <path d="M -15,12 C -20,20 -28,18 -24,10 Z" fill={finalForest} />
            <path d="M -15,-12 C -20,-20 -28,-18 -24,-10 Z" fill={finalForest} />
            <path d="M -22,0 L -28,-2 L -26,2 Z" fill={finalForest} />
            {/* Carapace */}
            <ellipse cx="0" cy="0" rx="26" ry="19" fill={finalForest} stroke={hasWhiteBg ? "#FFFFFF" : (light ? forestColor : "#FFFFFF")} strokeWidth="1.5" />
            <path
              d="M -20,0 L 20,0 M -12,-14 C -5,-8 5,-8 12,-14 M -12,14 C -5,8 5,8 12,14 M -12,-14 L -20,0 L -12,14 M 12,-14 L 20,0 L 12,14 M -5,-8 L -5,8 M 5,-8 L 5,8"
              stroke={hasWhiteBg ? "#FFFFFF" : (light ? forestColor : "#FFFFFF")}
              strokeWidth="1.2"
              fill="none"
            />
          </g>
        </svg>

        <div className="flex flex-col text-left">
          <span
            className="font-sans font-extrabold tracking-wider leading-tight uppercase"
            style={{
              color: light ? "#FFFFFF" : forestColor,
              fontSize: size ? `${size * 0.45}px` : "18px",
            }}
          >
            HAZI TOURS
          </span>
          <span
            className="uppercase tracking-[0.22em] font-bold text-gold"
            style={{
              fontSize: size ? `${size * 0.2}px` : "8px",
              marginTop: "-2px",
            }}
          >
            HIKKADUWA SRI LANKA
          </span>
        </div>
      </div>
    );
  }

  // default to circular / badge variants
  const defaultSize = size || 180;

  return (
    <div
      className={`inline-flex flex-col items-center justify-center text-center ${className}`}
      style={{ width: defaultSize, height: defaultSize }}
    >
      <svg
        width={defaultSize}
        height={defaultSize}
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto rounded-full overflow-hidden"
      >
        {/* Circular Background */}
        {hasWhiteBg && <circle cx="200" cy="200" r="200" fill="#FFFFFF" />}

        {/* Double Gold Circle */}
        <circle cx="200" cy="200" r="185" stroke={finalGold} strokeWidth="5" />
        <circle cx="200" cy="200" r="172" stroke={finalGold} strokeWidth="2.5" />

        {/* Serif "H" */}
        <path
          d="M 155,100 L 195,100 L 195,108 L 187,108 L 187,150 L 213,150 L 213,108 L 205,108 L 205,100 L 245,100 L 245,108 L 237,108 L 237,212 L 245,212 L 245,220 L 205,220 L 205,212 L 213,212 L 213,165 L 187,165 L 187,212 L 195,212 L 195,220 L 155,220 L 155,212 L 163,212 L 163,108 L 155,108 Z"
          fill={finalForest}
        />

        {/* Waves / Swooshes */}
        <path
          d="M 125,150 C 130,195 185,215 228,198 C 215,208 175,208 140,185 C 125,175 118,162 125,150 Z"
          fill={finalForest}
        />
        <path
          d="M 115,175 C 120,205 165,225 210,210 C 190,218 150,215 128,195 C 118,188 112,182 115,175 Z"
          fill={finalForest}
        />

        {/* Sea Turtle */}
        <g transform="translate(245, 155) rotate(-10)">
          {/* Flippers & Head */}
          <path d="M 32,-5 C 38,-10 42,-5 42,2 C 42,8 35,10 30,5 Z" fill={finalForest} />
          <path d="M 10,12 C 12,25 5,42 -10,40 C -8,30 2,20 8,10 Z" fill={finalForest} />
          <path d="M 15,-12 C 18,-25 12,-35 2,-32 C 3,-22 8,-15 12,-10 Z" fill={finalForest} />
          <path d="M -15,12 C -20,20 -28,18 -24,10 Z" fill={finalForest} />
          <path d="M -15,-12 C -20,-20 -28,-18 -24,-10 Z" fill={finalForest} />
          <path d="M -22,0 L -28,-2 L -26,2 Z" fill={finalForest} />
          {/* Carapace */}
          <ellipse cx="0" cy="0" rx="26" ry="19" fill={finalForest} stroke={hasWhiteBg ? "#FFFFFF" : (light ? forestColor : "#FFFFFF")} strokeWidth="1.5" />
          <path
            d="M -20,0 L 20,0 M -12,-14 C -5,-8 5,-8 12,-14 M -12,14 C -5,8 5,8 12,14 M -12,-14 L -20,0 L -12,14 M 12,-14 L 20,0 L 12,14 M -5,-8 L -5,8 M 5,-8 L 5,8"
            stroke={hasWhiteBg ? "#FFFFFF" : (light ? forestColor : "#FFFFFF")}
            strokeWidth="1.2"
            fill="none"
          />
        </g>

        {/* Text Inside Circular Emblem if variant is "emblem" */}
        {variant === "emblem" && (
          <>
            <text
              x="200"
              y="285"
              textAnchor="middle"
              fill={finalForest}
              fontSize="34"
              fontWeight="900"
              fontFamily="'Inter', 'Montserrat', 'Helvetica Neue', sans-serif"
              letterSpacing="1.5"
            >
              HAZI TOURS
            </text>
            <text
              x="200"
              y="318"
              textAnchor="middle"
              fill={finalGold}
              fontSize="16"
              fontWeight="700"
              fontFamily="'Inter', 'Montserrat', sans-serif"
              letterSpacing="3"
            >
              HIKKADUWA SRI LANKA
            </text>
          </>
        )}
      </svg>
    </div>
  );
}
