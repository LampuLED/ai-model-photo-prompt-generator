
import React from 'react';

interface OptionDropdownProps {
  title: string;
  options: string[];
  selectedValue: string;
  onChange: (key: string, value: string) => void;
}

const OptionDropdown: React.FC<OptionDropdownProps> = ({ title, options, selectedValue, onChange }) => {
  const stateKey = title;

  return (
    <div className="flex flex-col space-y-1">
      <select
        value={selectedValue}
        onChange={(e) => onChange(stateKey, e.target.value)}
        className="w-full p-3 border border-indigo-700 bg-indigo-900 text-white rounded-xl shadow-lg focus:ring-purple-400 focus:border-purple-400 appearance-none cursor-pointer transition duration-150 ease-in-out font-semibold text-sm text-center"
        style={{
          backgroundImage: `url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23ffffff' d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.7em top 50%',
          backgroundSize: '0.65em auto'
        }}
      >
        {options.map((option, index) => (
          <option key={option} value={option} disabled={index === 0}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OptionDropdown;
