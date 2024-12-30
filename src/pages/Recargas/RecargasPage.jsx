import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Wallet, Pencil, Trash2, Plus, Search, Tag, TicketCheck } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const RecargasPage = () => {
    const [recargas, setRecargas] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [ticketOpen, setTicketOpen] = useState(false);
    const [selectedRecarga, setSelectedRecarga] = useState(null);
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState({ wallet: "", status: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [comprobanteOpen, setComprobanteOpen] = useState(false)
    const [formData, setFormData] = useState({
        amount: "",
        walletId: "",
        type: "MANUAL",
        status: "CREADA",
        comprobante: null,
        comentario: "",
        nro_referencia: "",
        fecha_comprobante: null
    });

    const statusOptions = ["CREADA", "CANCELADA", "COMPLETADA"];

    const statusStyles = {
        COMPLETADA: "bg-green-100 text-green-800 border-green-300",
        CANCELADA: "bg-red-100 text-red-800 border-red-300",
        CREADA: "bg-yellow-100 text-yellow-800 border-yellow-300"
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm({ ...searchTerm, [name]: value });
    };

    const formatCurrency = (amount, currency = "PEN") => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-PE');
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            if (editIndex !== null) {
                const recargaId = recargas[editIndex].id;
                await instanceWithToken.patch(`recharge/${recargaId}`, formData);
                toast.success("Recarga actualizada correctamente");
            } else {
                await instanceWithToken.post("recharge", formData);
                toast.success("Recarga creada correctamente");
            }
            await getRecargas();
            setIsOpen(false);
            resetForm();
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Ocurrió un error inesperado");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            amount: "",
            walletId: "",
            type: "MANUAL",
            status: "CREADA",
            comprobante: null,
            comentario: "",
            nro_referencia: "",
            fecha_comprobante: null
        });
        setEditIndex(null);
    };

    const handleEdit = (index) => {
        setEditIndex(index);
        setFormData(recargas[index]);
        setIsOpen(true);
    };

    const handlreComprobante = (index) => {
        setEditIndex(index);
        setFormData(recargas[index]);
        setComprobanteOpen(true);
    };

    const getRecargas = async () => {
        try {
            const result = await instanceWithToken.get("recharge");
            setRecargas(result.data.data);
        } catch (error) {
            toast.error("Error al cargar la lista de recargas");
        }
    };

    const handleViewTicket = (recarga) => {
        setSelectedRecarga(recarga);
        setTicketOpen(true);
    };

    const Ticket = ({ recarga }) => {
        if (!recarga) return null;

        return (
            <Card className="p-6 space-y-4 max-w-md mx-auto">
                <div className="text-center border-b pb-4">
                    <h2 className="text-2xl font-bold">Recibo de Recarga</h2>
                    <p className="text-gray-500">REC-2025-{recarga.publicId || 'N/A'}</p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="font-semibold">Fecha:</span>
                        <span>{recarga.createdAt ? formatDate(recarga.createdAt) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Wallet ID:</span>
                        <span>{recarga.wallet?.consumer_id || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Monto:</span>
                        <span>{recarga.amount ? formatCurrency(recarga.amount, recarga.wallet?.country?.currency) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">Estado:</span>
                        <Badge className={statusStyles[recarga.status] || ''}>
                            {recarga.status || 'N/A'}
                        </Badge>
                    </div>
                    {recarga.nro_referencia && (
                        <div className="flex justify-between">
                            <span className="font-semibold">Referencia:</span>
                            <span>{recarga.nro_referencia}</span>
                        </div>
                    )}
                    {recarga.comentario && (
                        <div className="flex flex-col gap-1">
                            <span className="font-semibold">Comentario:</span>
                            <span className="text-gray-600">{recarga.comentario}</span>
                        </div>
                    )}

                </div>
            </Card>
        );
    };


    useEffect(() => {
        getRecargas();
    }, []);

    const filteredRecargas = recargas.filter((recarga) => {
        const walletId = recarga.wallet?.consumer_id || ""; // Si `wallet` es null, usa una cadena vacía
        const walletMatch = walletId.toLowerCase().includes(searchTerm.wallet.toLowerCase());
        const statusMatch = !searchTerm.status || recarga.status === searchTerm.status;

        return walletMatch && statusMatch;
    });



    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold">Administración de Recargas</h1>
                </div>
            </div>

            {/* Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        className="pl-10 w-full"
                        placeholder="Buscar por ID de wallet..."
                        name="wallet"
                        value={searchTerm.wallet}
                        onChange={handleSearchChange}
                    />
                </div>
                <select
                    name="status"
                    value={searchTerm.status}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                >
                    <option value="">Todos los estados</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[100px] font-semibold">ID</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">Wallet</TableHead>
                            <TableHead className="min-w-[120px] font-semibold">Monto</TableHead>
                            <TableHead className="min-w-[120px] font-semibold">Estado</TableHead>
                            <TableHead className="min-w-[180px] font-semibold">Fecha</TableHead>
                            <TableHead className="min-w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredRecargas.map((recarga, index) => (
                            <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell className="font-medium">REC-2025-{recarga.publicId}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span>{recarga.wallet.consumer_id}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {recarga.wallet.country.currency}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>{recarga.amount} {recarga.wallet.country.currency}</TableCell>
                                <TableCell>
                                    <Badge className={statusStyles[recarga.status]}>
                                        {recarga.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{formatDate(recarga.createdAt)}</TableCell>
                                <TableCell className="sticky right-0 bg-white">
                                    <div className="flex justify-center gap-2">
                                        {recarga.status !== 'COMPLETADA' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => handleEdit(index)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleViewTicket(recarga)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <TicketCheck className="h-4 w-4" />
                                        </Button>
                                        
                                        <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handlreComprobante(index)}
                                        className="h-8 w-8 p-0"
                                        >
                                            <Tag className="h-4 w-4" />
                                        </Button>
                                    </div>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}

            <Dialog open={comprobanteOpen} onOpenChange={setComprobanteOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <img src={formData.comprobante} className="w-[100]" />
                </DialogContent>
            </Dialog>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>
                            {editIndex !== null ? "Editar Recarga" : "Nueva Recarga"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <Label>
                            Monto
                            <Input
                                type="number"
                                name="amount"
                                value={formData.amount}
                                onChange={handleInputChange}
                                placeholder="Monto de la recarga"
                            />
                        </Label>
                        <Label>
                            ID de Wallet
                            <Input
                                name="walletId"
                                value={formData.walletId}
                                onChange={handleInputChange}
                                placeholder="ID de la wallet"
                            />
                        </Label>
                        <Label>
                            Estado
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring"
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </Label>
                        <Label>
                            Comentario
                            <Input
                                name="comentario"
                                value={formData.comentario || ""}
                                onChange={handleInputChange}
                                placeholder="Comentario opcional"
                            />
                        </Label>
                        <Label>
                            Número de Referencia
                            <Input
                                name="nro_referencia"
                                value={formData.nro_referencia || ""}
                                onChange={handleInputChange}
                                placeholder="Número de referencia"
                            />
                        </Label>
                    </div>
                    <DialogFooter className="mt-4 flex flex-col sm:flex-row gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsOpen(false);
                                resetForm();
                            }}
                            className="w-full sm:w-auto"
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            {isLoading ? "Guardando..." : editIndex !== null ? "Actualizar" : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={ticketOpen} onOpenChange={setTicketOpen}>
                <DialogContent className="w-[95vw] max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Detalle de Recarga</DialogTitle>
                    </DialogHeader>
                    {selectedRecarga && <Ticket recarga={selectedRecarga} />}
                    <DialogFooter>
                        <Button onClick={() => setTicketOpen(false)}>Cerrar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RecargasPage;