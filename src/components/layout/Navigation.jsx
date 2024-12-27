import { useState } from "react";
import {
  LayoutDashboard,
  Wallet2,
  ChevronDown,
  Cog,
  Users,
  WalletCards,
  ArrowLeftRight,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Link } from "react-router-dom";  // Importa Link de react-router-dom
import logo from "@/assets/logon.png";

export function Navigation({ className }) {
  const [openItems, setOpenItems] = useState([]);

  const navItems = [
    { icon: LayoutDashboard, label: "Inicio", href: "/home" },
    { icon: ArrowLeftRight, label: "Transacciones", href: "/transactions" },
    { icon: WalletCards, label: "Recargas", href: "/recharges" },
    {
      icon: Cog,
      label: "Configuraciones",
      subItems: [
        { label: 'Tasas', href: '/rates' },
        { label: 'Usuarios', href: '/users' },
        { label: 'Wallets', href: '/wallets' },
        { label: "Paises", href: "/countries" },
        { label: "Bancos", href: "/banks" },
        { label: "Tipos de Cuenta", href: "/account-types" },
        { label: "Cuentas", href: "/instruments" },
      ],
    },
  ];

  const toggleItem = (label) => {
    setOpenItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <div className={`bg-gray-100 p-6 h-full border-r border-gray-300 ${className}`}>
      <div className="flex items-center gap-2 mb-8">
        <img
          src={logo}
          alt="PANET Logo"
          width={200}
          height={200}
          className="rounded-full"
        />
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <div key={item.label}>
            {item.subItems ? (
              <Collapsible
                open={openItems.includes(item.label)}
                onOpenChange={() => toggleItem(item.label)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="ml-8 mt-2 space-y-2">
                  {item.subItems.map((subItem) => (
                    <Link
                      key={subItem.href}
                      to={subItem.href}  // Usa 'to' en lugar de 'href'
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <Link
                to={item.href}  // Usa 'to' en lugar de 'href'
                className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
