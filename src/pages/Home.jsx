export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-center px-6">
      <div>
        <h1 className="text-5xl font-extrabold text-blue-600">EventHub</h1>
        <p className="text-gray-600 text-lg mt-3">
          Manage events efficiently with a modern platform
        </p>
        <a 
          href="/register"
          className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700"
        >
          Get Started
        </a>
      </div>
    </div>
  );
}
