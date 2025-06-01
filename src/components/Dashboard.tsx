// src/pages/Dashboard.tsx
import React from "react";
import { useStytchMemberSession, useStytchOrganization } from "@stytch/react/b2b";

export const Dashboard: React.FC = () => {
  const { session } = useStytchMemberSession();
  const { organization } = useStytchOrganization();
  const role = session?.roles.includes("stytch_admin") ? "admin" : "member";

  const handleLogout = () => {
    window.location.href = "/logout";
  };

  const openAdminPortal = async () => {
    const url = "https://admin.stytch.com/your-org-admin-link"; // replace with real portal link
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="flex items-center justify-between px-6 py-4 shadow bg-white">
        <div className="flex items-center space-x-4">
          <img src="/dd_logo_h_rgb.svg" alt="Datadog Logo" className="h-8" />
          <h1 className="text-2xl font-bold">Datadog Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Log Out
        </button>
      </header>

      <main className="p-6">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow border-l-4 border-purple-600">
            <h2 className="text-lg font-semibold">Active Monitors</h2>
            <p className="text-4xl mt-2 font-mono">42</p>
            <p className="text-sm text-gray-500 mt-1">Last updated 2 mins ago</p>
          </div>

          <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
            <h2 className="text-lg font-semibold">System Uptime</h2>
            <p className="text-4xl mt-2 font-mono">99.98%</p>
            <p className="text-sm text-gray-500 mt-1">This week</p>
          </div>

          <div className="bg-white p-6 rounded shadow border-l-4 border-red-500">
            <h2 className="text-lg font-semibold">Open Alerts</h2>
            <p className="text-4xl mt-2 font-mono text-red-500">5</p>
            <p className="text-sm text-gray-500 mt-1">Triggered in the past 24h</p>
          </div>
        </section>

        <section className="mt-10">
          <h3 className="text-xl font-semibold mb-4">Live Logs</h3>
          <div className="bg-white p-4 rounded shadow text-sm font-mono h-64 overflow-y-scroll">
            <p className="text-green-600">[12:01:23] GET /api/monitors - 200 OK</p>
            <p className="text-yellow-600">[12:01:20] WARN /api/metrics - delayed response</p>
            <p className="text-red-600">[12:00:55] ERROR /api/alerts - internal server error</p>
            <p className="text-green-600">[11:59:02] POST /api/login - 200 OK</p>
            <p className="text-green-600">[11:58:30] GET /api/users - 200 OK</p>
            <p className="text-green-600">[11:58:10] GET /api/metrics - 200 OK</p>
            <p className="text-green-600">[11:57:45] PUT /api/monitors/42 - 204 No Content</p>
            <p className="text-green-600">[11:56:59] GET /api/settings - 200 OK</p>
          </div>
        </section>

        {role === "admin" && (
          <section className="mt-10">
            <h3 className="text-xl font-semibold mb-4">Admin Controls</h3>
            <button
              onClick={openAdminPortal}
              className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
            >
              Open Admin Portal
            </button>
          </section>
        )}

        <footer className="mt-10 text-sm text-gray-600">
          You are logged in as a <span className="font-bold text-gray-800">{role}</span> of the{' '}
          <span className="font-bold text-gray-800">{organization?.organization_name || 'Datadog'}</span> organization.
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;