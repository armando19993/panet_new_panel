import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { instanceWithToken } from "@/utils/instance";
import { Pencil, Trash2, Plus, Globe, Search } from "lucide-react";
import { toast } from "sonner";

export const CountriesPage = () => {
  const [countries, setCountries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    abbreviation: "",
    currency: "",
    profit: 0,
    ven_profit: 0,
    especial_profit: 0,
    rate_purchase: 0,
    rate_sales: 0,
    rate_wholesale: 0,
    code: "",
    amount: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const finalValue = e.target.type === "number" ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, [name]: finalValue });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (editIndex !== null) {
        const countryId = countries[editIndex].id;
        await instanceWithToken.patch(`country/${countryId}`, formData);
        toast.success("País actualizado correctamente");
      } else {
        await instanceWithToken.post("country", formData);
        toast.success("País creado correctamente");
      }
      await getCountries();
      setIsOpen(false);
      resetForm();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        const errorMessages = error.response.data.message;
        if (Array.isArray(errorMessages)) {
          errorMessages.forEach((msg) => {
            toast.error(msg);
          });
        } else {
          toast.error(errorMessages);
        }
      } else {
        toast.error("Ocurrió un error inesperado. Inténtalo de nuevo.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      abbreviation: "",
      currency: "",
      profit: 0,
      ven_profit: 0,
      especial_profit: 0,
      rate_purchase: 0,
      rate_sales: 0,
      rate_wholesale: 0,
      code: "",
      amount: 0,
    });
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setFormData(countries[index]);
    setIsOpen(true);
  };

  const handleDelete = async (index) => {
    try {
      const countryId = countries[index].id;
      await instanceWithToken.delete(`country/${countryId}`);
      toast.success("País eliminado correctamente");
      await getCountries();
    } catch (error) {
      toast.error("Error al eliminar el país");
    }
  };

  const getCountries = async () => {
    try {
      const result = await instanceWithToken.get("country");
      setCountries(result.data.data);
    } catch (error) {
      toast.error("Error al cargar la lista de países");
    }
  };

  useEffect(() => {
    getCountries();
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">Administración de Países</h1>
        </div>
        <Button onClick={() => setIsOpen(true)} className="w-full sm:w-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Agregar País
        </Button>
      </div>

      {/* Search */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          className="pl-10 w-full"
          placeholder="Buscar por nombre o moneda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Container */}
      <div className="rounded-md border overflow-x-auto bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[150px] lg:w-[200px] font-semibold">Nombre</TableHead>
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold">Abreviación</TableHead>
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold">Moneda</TableHead>
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold">Código</TableHead>
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold text-right">Ganancia</TableHead>
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold text-right">Tasa Compra</TableHead>
              <TableHead className="min-w-[100px] lg:w-[120px] font-semibold text-right">Tasa Venta</TableHead>
              <TableHead className="min-w-[100px] lg:w-[100px] font-semibold text-center sticky right-0 bg-white">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCountries.map((country, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium min-w-[150px]">{country.name}</TableCell>
                <TableCell className="min-w-[100px]">{country.abbreviation}</TableCell>
                <TableCell className="min-w-[100px]">{country.currency}</TableCell>
                <TableCell className="min-w-[100px]">{country.code}</TableCell>
                <TableCell className="min-w-[100px] text-right">{country.profit}%</TableCell>
                <TableCell className="min-w-[100px] text-right">{country.rate_purchase}</TableCell>
                <TableCell className="min-w-[100px] text-right">{country.rate_sales}</TableCell>
                <TableCell className="min-w-[100px] sticky right-0 bg-white">
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
            <DialogTitle>{editIndex !== null ? "Editar País" : "Agregar País"}</DialogTitle>
          </DialogHeader>
          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <Label>
                Nombre
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre del país"
                />
              </Label>
              <Label>
                Abreviación
                <Input
                  name="abbreviation"
                  value={formData.abbreviation}
                  onChange={handleInputChange}
                  placeholder="Ej: USA"
                />
              </Label>
              <Label>
                Moneda
                <Input
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  placeholder="Ej: USD"
                />
              </Label>
              <Label>
                Código
                <Input
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Código del país"
                />
              </Label>
              <Label>
                Cantidad
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                />
              </Label>
            </div>
            <div className="space-y-4">
              <Label>
                Ganancia (%)
                <Input
                  type="number"
                  name="profit"
                  value={formData.profit}
                  onChange={handleInputChange}
                />
              </Label>
              <Label>
                Ganancia Venezuela (%)
                <Input
                  type="number"
                  name="ven_profit"
                  value={formData.ven_profit}
                  onChange={handleInputChange}
                />
              </Label>
              <Label>
                Ganancia Especial (%)
                <Input
                  type="number"
                  name="especial_profit"
                  value={formData.especial_profit}
                  onChange={handleInputChange}
                />
              </Label>
              <Label>
                Tasa de Compra
                <Input
                  type="number"
                  name="rate_purchase"
                  value={formData.rate_purchase}
                  onChange={handleInputChange}
                />
              </Label>
              <Label>
                Tasa de Venta
                <Input
                  type="number"
                  name="rate_sales"
                  value={formData.rate_sales}
                  onChange={handleInputChange}
                />
              </Label>
              <Label>
                Tasa Mayorista
                <Input
                  type="number"
                  name="rate_wholesale"
                  value={formData.rate_wholesale}
                  onChange={handleInputChange}
                />
              </Label>
            </div>
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
    </div>
  );
};

export default CountriesPage;
