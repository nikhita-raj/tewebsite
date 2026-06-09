
import { useState } from "react";

export default function VPPortal() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (password === "TEVP2026") {
      setLoggedIn(true);
    } else {
      alert("Invalid Password");
    }
  };

  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">
          <h1 className="text-2xl font-bold mb-6 text-center">
            VP Executive Portal
          </h1>

          <input
            type="password"
            placeholder="Enter VP Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg"
          />

          <button
            onClick={handleLogin}
            className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        VP Executive Dashboard
      </h1>

      {/* Main KPIs */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card title="Total Projects" value="44" />
        <Card title="Live Projects" value="18" />
        <Card title="In Progress" value="16" />
        <Card title="ROI" value="327%" />
      </div>

      {/* FTE Metrics */}
      <div className="grid md:grid-cols-3 gap-4 mt-8">
        <Card title="FTE Savings" value="34.6" />
        <Card title="Hours Saved / Week" value="1200+" />
        <Card title="Annual Value" value="$5.8M" />
      </div>

      {/* Project Status */}
      <div className="mt-10 bg-white rounded-xl border p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Project Status Overview
        </h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Project</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Region</th>
              <th className="p-3 text-left">ROI</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-3">Order Entry</td>
              <td className="p-3 text-green-600">Live</td>
              <td className="p-3">AMER</td>
              <td className="p-3">220%</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Quality Assist Agent</td>
              <td className="p-3 text-yellow-600">In Progress</td>
              <td className="p-3">APAC</td>
              <td className="p-3">180%</td>
            </tr>

            <tr className="border-t">
              <td className="p-3">Customer Sentiment</td>
              <td className="p-3 text-green-600">Live</td>
              <td className="p-3">EMIA</td>
              <td className="p-3">210%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* AI Summary */}
      <div className="mt-10 bg-white rounded-xl border p-6 shadow">

        <h2 className="text-xl font-bold mb-4">
          Executive AI Summary
        </h2>

        <p className="leading-7 text-gray-700">
          TE AI Transformation Hub currently manages 44 active projects
          across APAC, EMIA and AMER regions.

          <br /><br />

          18 projects are live and delivering measurable business value.

          <br /><br />

          The portfolio currently generates approximately $5.8M in
          annual business value while saving 34.6 FTE equivalent effort.

          <br /><br />

          Key focus areas for leadership include accelerating FY27
          GenAI initiatives, expanding automation adoption and
          increasing ROI from high-performing projects.
        </p>
      </div>

      {/* Generate Deck */}
      <div className="mt-10">
        <button
          onClick={() => alert("Generating VP Executive PowerPoint Deck...")}
          className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700"
        >
          Generate Executive PowerPoint
        </button>
      </div>

    </div>
  );
}

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="bg-white border rounded-xl p-5 shadow">
      <div className="text-gray-500">
        {title}
      </div>

      <div className="text-3xl font-bold mt-2">
        {value}
      </div>
    </div>
  );
}

