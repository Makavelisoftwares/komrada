import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerChart } from "./_sub-components/customer-chart";
import { Globe2, LineChartIcon } from "lucide-react";

export const Cards = ({ title, number, price, icon }) => {
  return (
    <Card className="shadow-none  p-2 col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="text-lg">{title}</div>
          <div>{icon}</div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex font-bold text-2xl items-center justify-between">
          <div>{price ? price : <Globe2 className="text-fuchsia-500" />}</div>
          <div>
            {number >= 1000 && number < 1000000
              ? (number / 1000).toFixed(2) + "K"
              : number > 1000000
              ? (number / 1000000).toFixed(2) + "M"
              : number.toFixed(2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
