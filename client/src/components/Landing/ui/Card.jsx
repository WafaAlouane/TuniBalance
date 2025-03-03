export function Card({ children }) {
    return <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">{children}</div>;
  }
  
  export function CardHeader({ children }) {
    return <div className="mb-2 font-bold text-lg">{children}</div>;
  }
  
  export function CardContent({ children }) {
    return <div>{children}</div>;
  }
  
  export function CardTitle({ children }) {
    return <h2 className="text-lg font-semibold">{children}</h2>;
  }
  