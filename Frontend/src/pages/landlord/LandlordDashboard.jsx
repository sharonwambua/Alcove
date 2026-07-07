import React, { useState, useEffect } from "react";

const LandlordDashboard = () => {
  const [metrics, setMetrics] = useState({
    totalCollected: 0,
    outstandingRent: 0,
    outstandingWater: 0,
    occupancyRate: "0%",
    activeTenantsCount: 0,
    totalProperties: 0,
    totalUnits: 0,
    totalOccupiedUnits: 0,
    vacantUnits: 0,
    openMaintenance: 0,
    urgentMaintenance: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/dashboard/overview");
      const result = await res.json();

      if (result.success) {
        setMetrics(result.data);
        setRecentActivities(result.data.recentActivity || []);
      }
    } catch (error) {
      console.error("Error loading dashboard overview:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const systemMetrics = [
    {
      title: "Total Rent Collected",
      value: `KES ${metrics.totalCollected.toLocaleString()}`,
      change: "Cleared payments only",
      color: "#43A047",
    },
    {
      title: "Outstanding Rent",
      value: `KES ${metrics.outstandingRent.toLocaleString()}`,
      change: "Unpaid across all tenants",
      color: "#C62828",
    },
    {
      title: "Outstanding Water",
      value: `KES ${metrics.outstandingWater.toLocaleString()}`,
      change: "Unpaid across all tenants",
      color: "#1565C0",
    },
    {
      title: "Occupancy Rate",
      value: metrics.occupancyRate,
      change: `${metrics.totalOccupiedUnits} Occupied of ${metrics.totalUnits} Units`,
      color: "#8B263E",
    },
    {
      title: "Open Maintenance",
      value: metrics.openMaintenance,
      change: `${metrics.urgentMaintenance} Tickets Marked Urgent`,
      color: "#EF6C00",
    },
  ];

  return (
    <div style={{ color: "var(--text, #333)" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: "700" }}>
          Overview Dashboard
        </h1>
        <p style={{ marginTop: "8px", color: "#777" }}>
          Real-time estate management statistics
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {systemMetrics.map((metric) => (
          <div
            key={metric.title}
            style={{
              background: "#fff",
              padding: "24px",
              borderRadius: "12px",
              border: "1px solid #eee",
              boxShadow: "0 3px 8px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                fontSize: ".8rem",
                color: "#777",
                marginBottom: "10px",
                fontWeight: "600",
              }}
            >
              {metric.title}
            </div>
            <div style={{ fontSize: "2rem", fontWeight: "700", color: metric.color }}>
              {loading ? "…" : metric.value}
            </div>
            <div style={{ marginTop: "8px", color: "#666", fontSize: ".85rem" }}>
              {metric.change}
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid var(--border, #e0e0e0)", padding: "2rem" }}>
        <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.15rem", fontWeight: "700" }}>
          Recent Activity Timeline Log
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {loading && recentActivities.length === 0 ? (
            <p style={{ color: "#777", fontSize: "0.9rem", fontStyle: "italic" }}>Loading dashboard...</p>
          ) : recentActivities.length === 0 ? (
            <p style={{ color: "#999", fontSize: "0.9rem", fontStyle: "italic", textAlign: "center", padding: "1rem" }}>
              No recent activity recorded yet.
            </p>
          ) : (
            recentActivities.map((activity) => (
              <div
                key={activity.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                  backgroundColor: "#FAF6F0",
                  borderRadius: "8px",
                  border: "1px solid #f0eae1",
                }}
              >
                <div>
                  <div style={{ fontSize: "0.92rem", fontWeight: "700", color: "var(--primary, #8B263E)" }}>
                    {activity.action}
                  </div>
                  <div style={{ fontSize: "0.88rem", color: "#555", marginTop: "0.15rem" }}>
                    {activity.details}
                  </div>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#999", fontWeight: "600" }}>
                  {activity.time ? new Date(activity.time).toLocaleDateString() : "Recent"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
