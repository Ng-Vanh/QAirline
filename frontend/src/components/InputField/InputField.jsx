import React from 'react';

const InputField = ({ label, type, placeholder, value, onChange }) => {
    return (
        <div style={{ marginBottom: '10px' }}>
            <label>{label}</label>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                style={{ padding: '5px', marginLeft: '10px' }}
            />
        </div>
    );
};

export default InputField;
