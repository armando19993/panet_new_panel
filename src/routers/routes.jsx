import { LoginPage } from "@/pages/LoginPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRouter";
import { Layout } from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import { CountriesPage } from "@/pages/Configuraciones/CountriesPage";
import BanksPage from "@/pages/Configuraciones/BanksPage";
import AccountTypesPage from "@/pages/Configuraciones/AccountTypesPage";
import InstrumentsPage from "@/pages/Configuraciones/InstrumentsPage";
import UsuariosPage from "@/pages/Configuraciones/UsuariosPage";
import RatesPage from "@/pages/Configuraciones/RatesPage";
import RecargasPage from "@/pages/Recargas/RecargasPage";
import WalletsPage from "@/pages/Wallets/WalletsPage";
import TransaccionesPage from "@/pages/Transacciones/TransaccionesPage";
import ColaPage from "@/pages/Transacciones/ColaPage";
import DetailTransactionPage from "@/pages/Transacciones/DetailTransactionPage";
import NuevaTransaccion from "@/pages/Transacciones/NuevaTransaccion";
import DetailRecharge from "@/pages/Recargas/DetailRecharge";
import NewRecharge from "@/pages/Recargas/NewRecharge";
import RechargesTransaccions from "@/pages/Transacciones/RechargesTransaccions";

export const MyRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/" element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="home" element={<HomePage />} />
            <Route path="countries" element={<CountriesPage />} />
            <Route path="banks" element={<BanksPage />} />
            <Route path="account-types" element={<AccountTypesPage />} />
            <Route path="instruments" element={<InstrumentsPage/>} />
            <Route path="users" element={<UsuariosPage />} />
            <Route path="rates" element={<RatesPage />} />
            <Route path="recharges" element={<RecargasPage />} />
            <Route path="wallets" element={<WalletsPage />} />
            <Route path="transactions" element={<TransaccionesPage />} />
            <Route path="cola-espera" element={<ColaPage />} />
            <Route path="detail-trasaction/:idtrasaction" element={<DetailTransactionPage />} />
            <Route path="detail-recharge/:idrecarga" element={<DetailRecharge />} />
            <Route path="new-transaction" element={<NuevaTransaccion />} />
            <Route path="new-recharge" element={<NewRecharge />} />
            <Route path="recharges-transaccions" element={<RechargesTransaccions />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
