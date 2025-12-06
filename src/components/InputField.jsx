export default function InputField({ label, type="text", value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
