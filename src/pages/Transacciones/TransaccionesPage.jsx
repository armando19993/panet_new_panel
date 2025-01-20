import { instanceWithToken } from '@/utils/instance';
import { CalendarRange, Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';


const TransaccionesPage = () => {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const [filterId, setFilterId] = useState('');
  const [filterCreator, setFilterCreator] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const recordsPerPage = 20; // Máximo de registros por página

  const getTransactions = () => {
    instanceWithToken.get('transaction').then((result) => {
      setTransactions(result.data.data);
      setFilteredTransactions(result.data.data); // Inicialmente todos los datos
    });
  };

  

  const openTransaction = (transaction) => {
    console.log('Abriendo transacción:', transaction);
    navigate(`/detail-trasaction/${transaction.id}`)
  };

  const statusStyles = {
    COMPLETADA: 'bg-green-100 text-green-800 border-green-300',
    CANCELADA: 'bg-red-100 text-red-800 border-red-300',
    CREADA: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  };

  const handleFilter = () => {
    const filtered = transactions.filter((transaction) => {
      const matchId = filterId ? transaction.publicId.includes(filterId) : true;
      const matchCreator = filterCreator
        ? transaction.creador.name.toLowerCase().includes(filterCreator.toLowerCase())
        : true;
      const matchStatus = filterStatus ? transaction.status === filterStatus : true;
      const matchDate = filterDate
        ? new Date(transaction.createdAt).toISOString().slice(0, 10) === filterDate
        : true;

      return matchId && matchCreator && matchStatus && matchDate;
    });
    setFilteredTransactions(filtered);
    setCurrentPage(1); // Resetear a la primera página después de filtrar
  };

  const clearFilters = () => {
    setFilterId('');
    setFilterCreator('');
    setFilterStatus('');
    setFilterDate('');
    setFilteredTransactions(transactions); // Restablecer a todos los datos
    setCurrentPage(1); // Resetear a la primera página
  };

  // Calcular los registros visibles según la página actual
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);

  useEffect(() => {
    getTransactions();
  }, []);

  return (
    <div className="p-3 md:p-6 space-y-4 md:space-y-6 max-w-screen-lg mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
        <div className="flex items-center gap-2">
          <CalendarRange className="h-6 w-6 text-primary" />
          <h1 className="text-xl md:text-2xl font-bold">Administración de Transacciones</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Filtrar por ID"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
        />
        <Input
          placeholder="Filtrar por Creador"
          value={filterCreator}
          onChange={(e) => setFilterCreator(e.target.value)}
        />
        <select
          className="border rounded p-2"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Todos los estados</option>
          <option value="CREADA">CREADA</option>
          <option value="OBSERVADA">OBSERVADA</option>
          <option value="ANULADA">ANULADA</option>
          <option value="COMPLETADA">COMPLETADA</option>
        </select>
        <Input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div className="flex gap-4 mt-4">
        <Button onClick={handleFilter}>Aplicar filtros</Button>
        <Button variant="secondary" onClick={clearFilters}>
          Limpiar filtros
        </Button>
      </div>

      {/* Tabla */}
      <div className="rounded-md border overflow-x-auto bg-white shadow">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="min-w-[100px] font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Creador</TableHead>
              <TableHead className="font-semibold">Monto Origen</TableHead>
              <TableHead className="font-semibold">Monto Destino</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="min-w-[100px] font-semibold text-center sticky right-0 bg-white">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentRecords.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  TRX-2025-{transaction.publicId}
                </TableCell>
                <TableCell>{transaction.creador.name}</TableCell>
                <TableCell>
                  {transaction.montoOrigen} {transaction.monedaOrigen}
                </TableCell>
                <TableCell>
                  {transaction.montoDestino} {transaction.monedaDestino}
                </TableCell>
                <TableCell>
                  <Badge className={statusStyles[transaction.status]}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(transaction.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </TableCell>
                <TableCell className="sticky right-0 bg-white">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openTransaction(transaction)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Anterior
        </Button>
        <p>
          Página {currentPage} de {totalPages}
        </p>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};

export default TransaccionesPage;
