import { Oval } from "react-loader-spinner";

export function DashboardLoader() {
  return (
    <div className="flex justify-center items-center h-full">
      <Oval
        height={80}
        width={80}
        color="#3B82F6"  // seu tom de azul
        secondaryColor="#F97316"  // seu laranja
        visible={true}
        ariaLabel="loading"
      />
    </div>
  );
}
