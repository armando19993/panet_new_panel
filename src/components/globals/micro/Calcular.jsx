import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import LabelLateral from '../LabelLateral';
import { Label } from '@/components/ui/label';

const Calcular = ({
  amountSend,
  setAmountSend,
  amountReceive,
  setAmountReceive,
  dataTasa,
}) => {
  const [calculationDirection, setCalculationDirection] = useState('send-to-receive'); // Dirección del cálculo

  // Función de cálculo adaptada para manejar ambas direcciones
  const calculo = () => {
    let amount = 0;

    // Verifica si amountSend fue editado
    if (amountSend && calculationDirection === 'send-to-receive') {
      if (dataTasa.origin.name !== "VENEZUELA" && dataTasa.origin.name !== "COLOMBIA") {
        amount = amountSend * dataTasa.amount;
      } else {
        amount = amountSend * dataTasa.amount;
      }

      if (dataTasa.origin.name === "VENEZUELA" && dataTasa.destination.name === "COLOMBIA") {
        amount = amountSend * dataTasa.amount;
      }
      if (dataTasa.origin.name === "VENEZUELA" && dataTasa.destination.name !== "COLOMBIA") {
        amount = amountSend / dataTasa.amount;
      }

      if (dataTasa.origin.name === "COLOMBIA" && dataTasa.destination.name === "VENEZUELA") {
        amount = amountSend / dataTasa.amount;
      }
      amount = amount.toFixed(2);
      setAmountReceive(amount);
    }

    // Verifica si amountReceive fue editado
    if (amountReceive && calculationDirection === 'receive-to-send') {
      if (dataTasa.origin.name !== "VENEZUELA" && dataTasa.origin.name !== "COLOMBIA") {
        amount = amountReceive / dataTasa.amount;
      } else {
        amount = amountReceive / dataTasa.amount;
      }

      if (dataTasa.origin.name === "VENEZUELA" && dataTasa.destination.name === "COLOMBIA") {
        amount = amountReceive / dataTasa.amount;
      }
      if (dataTasa.origin.name === "VENEZUELA" && dataTasa.destination.name !== "COLOMBIA") {
        amount = amountReceive * dataTasa.amount;
      }

      if (dataTasa.origin.name === "COLOMBIA" && dataTasa.destination.name === "VENEZUELA") {
        amount = amountReceive * dataTasa.amount;
      }
      amount = amount.toFixed(2);
      setAmountSend(amount);
    }
  };

  // Ejecutar el cálculo cuando se pierde el foco en los campos
  const handleBlur = () => {
    calculo();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculo</CardTitle>
      </CardHeader>

      <CardContent>
        <Label>Monto a Enviar</Label>
        <Input
          value={amountSend}
          onChange={(e) => {
            setAmountSend(e.target.value);
            setCalculationDirection('send-to-receive'); // Establecer la dirección cuando se edita el monto enviado
          }}
          onBlur={handleBlur} // Ejecutar el cálculo al salir del campo
          placeholder="Monto a Enviar"
          className="mb-1 mt-2"
        />

        <Label>Monto a Recibir</Label>
        <Input
          value={amountReceive}
          onChange={(e) => {
            setAmountReceive(e.target.value);
            setCalculationDirection('receive-to-send'); // Establecer la dirección cuando se edita el monto recibido
          }}
          onBlur={handleBlur} // Ejecutar el cálculo al salir del campo
          placeholder="Monto a Recibir"
          className="mb-1 mt-2"
        />

        <LabelLateral title={"Tasa de Calculo:"} description={dataTasa?.amount} />
      </CardContent>
    </Card>
  );
};

export default Calcular;