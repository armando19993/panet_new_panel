import { instanceWithToken } from "@/utils/instance";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { NotebookText, Eye, NotepadText } from "lucide-react";
import CardComponent from "@/components/globals/CardComponent";
import LabelLateral from "@/components/globals/LabelLateral";
import { Button } from "@/components/ui/button";
import UltimasTransacciones from "@/components/globals/historiales/UltimasTransacciones";
import UltimasRecargas from "@/components/globals/historiales/UltimasRecargas";
import TooltipDate from "@/components/globals/micro/TooltipDate";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DetailTransactionPage = () => {
  const { idtrasaction } = useParams();
  const [transaction, setTransaction] = useState("");

  const getTransactions = () => {
    instanceWithToken.get(`transaction/${idtrasaction}`).then((result) => {
      setTransaction(result.data.data);
      console.log(result.data.data);
    });
  };

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <NotebookText className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">
            Detalle de Transacciones
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Detalle de transaccion */}

        <CardComponent
          title={"Transaction"}
          contentFooter={
            <Dialog>
              <DialogTrigger>Ver Comprobante</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Comprobante de Envio</DialogTitle>
                  <DialogDescription>
                    {
                      transaction.comprobante !== '0' ? <image src={transaction.comprobante} />:"Esta Transaccion aun no tiene Comprobante Asignado"
                    }
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          }
          content={
            <div className="">
              <LabelLateral
                title={"Id:"}
                flexDirection="col"
                description={transaction ? transaction.id : "No Posee"}
              />
              <LabelLateral
                title={"Id Publico:"}
                description={
                  transaction.cliente
                    ? transaction.cliente.publicId
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Fecha Creacion:"}
                description={
                  transaction ? (
                    <TooltipDate date={transaction.createdAt} />
                  ) : (
                    "No Posee"
                  )
                }
              />
              <LabelLateral
                title={"Fecha Actualizacion:"}
                description={
                  transaction ? (
                    <TooltipDate date={transaction.updatedAt} />
                  ) : (
                    "No Posee"
                  )
                }
              />
              <LabelLateral
                title={"Estatus:"}
                description={transaction ? transaction.status : "No Posee"}
              />
            </div>
          }
        />
        {/* Detalle de Creador */}
        <CardComponent
          title={"Creador"}
          content={
            <>
              <LabelLateral
                title={"Id:"}
                description={
                  transaction.creador
                    ? transaction.creador.publicId
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Nombre:"}
                description={
                  transaction.creador ? transaction.creador.name : "No Posee"
                }
              />
              <LabelLateral
                title={"Usuario:"}
                description={
                  transaction.creador ? transaction.creador.user : "No Posee"
                }
              />
              <LabelLateral
                title={"Telefono:"}
                description={
                  transaction.creador ? transaction.creador.phone : "No Posee"
                }
              />
            </>
          }
        />
        {/* Detalle de Despachador */}
        <CardComponent
          title={"Despachador"}
          content={
            <>
              <LabelLateral
                title={"Id:"}
                description={
                  transaction.despachador
                    ? transaction.despachador.publicId
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Nombre:"}
                description={
                  transaction.despachador
                    ? transaction.despachador.name
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Usuario:"}
                description={
                  transaction.despachador
                    ? transaction.despachador.user
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Telefono:"}
                description={
                  transaction.despachador
                    ? transaction.despachador.phone
                    : "No Posee"
                }
              />
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* CARD CLIENTE */}
        <CardComponent
          title={"Cliente"}
          description={"Informacion del Cliente"}
          content={
            <>
              <LabelLateral
                title={"Numero de Documento"}
                description={
                  transaction.cliente
                    ? transaction.cliente.document
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Nombre"}
                description={
                  transaction.cliente ? transaction.cliente.name : "No Posee"
                }
              />
              <LabelLateral
                title={"Telefono"}
                description={
                  transaction.cliente ? transaction.cliente.phone : "No Posee"
                }
              />
            </>
          }
          contentFooter={
            <>
              <Button className="w-[100%]">Ver Cliente</Button>
            </>
          }
        />

        {/* CARD DATOS ORIGEN */}
        <CardComponent
          title={"Origen"}
          description={"Informacion de Transaccion"}
          content={
            <>
              <LabelLateral
                title={"Pais:"}
                description={
                  transaction.origen ? transaction.origen.name : "No Posee"
                }
              />
              <LabelLateral
                title={"Monto:"}
                description={transaction ? transaction.montoOrigen : "No Posee"}
              />
              <LabelLateral
                title={"Moneda:"}
                description={
                  transaction ? transaction.monedaOrigen : "No Posee"
                }
              />
            </>
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* CARD DATOS DESTINO */}
        <CardComponent
          title={"Destino"}
          description={"Informacion de Transaccion"}
          content={
            <>
              <LabelLateral
                title={"Pais:"}
                description={
                  transaction.destino ? transaction.destino.name : "No Posee"
                }
              />
              <LabelLateral
                title={"Monto:"}
                description={
                  transaction ? transaction.montoDestino : "No Posee"
                }
              />
              <LabelLateral
                title={"Moneda:"}
                description={
                  transaction ? transaction.monedaDestino : "No Posee"
                }
              />
              <LabelLateral
                title={"Tasa:"}
                description={transaction ? transaction.montoTasa : "No Posee"}
              />
            </>
          }
        />

        {/* CARD DATOS INSTRUMENTO */}
        <CardComponent
          title={"Instrumento"}
          description={"Informacion del Instrumento de Pago"}
          content={
            <div className="">
              <LabelLateral
                title={"Titular:"}
                description={
                  transaction.instrument
                    ? transaction.instrument.holder
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Tipo:"}
                description={
                  transaction.instrument
                    ? transaction.instrument.typeInstrument
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Banco:"}
                description={
                  transaction.instrument
                    ? transaction.instrument.bank.name
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Nro de Cuenta:"}
                description={
                  transaction.instrument
                    ? transaction.instrument.accountNumber
                    : "No Posee"
                }
              />
              <LabelLateral
                title={"Id Transaccion:"}
                description={
                  transaction.instrument
                    ? transaction.instrument.publicId
                    : "No Posee"
                }
              />
            </div>
          }
          contentFooter={
            <>
              <Button className="w-[100%]">Editar Instrumento</Button>
            </>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Detalle de transaccion */}
        <UltimasTransacciones
          transacciones={
            transaction.cliente ? transaction.cliente.Transaction : []
          }
        />
        <UltimasRecargas
          recargas={transaction.recargas ? transaction.cliente.recargas : []}
        />
      </div>
    </div>
  );
};

export default DetailTransactionPage;
