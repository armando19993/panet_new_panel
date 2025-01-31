import React from 'react';
import { FlagIcon } from "react-flag-kit";

export const CountryDetail = ({ onSelect, country, countryId, id, amount = null, abreviation, isActive }) => {
    const setCountry = () => {
        onSelect(id, countryId);
    };

    return (
        <div
            onClick={setCountry}
            className={`flex flex-row w-full border-2 rounded-lg p-3 justify-between cursor-pointer mb-2 ${isActive ? 'bg-blue-700 border-blue-900 text-white' : 'bg-white'
                }`} 
        >
            <div className="flex flex-row">
                <FlagIcon code={abreviation} size={48} className="rounded-full" />
                <p className="mt-1 ml-2 font-bold">{country}</p>
            </div>
            {amount && <div className='mt-1'>{amount}</div>}
        </div>
    );
};
