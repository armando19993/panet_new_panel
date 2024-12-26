import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Users, Pencil, Trash2, Plus, Search, WalletCards } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export const UsuariosPage = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenWallet, setIsOpenWallet] = useState(false);
    const [isOpenAddWallet, setIsOpenAddWallet] = useState(false);
    const [walletsUser, setWalletUser] = useState([]);
    const [userSelected, setUserSelected] = useState(null);
    const [nameWallet, setNameWallet] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState({ name: "", user: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [countries, setCountries] = useState([]);
    const [countrySelected, setCountrySelected] = useState(null)
    const [formData, setFormData] = useState({
        name: "",
        user: "",
        password: "",
        phone: "",
        profitPercent: "0.00",
        referredBy: "",
        roles: []
    });

    const handleRoleChange = async (roleId, checked) => {
        if (!formData.id) return;

        try {
            if (checked) {
                await instanceWithToken.post('user-role', {
                    userId: formData.id,
                    roleId: roleId
                });
                toast.success("Rol asignado correctamente");
            } else {
                await instanceWithToken.delete(`user-role/${formData.id}/${roleId}`);
                toast.success("Rol removido correctamente");
            }
            await getUsers();
        } catch (error) {
            if (error.response?.status === 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Error al actualizar roles");
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm({ ...searchTerm, [name]: value });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const userData = { ...formData };
            delete userData.roles;

            if (editIndex !== null) {
                const userId = users[editIndex].id;
                await instanceWithToken.patch(`user/${userId}`, userData);
                toast.success("Usuario actualizado correctamente");
            } else {
                const response = await instanceWithToken.post("user", userData);
                const newUserId = response.data.data.id;

                for (const roleId of selectedRoles) {
                    await instanceWithToken.post('user-role', {
                        userId: newUserId,
                        roleId
                    });
                }

                toast.success("Usuario creado correctamente");
            }
            await getUsers();
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
            name: "",
            user: "",
            password: "",
            phone: "",
            profitPercent: "0.00",
            referredBy: ""
        });
        setEditIndex(null);
    };

    const handleEdit = (index) => {
        const userToEdit = { ...users[index] };
        delete userToEdit.password;
        setSelectedRoles(userToEdit.roles.map(role => role.roleId));
        setEditIndex(index);
        setFormData(userToEdit);
        setIsOpen(true);
    };

    const handleDelete = async (index) => {
        try {
            const userId = users[index].id;
            await instanceWithToken.delete(`user/${userId}`);
            toast.success("Usuario eliminado correctamente");
            await getUsers();
        } catch (error) {
            toast.error("Error al eliminar el usuario");
        }
    };

    const getUsers = async () => {
        try {
            const result = await instanceWithToken.get("user");
            setUsers(result.data.data);
        } catch (error) {
            toast.error("Error al cargar la lista de usuarios");
        }
    };

    const getRoles = () => {
        instanceWithToken.get("role").then((result) => {
            setRoles(result.data.data)
        })
    }

    const RolesSection = ({ roles, formData, selectedRoles, handleRoleChange, setSelectedRoles }) => (
        <div className="space-y-4">
            <Label>Roles</Label>
            <div className="grid grid-cols-2 gap-4">
                {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={role.id}
                            checked={formData.id ?
                                formData.roles?.some(r => r.roleId === role.id) :
                                selectedRoles.includes(role.id)
                            }
                            onCheckedChange={(checked) => {
                                if (formData.id) {
                                    handleRoleChange(role.id, checked);
                                } else {
                                    setSelectedRoles(prev =>
                                        checked ?
                                            [...prev, role.id] :
                                            prev.filter(r => r !== role.id)
                                    );
                                }
                            }}
                        />
                        <Label
                            htmlFor={role.id}
                            className="text-sm font-normal"
                        >
                            {role.name}
                        </Label>
                    </div>
                ))}
            </div>
        </div>
    );

    const searchWalletsUser = (id, name) => {
        setNameWallet(name)
        setIsOpenWallet(true)
        setUserSelected(id)

        instanceWithToken.get(`wallet?userId=${id}`).then((result) => {
            console.log(result.data.data)
        })
    }

    const getCountries = async () => {
        try {
            const result = await instanceWithToken.get("country");
            setCountries(result.data.data);
        } catch (error) {
            toast.error("Error al cargar la lista de países");
        }
    };

    const handleSelectCountry = (e) => {
        const { value } = e.target;
        setCountrySelected(value)
    };


    useEffect(() => {
        getUsers();
        getRoles();
        getCountries()
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.name.toLowerCase()) &&
        user.user.toLowerCase().includes(searchTerm.user.toLowerCase())
    );

    return (
        <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
                <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <h1 className="text-xl md:text-2xl font-bold">Administración de Usuarios</h1>
                </div>
                <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Usuario
                </Button>
            </div>

            {/* Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        className="pl-10 w-full"
                        placeholder="Buscar por nombre..."
                        name="name"
                        value={searchTerm.name}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        className="pl-10 w-full"
                        placeholder="Buscar por usuario..."
                        name="user"
                        value={searchTerm.user}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border overflow-x-auto bg-white shadow">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead className="min-w-[150px] font-semibold">Nombre</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">Usuario</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">Teléfono</TableHead>
                            <TableHead className="min-w-[150px] font-semibold">% Ganancia</TableHead>
                            <TableHead className="min-w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user, index) => (
                            <TableRow key={index} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell>{user.user}</TableCell>
                                <TableCell>{user.phone || "-"}</TableCell>
                                <TableCell>{Number(user.profitPercent).toFixed(2)}%</TableCell>
                                <TableCell className="sticky right-0 bg-white">
                                    <div className="flex justify-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(index)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleDelete(index)}
                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <Button onClick={() => searchWalletsUser(user.id, user.name)} variant="ghost" size="sm">
                                            <WalletCards className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{editIndex !== null ? "Editar Usuario" : "Agregar Usuario"}</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <Label>
                            Nombre
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Nombre completo"
                            />
                        </Label>
                        <Label>
                            Usuario
                            <Input
                                name="user"
                                value={formData.user}
                                onChange={handleInputChange}
                                placeholder="Nombre de usuario"
                            />
                        </Label>
                        {!editIndex && (
                            <Label>
                                Contraseña
                                <Input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Contraseña"
                                />
                            </Label>
                        )}
                        <Label>
                            Teléfono
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Número de teléfono"
                            />
                        </Label>
                        <Label>
                            Porcentaje de Ganancia
                            <Input
                                type="number"
                                step="0.01"
                                name="profitPercent"
                                value={formData.profitPercent}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                        </Label>
                        <Label>
                            Referido por (ID)
                            <Input
                                name="referredBy"
                                value={formData.referredBy}
                                onChange={handleInputChange}
                                placeholder="ID del referente (opcional)"
                            />
                        </Label>
                    </div>
                    <RolesSection
                        roles={roles}
                        formData={formData}
                        selectedRoles={selectedRoles}
                        handleRoleChange={handleRoleChange}
                        setSelectedRoles={setSelectedRoles}
                    />
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


            {/* Modal para Ver Wallets */}

            <Dialog open={isOpenWallet} onOpenChange={setIsOpenWallet}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Gestion de Wallets de: {nameWallet}</DialogTitle>
                        <Button onClick={() => setIsOpenAddWallet(true)} className="w-[100%]">Agregar Nuevo Wallet</Button>
                    </DialogHeader>


                </DialogContent>

            </Dialog>


            {/* Modal para agregar wallet */}
            <Dialog open={isOpenAddWallet} onOpenChange={setIsOpenAddWallet}>
                <DialogContent className="w-[95vw] max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Agregar un Wallet a: {nameWallet}</DialogTitle>
                        <Button onClick={() => setIsOpenAddWallet(true)} className="w-[100%]">Agregar Nuevo Wallet</Button>
                    </DialogHeader>


                    <select
                        name="country"
                        value={countrySelected}
                        onChange={handleSelectCountry}
                        className="w-full border rounded p-2 focus:outline-none focus:ring"
                    >
                        <option value="">Todos los países</option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                                {country.name} ({country.code})
                            </option>
                        ))}
                    </select>
                </DialogContent>

            </Dialog>
        </div>
    );
};

export default UsuariosPage;