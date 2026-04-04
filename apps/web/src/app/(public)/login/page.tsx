export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">hugg</h1>
          <p className="text-sm text-gray-500 mt-1">
            Entre na sua conta para continuar.
          </p>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          Ainda não tem conta?{" "}
          <a href="#" className="text-orange-500 hover:underline">
            Criar conta
          </a>
        </p>
      </div>
    </main>
  );
}
