import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const ApplicationStatusCard = ({
  status,
  count,
  bgColor,
  textColor,
  hoverColor,
  outlineColor,
  isSelected,
  onClick,
}) => {
  return (
    <Card
      className={`flex-1 md:w-1/4 ${bgColor} ${textColor} flex justify-center items-center cursor-pointer ${hoverColor} transition-colors duration-200 ${
        isSelected ? `outline outline-3 ${outlineColor}` : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-1 md:p-4">
        <span className="font-semibold">{status}</span>: {count}
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusCard;
