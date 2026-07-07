const { db } = require('../config/firebase');
const { computeFinancialSummary } = require('./paymentController');


exports.getLandlordOverview = async (req, res) => {
  try {
    const [{ metrics, transactions }, propertiesSnap, tenantsSnap, maintenanceSnap] = await Promise.all([
      computeFinancialSummary(),
      db.collection('properties').get(),
      db.collection('tenants').get(),
      db.collection('maintenance').get()
    ]);

    const totalProperties = propertiesSnap.size;
    const activeTenantsCount = tenantsSnap.size;

    let totalUnits = 0;
    propertiesSnap.forEach(doc => {
      const data = doc.data();
      totalUnits += Number(data.units || data.bedrooms || data.unitsCount || 1);
    });

    const totalOccupiedUnits = Math.min(activeTenantsCount, totalUnits);
    const vacantUnits = Math.max(0, totalUnits - totalOccupiedUnits);
    const occupancyRate = totalUnits === 0
      ? '0%'
      : `${((totalOccupiedUnits / totalUnits) * 100).toFixed(1)}%`;

    let openMaintenance = 0;
    let urgentMaintenance = 0;
    maintenanceSnap.forEach(doc => {
      const ticket = doc.data();
      const status = (ticket.status || '').toUpperCase();
      if (status !== 'RESOLVED' && status !== 'CLOSED') openMaintenance++;
      if ((ticket.priority === 'High' || ticket.priority === 'Urgent') && status !== 'RESOLVED') urgentMaintenance++;
    });

    const recentActivity = [];

    transactions.slice(0, 5).forEach(t => {
      recentActivity.push({
        id: t.id,
        action: t.status === 'CLEARED' ? 'Rent Payment Cleared' : 'Invoice Update',
        details: `${t.tenantName || 'Unassigned Tenant'} - KES ${Number(t.amount || 0).toLocaleString()} (${t.status})`,
        time: t.createdAt || 'Recent'
      });
    });

    tenantsSnap.forEach(doc => {
      const tenant = doc.data();
      recentActivity.push({
        id: doc.id,
        action: 'Tenant Registered',
        details: `${tenant.name || 'Unnamed Tenant'} assigned to ${tenant.propertyName || 'Unassigned Property'}`,
        time: tenant.createdAt || 'Recent'
      });
    });

    recentActivity.sort((a, b) => new Date(b.time || 0) - new Date(a.time || 0));

    return res.status(200).json({
      success: true,
      data: {
        totalCollected: metrics.totalCollected,
        outstandingRent: metrics.unpaidRent,
        outstandingWater: metrics.unpaidWater,
        totalProperties,
        activeTenantsCount,
        totalUnits,
        totalOccupiedUnits,
        vacantUnits,
        occupancyRate,
        openMaintenance,
        urgentMaintenance,
        recentActivity: recentActivity.slice(0, 8)
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
