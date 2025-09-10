import "../../App.css"

const RegisterForm = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r">
      <form className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border-red-700 border">
        <h2 className="mb-10 text-center text-3xl font-bold main_text_color">
          Register
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Password</label>
          <div className="relative">
            <input
              type="password"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
            ></button>
          </div>
        </div>
        <div className="mb-4">
          <label className="mb-2 block text-gray-700">Confirm Password</label>
          <div className="relative">
            <input
              type= "password"
              name="confirmPassword"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg header_bg_color py-2 text-white transition duration-300 hover:bg-red-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
