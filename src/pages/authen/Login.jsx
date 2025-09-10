const LoginForm = () => {


  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r ">
      <form className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg border-red-700 border">
        <h2 className="mb-6 text-center text-3xl font-bold main_text_color">
          Login
        </h2>
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
              type= "password"
              name="password"
              className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-700"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg header_bg_color py-2 text-white transition duration-300 hover:bg-red-700"
        >
          Login
        </button>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
