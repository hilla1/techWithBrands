export default function MpesaFields({ register, errors }) {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-1">Phone Number (M-Pesa)</label>
      <input
        {...register("phone")}
        placeholder="0712345678"
        className="w-full border rounded-md px-3 py-2"
      />
      {errors.phone && <p className="text-red-600 mt-1">{errors.phone.message}</p>}
    </div>
  );
}
