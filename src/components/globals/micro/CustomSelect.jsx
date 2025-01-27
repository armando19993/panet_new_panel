import React, { useState } from 'react';
import { CountryDetail } from '../CountryDetail';

const CustomSelect = ({ options, onSelect, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (value) => {
    onSelect(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-select">
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        {selectedValue ? (
          <CountryDetail
            id={selectedValue.id}
            country={selectedValue.country.name}
            countryId={selectedValue.country.id}
            amount={`${selectedValue.balance} ${selectedValue.country.currency}`}
            abreviation={selectedValue.country.abbreviation}
            isActive={true}
          />
        ) : (
          <span className='flex flex-row w-full border-2 rounded-lg p-3 justify-between cursor-pointer mb-2'>Seleccione un Wallet</span>
        )}
      </div>
      {isOpen && (
        <div className="options">
          {options.map((option, index) => (
            <div key={index} onClick={() => handleSelect(option)}>
              <CountryDetail
                id={option.id}
                country={option.country.name}
                countryId={option.country.id}
                amount={`${option.balance} ${option.country.currency}`}
                abreviation={option.country.abbreviation}
                isActive={selectedValue?.id === option.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;