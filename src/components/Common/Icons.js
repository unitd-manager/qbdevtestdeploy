// src/components/Icons.jsx
import React from "react";

/* ---------- Arrow Right ---------- */
export const ArrowRight = React.forwardRef(function ArrowRight(props, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 17 17"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <path
        d="M6.5 12.5333L10.5 8.53333L6.5 4.53332"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const ArrowLeft = React.forwardRef(function ArrowRight(props, ref) {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" fill="none">
  <path d="M5 4L1.5 7.5L5 11" stroke="black" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
});

export const ArrowLeftWhite = React.forwardRef(function ArrowRight(props, ref) {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 15 15" fill="none">
  <path d="M5 4L1.5 7.5L5 11" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
});

export const ArrowNavRight = React.forwardRef(function ArrowRight(props, ref) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M11.25 22.5L18.75 15L11.25 7.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});

export const ArrowNavLeft = React.forwardRef(function ArrowRight(props, ref) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none">
      <path d="M18.75 7.5L11.25 15L18.75 22.5" stroke="white"  strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
});


export const ArrowDown = React.forwardRef(function ArrowRight(props, ref) {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="12" height="7" viewBox="0 0 12 7" fill="none">
  <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
  );
});

export const ArrowUp = React.forwardRef(function ArrowUp(props, ref) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="7"
      viewBox="0 0 12 7"
      fill="none"
      ref={ref}
      {...props}
    >
      <path
        d="M1 6L6 1L11 6"
        stroke="black"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const LiIcon = React.forwardRef(function ArrowUp(props, ref) {
  return (
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
  <circle cx="9" cy="9" r="5" fill="#FF7705"/>
  <circle cx="9" cy="9" r="7" stroke="#FF7705" strokeOpacity="0.3" strokeWidth="4"/>
</svg>
  );
});

/* ---------- Instagram ---------- */
export const Instagram = React.forwardRef(function Instagram(props, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="6" r="1.5" fill="currentColor" />
    </svg>
  );
});

/* ---------- LinkedIn ---------- */
export const Linkedin = React.forwardRef(function Linkedin(props, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <path
        d="M4.98 3.5A2.49 2.49 0 1 1 4.98 8.48 2.49 2.49 0 0 1 4.98 3.5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M2.5 9H7.5V21H2.5V9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M10 9H14.5V11.8C15.4 10.3 17 9 19.5 9C23 9 24 11.3 24 15.2V21H19V15.7C19 14 18.5 13 17 13C15.5 13 14.5 14 14.5 15.7V21H10V9Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
});

/* ---------- X / Twitter ---------- */
export  const XLogo = React.forwardRef(function XLogo(props, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      {...props}
    >
      <path
        d="M3 3L21 21M21 3L3 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

