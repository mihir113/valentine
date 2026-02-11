import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-red-50 to-pink-100">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            Our Love Story ❤️
          </h1>
          <p className="text-gray-600">
            A journey through our beautiful moments together
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
