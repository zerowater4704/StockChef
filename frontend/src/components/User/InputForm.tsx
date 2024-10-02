interface InputFormProps {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const InputForm: React.FC<InputFormProps> = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
}) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} />
      {error && <p>{error}</p>}
    </div>
  );
};

export default InputForm;
