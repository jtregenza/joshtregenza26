interface MusingsIconProps {
  width?: string | number;
  height?: string | number;
}

export default function MusingsIcon({ width = "100%", height = "100%" }: MusingsIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 2202 1557"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M550.482 228.017C854.506 -76.0058 1347.43 -76.0058 1651.45 228.017L2201.93 778.5L1651.45 1328.98C1347.43 1633.01 854.506 1633.01 550.482 1328.98L0 778.5L550.482 228.017ZM1101.46 223C794.395 223 545.465 471.929 545.465 779C545.465 1086.07 794.395 1335 1101.46 1335C1408.54 1335 1657.46 1086.07 1657.46 779C1657.46 471.929 1408.54 223 1101.46 223Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M827.614 1063.75C676.15 912.286 676.15 666.714 827.614 515.25L1101.86 241.001L1376.11 515.25C1527.58 666.714 1527.58 912.286 1376.11 1063.75L1101.86 1338L827.614 1063.75ZM825.115 789.26C825.116 942.241 949.133 1066.26 1102.11 1066.26C1255.1 1066.26 1379.11 942.241 1379.11 789.26C1379.11 636.278 1255.1 512.261 1102.11 512.26C949.132 512.261 825.115 636.277 825.115 789.26Z" fill="currentColor"/>
    </svg>
  );
}