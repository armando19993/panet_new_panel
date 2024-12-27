import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Wallet, Search, Plus, Edit2, ArrowRightLeft } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import Select from "react-select";

export const WalletsPage = () => {
    // Estados principales
    const [wallets, setWallets] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState({ userSearch: "", type: "" });

    // Estado para el formulario de creación
    const [formData, setFormData] = useState({
        consumer_id: "",
        consumer_id_type: "ce",
        type: "RECARGA",
        countryId: "",
    });

    // Estados para transferencias y edición de saldo
    const [isTransferOpen, setIsTransferOpen] = useState(false);
    const [isEditBalanceOpen, setIsEditBalanceOpen] = useState(false);
    const [transferData, setTransferData] = useState({
        sourceWalletId: "",
        targetWalletId: "",
        amount: "",
        sourceCurrency: "",
    });
    const [editBalanceData, setEditBalanceData] = useState({
        walletId: "",
        newBalance: "",
        currentBalance: "",
    });

    const walletTypes = ["RECARGA", "GANANCIAS", "RECEPCION"];

    // Funciones de utilidad
    const formatCurrency = (amount, currency = "PEN") => {
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('es-PE');
    };

    // Handlers para formularios
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm({ ...searchTerm, [name]: value });
    };

    const handleTransferChange = (e) => {
        const { name, value } = e.target;
        setTransferData({ ...transferData, [name]: value });
    };

    const handleEditBalanceChange = (e) => {
        const { name, value } = e.target;
        setEditBalanceData({ ...editBalanceData, [name]: value });
    };

    const handleTargetWalletSelect = (selectedOption) => {
        setTransferData({ ...transferData, targetWalletId: selectedOption?.value || "" });
    };

    // Función para obtener opciones de wallet destino
    const getTargetWalletOptions = () => {
        const sourceWallet = wallets.find(w => w.id === transferData.sourceWalletId);
        if (!sourceWallet) return [];

        return wallets
            .filter(w =>
                w.id !== transferData.sourceWalletId &&
                w.country.currency === sourceWallet.country.currency
            )
            .map(wallet => ({
                value: wallet.id,
                label: `${wallet.user.name} - ${wallet.type} (${formatCurrency(wallet.balance, wallet.country.currency)})`,
            }));
    };

    // Función para obtener wallets
    const getWallets = async () => {
        try {
            const result = await instanceWithToken.get("wallet");
            setWallets(result.data.data);
        } catch (error) {
            toast.error("Error al cargar la lista de wallets");
        }
    };

    // Función para crear wallet
    const handleSave = async () => {
        setIsLoading(true);
        try {
            await instanceWithToken.post("wallet", formData);
            toast.success("Wallet creada correctamente");
            await getWallets();
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

    // Función para transferir saldo
    const handleTransfer = async () => {
        const sourceWallet = wallets.find(w => w.id === transferData.sourceWalletId);
        const targetWallet = wallets.find(w => w.id === transferData.targetWalletId);

        if (!sourceWallet || !targetWallet) {
            toast.error("Por favor seleccione las wallets de origen y destino");
            return;
        }

        if (sourceWallet.country.currency !== targetWallet.country.currency) {
            toast.error("Las transferencias solo pueden realizarse entre wallets de la misma moneda");
            return;
        }

        if (parseFloat(transferData.amount) > sourceWallet.balance) {
            toast.error("Saldo insuficiente para realizar la transferencia");
            return;
        }

        setIsLoading(true);
        try {
            await instanceWithToken.post("wallet/transfer", transferData);
            toast.success("Transferencia realizada correctamente");
            await getWallets();
            setIsTransferOpen(false);
            setTransferData({ sourceWalletId: "", targetWalletId: "", amount: "", sourceCurrency: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al realizar la transferencia");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para editar saldo
    const handleEditBalance = async () => {
        setIsLoading(true);
        try {
            await instanceWithToken.put(`wallet/${editBalanceData.walletId}/balance`, {
                balance: parseFloat(editBalanceData.newBalance)
            });
            toast.success("Saldo actualizado correctamente");
            await getWallets();
            setIsEditBalanceOpen(false);
            setEditBalanceData({ walletId: "", newBalance: "", currentBalance: "" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al actualizar el saldo");
        } finally {
            setIsLoading(false);
        }
    };

    // Función para resetear formulario
    const resetForm = () => {
        setFormData({
            consumer_id: "",
            consumer_id_type: "ce",
            type: "RECARGA",
            countryId: "",
        });
    };

    // Efecto para cargar wallets inicialmente
    useEffect(() => {
        getWallets();
    }, []);

    // Filtrado de wallets
    const filteredWallets = wallets.filter((wallet) => {
        const userMatch = (
            wallet.user.name.toLowerCase().includes(searchTerm.userSearch.toLowerCase()) ||
            wallet.user.user.toLowerCase().includes(searchTerm.userSearch.toLowerCase())
        );
        const typeMatch = !searchTerm.type || wallet.type === searchTerm.type;
        return userMatch && typeMatch;
    });

    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold">Administración de Wallets</h1>
                </div>
                <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto">
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Wallet
                </Button>
            </div>

            {/* Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        className="pl-10 w-full"
                        placeholder="Buscar por nombre o usuario..."
                        name="userSearch"
                        value={searchTerm.userSearch}
                        onChange={handleSearchChange}
                    />
                </div>
                <select
                    name="type"
                    value={searchTerm.type}
                    onChange={handleSearchChange}
                    className="w-full border rounded p-2 focus:outline-none focus:ring"
                >
                    <option value="">Todos los tipos</option>
                    {walletTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[100px] font-semibold">ID</TableHead>
                            <TableHead className="min-w-[200px] font-semibold">Usuario</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">Cliente</TableHead>
                            <TableHead className="min-w-[120px] font-semibold">País</TableHead>
                            <TableHead className="min-w-[120px] font-semibold">Tipo</TableHead>
                            <TableHead className="min-w-[120px] font-semibold">Balance</TableHead>
                            <TableHead className="min-w-[180px] font-semibold">Fecha</TableHead>
                            <TableHead className="min-w-[120px] font-semibold">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredWallets.map((wallet) => (
                            <TableRow key={wallet.id} className="hover:bg-muted/50">
                                <TableCell className="font-medium">WAL-2025-{wallet.publicId}</TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{wallet.user.name}</span>
                                        <span className="text-sm text-muted-foreground">
                                            @{wallet.user.user}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {wallet.consumer_id ? (
                                        <div className="flex flex-col">
                                            <span>{wallet.consumer_id}</span>
                                            <span className="text-sm text-muted-foreground">
                                                {wallet.consumer_id_type?.toUpperCase()}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-muted-foreground">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline">
                                        {wallet.country.name} ({wallet.country.currency})
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge>{wallet.type}</Badge>
                                </TableCell>
                                <TableCell>{formatCurrency(wallet.balance, wallet.country.currency)}</TableCell>
                                <TableCell>{formatDate(wallet.createdAt)}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setEditBalanceData({
                                                    walletId: wallet.id,
                                                    newBalance: wallet.balance.toString(),
                                                    currentBalance: wallet.balance.toString(),
                                                });
                                                setIsEditBalanceOpen(true);
                                            }}
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setTransferData({
                                                    ...transferData,
                                                    sourceWalletId: wallet.id,
                                                    sourceCurrency: wallet.country.currency
                                                });
                                                setIsTransferOpen(true);
                                            }}
                                        >
                                            <ArrowRightLeft className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Create Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Nueva Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <Label>
                            ID de Cliente
                            <Input
                                name="consumer_id"
                                value={formData.consumer_id}
                                onChange={handleInputChange}
                                placeholder="ID del cliente"
                            />
                        </Label>
                        <Label>
                            Tipo de ID
                            <select
                                name="consumer_id_type"
                                value={formData.consumer_id_type}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring"
                            >
                                <option value="ce">CE</option>
                                <option value="dni">DNI</option>
                                <option value="ruc">RUC</option>
                            </select>
                        </Label>
                        <Label>
                            Tipo de Wallet
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring"
                            >
                                {walletTypes.map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </Label>
                        <Label>
                            País
                            <select
                                name="countryId"
                                value={formData.countryId}
                                onChange={handleInputChange}
                                className="w-full border rounded p-2 focus:outline-none focus:ring"
                            >
                                <option value="">Seleccione un país</option>
                                {wallets.map(wallet => (
                                    <option key={wallet.country.id} value={wallet.country.id}>
                                        {wallet.country.name} ({wallet.country.currency})
                                    </option>
                                )).filter((country, index, self) =>
                                    index === self.findIndex(c => c.props.value === country.props.value)
                                )}
                            </select>
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
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transfer Modal */}
            <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Transferir Saldo</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                            <Label>Wallet Origen</Label>
                            <div className="text-sm text-muted-foreground">
                                {wallets.find(w => w.id === transferData.sourceWalletId)?.user.name} - {' '}
                                {formatCurrency(
                                    wallets.find(w => w.id === transferData.sourceWalletId)?.balance || 0,
                                    wallets.find(w => w.id === transferData.sourceWalletId)?.country.currency
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Wallet Destino</Label>
                            <Select
                                value={getTargetWalletOptions().find(
                                    option => option.value === transferData.targetWalletId
                                )}
                                onChange={handleTargetWalletSelect}
                                options={getTargetWalletOptions()}
                                isSearchable
                                placeholder="Seleccione wallet destino"
                                noOptionsMessage={() => "No hay wallets disponibles con la misma moneda"}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                        </div>
                        <Label>
                            Monto a Transferir
                            <Input
                                name="amount"
                                value={transferData.amount}
                                onChange={handleTransferChange}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Ingrese el monto"
                            />
                        </Label>
                        {transferData.sourceWalletId && (
                            <p className="text-sm text-muted-foreground">
                                Moneda: {wallets.find(w => w.id === transferData.sourceWalletId)?.country.currency}
                            </p>
                        )}
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsTransferOpen(false);
                                setTransferData({ sourceWalletId: "", targetWalletId: "", amount: "", sourceCurrency: "" });
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleTransfer}
                            disabled={isLoading || !transferData.targetWalletId || !transferData.amount}
                        >
                            {isLoading ? "Procesando..." : "Transferir"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Balance Modal */}
            <Dialog open={isEditBalanceOpen} onOpenChange={setIsEditBalanceOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Editar Saldo</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <Label>
                            Nuevo Saldo
                            <Input
                                name="newBalance"
                                value={editBalanceData.newBalance}
                                onChange={handleEditBalanceChange}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Ingrese el nuevo saldo"
                            />
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Saldo actual: {formatCurrency(editBalanceData.currentBalance)}
                        </p>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsEditBalanceOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleEditBalance}
                            disabled={isLoading || !editBalanceData.newBalance}
                        >
                            {isLoading ? "Guardando..." : "Guardar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default WalletsPage;