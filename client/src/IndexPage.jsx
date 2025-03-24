import { useEffect } from "react";

const IndexPage = () => {
  useEffect(() => {
    window.location.href = "prium.github.io/falcon/v3.23.0/pages/landing.html"; 
  }, []);

  return (
    <div className="bg-blue-600 text-white min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold">HTTrack Website Copier - Open Source offline browser</h1>
      <table className="w-3/4 mt-5 border-collapse border border-gray-300">
        <tbody>
          <tr className="bg-gray-900 text-white">
            <td className="p-4 text-center">
              <a href="prium.github.io/falcon/v3.23.0/pages/landing.html" className="text-blue-400 underline">
                prium.github.io/falcon/v3.23.0/pages/landing.html
              </a>
            </td>
          </tr>
        </tbody>
      </table>
      <footer className="mt-10 text-sm">
        &copy; 2008 Xavier Roche & other contributors - Web Design: Leto Kauler.
      </footer>
    </div>
  );
};

export default IndexPage;
