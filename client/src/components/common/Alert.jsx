function Alert({ type = "info", message }) {
  if (!message) return null;

  const alertClasses = {
    info: "bg-blue-100 text-blue-800 border-blue-200",
    success: "bg-green-100 text-green-800 border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
    error: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className={`px-4 py-3 rounded border mb-4 ${alertClasses[type]}`}>
      {message}
    </div>
  );
}

export default Alert;
