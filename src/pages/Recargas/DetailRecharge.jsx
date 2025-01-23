import { instanceWithToken } from "@/utils/instance";
import { NotebookText, RefreshCcwDot } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import CardComponent from "@/components/globals/CardComponent";
import LabelLateral from "@/components/globals/LabelLateral";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const DetailRecharge = () => {
  const { idrecarga } = useParams();
const [recharge, setRecharge] = useState("");


  const getRecharge = () => {
    instanceWithToken.get(`recharge/${idrecarga}`).then((result) => {
       setRecharge(result.data.data) 
      console.log(result.data.data);

    });
  };

  useEffect(() => {
    getRecharge();
  }, []);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <RefreshCcwDot className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">Detalle de Recarga</h1>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">  
        {/* Detalle de Recarga */}
        
        {/* CARD CLIENTE */}
        <CardComponent
          title={"Recarga"}
          description={"Informacion de la Recarga"}
          content={
            <>

            </>
          }
          contentFooter={
            <>
              <Button className="w-[100%]">Ver Cliente</Button>
            </>
          }
        />
        

      </div>
    </div>
  );
};

export default DetailRecharge;
