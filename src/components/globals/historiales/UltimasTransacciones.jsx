import React, { useEffect } from 'react'
import CardComponent from '../CardComponent'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'


const UltimasTransacciones = ({ transacciones }) => {

  const statusStyles = {
    COMPLETADA: 'bg-green-100 text-green-800 border-green-300 hover:bg-green-100/80',
    CANCELADA: 'bg-red-100 text-red-800 border-red-300 hover:bg-red-100/80',
    CREADA: 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-100/80',
    ANULADA: 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-100/80',
  };

  useEffect(() => {
    console.log(transacciones)
  }, [transacciones])

  return (
    <CardComponent
      title={"Ultimas Transacciones"}
      content={<div className="">

        <Table>
          <TableCaption>Listado de tus ultiumas transacciones</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Id</TableHead>
              <TableHead>Monto Origen</TableHead>
              <TableHead>Monto Destino</TableHead>
              <TableHead className="text-right">Estado</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transacciones.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{record.publicId}</TableCell>
                <TableCell>{record.montoOrigen} {record.monedaOrigen}</TableCell>
                <TableCell>{record.montoDestino} {record.monedaDestino}</TableCell>
                <TableCell className="text-right">

                  <Badge className={statusStyles[record.status]}>
                    {record.status}
                  </Badge>

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>


      </div>}
    />
  )
}

export default UltimasTransacciones