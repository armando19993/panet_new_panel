import { instanceWithToken } from "@/utils/instance";
import { NotebookText, RefreshCcwDot } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CardComponent from "@/components/globals/CardComponent";
import LabelLateral from "@/components/globals/LabelLateral";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const DetailRecharge = () => {
    const { idrecarga } = useParams();
    const [recharge, setRecharge] = useState("");

    const getRecharge = () => {
        instanceWithToken.get(`recharge/${idrecarga}`).then((result) => {
            setRecharge(result.data.data);
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Detalle de Recarga */}
                <CardComponent
                    title={"Recarga"}
                    contentFooter={
                        recharge.type == 'MANUAL' &&
                        <Dialog>
                            <DialogTrigger className="w-[100%]">
                                <Button className="w-[100%]">Ver Comprobante</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Comprobante de Recarga</DialogTitle>
                                    <DialogDescription>
                                        {recharge.comprobante ? (
                                            <img src={recharge.comprobante} className="h-[80vh]" />
                                        ) : (
                                            "Esta recarga aún no tiene comprobante asignado"
                                        )}
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    }
                    content={
                        <div>
                            <LabelLateral
                                title={"Id:"}
                                flexDirection="col"
                                description={recharge ? recharge.id : "No Posee"}
                            />
                            <LabelLateral
                                title={"Id Público:"}
                                description={recharge ? recharge.publicId : "No Posee"}
                            />
                            <LabelLateral
                                title={"Monto:"}
                                description={recharge ? recharge.amount + ' ' + recharge.wallet.country.currency : "No Posee"}
                            />
                            <LabelLateral
                                title={"Estado:"}
                                description={recharge ? recharge.status : "No Posee"}
                            />
                            <LabelLateral
                                title={"Tipo:"}
                                description={recharge ? recharge.type : "No Posee"}
                            />
                            {recharge.type == 'MANUAL' &&
                                <>
                                    <LabelLateral
                                        title={"Número de Referencia:"}
                                        description={recharge.nro_referencia || "No Posee"}
                                    />
                                    <LabelLateral
                                        title={"Fecha del Comprobante:"}
                                        description={recharge.fecha_comprobante || "No Posee"}
                                    />
                                    <LabelLateral
                                        title={"Comentario:"}
                                        description={recharge.comentario || "No Posee"}
                                    />
                                </>}
                            {recharge.type == 'AUTOMATIZADO' && <LabelLateral
                                title={"Pasatela de Cobro:"}
                                description={recharge.comentario || "No Posee"}
                            />}
                        </div>
                    }
                />

                {/* Detalle de Usuario */}
                <CardComponent
                    title={"Usuario"}
                    description={"Información del Usuario Asociado"}
                    content={
                        <>
                            <LabelLateral
                                title={"Nombre de Usuario:"}
                                description={recharge.user ? recharge.user.name : "No Posee"}
                            />
                            <LabelLateral
                                title={"Id Usuario:"}
                                description={recharge.user ? recharge.user.user : "No Posee"}
                            />
                            <LabelLateral
                                flexDirection="col"
                                title={"Wallet Id:"}
                                description={recharge ? recharge.walletId : "No Posee"}
                            />
                            <LabelLateral
                                title={'Pais'}
                                description={recharge?.wallet?.country ? recharge.wallet.country.name : 'No Posee'}
                            />
                        </>
                    }
                />
            </div>

            {recharge?.type !== 'MANUAL' && (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                    {/* Mostrar JSON de pasarela_response */}
                    <CardComponent
                        title="Respuesta de la Pasarela"
                        description="Información detallada de la pasarela asociada"
                        content={
                            <pre className="bg-gray-100 p-4 rounded-md overflow-auto">
                                {recharge?.pasarela_response
                                    ? JSON.stringify(JSON.parse(recharge.pasarela_response), null, 2)
                                    : "No hay respuesta de la pasarela disponible"}
                            </pre>
                        }
                    />
                </div>
            )}

        </div>
    );
};

export default DetailRecharge;
