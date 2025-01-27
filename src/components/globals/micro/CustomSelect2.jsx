import React, { useState } from 'react';
import { CountryDetail } from '../CountryDetail';

const CustomSelect2 = ({ options, onSelect, selectedValue }) => {
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
            country={selectedValue.name}
            countryId={selectedValue.id}
            amount={`${selectedValue.currency}`}
            abreviation={selectedValue.abbreviation}
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
                country={option.name}
                countryId={option.id}
                amount={`${option.currency}`}
                abreviation={option.abbreviation}
                isActive={selectedValue?.id === option.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect2;