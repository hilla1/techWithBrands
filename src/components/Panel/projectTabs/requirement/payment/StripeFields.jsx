export default function StripeFields({ register, errors }) {
  return (
    <>
      <div>
        <label className="block font-medium text-gray-700 mb-1">Cardholder Name</label>
        <input
          {...register("cardholderName")}
          placeholder="John Doe"
          className="w-full border rounded-md px-3 py-2"
        />
        {errors.cardholderName && <p className="text-red-600 mt-1">{errors.cardholderName.message}</p>}
      </div>

      <div>
        <label className="block font-medium text-gray-700 mb-1">Card Number</label>
        <input
          {...register("cardNumber")}
          maxLength={16}
          placeholder="1234567812345678"
          className="w-full border rounded-md px-3 py-2"
        />
        {errors.cardNumber && <p className="text-red-600 mt-1">{errors.cardNumber.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block font-medium text-gray-700 mb-1">Expiry Month</label>
          <select {...register("expiryMonth")} className="w-full border rounded-md px-3 py-2">
            <option value="">MM</option>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                {String(i + 1).padStart(2, "0")}
              </option>
            ))}
          </select>
          {errors.expiryMonth && <p className="text-red-600 mt-1">{errors.expiryMonth.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">Expiry Year</label>
          <select {...register("expiryYear")} className="w-full border rounded-md px-3 py-2">
            <option value="">YYYY</option>
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={2024 + i}>{2024 + i}</option>
            ))}
          </select>
          {errors.expiryYear && <p className="text-red-600 mt-1">{errors.expiryYear.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">CVC</label>
          <input
            {...register("cvc")}
            maxLength={4}
            placeholder="123"
            className="w-full border rounded-md px-3 py-2"
          />
          {errors.cvc && <p className="text-red-600 mt-1">{errors.cvc.message}</p>}
        </div>
      </div>
    </>
  );
}
