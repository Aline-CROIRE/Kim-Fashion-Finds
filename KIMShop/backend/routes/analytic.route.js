import express from 'express';
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';
import { getAnalyticsData, getDailySalesData } from '../controllers/analytics.controller.js';

const router = express.Router();

router.get('/', protectRoute, adminRoute, async (req, res) => {
  try {
    // Get Analytics Data
    const analyticsData = await getAnalyticsData();

    // Define start and end date correctly
    const endDate = new Date(); // Moved before usage
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get Daily Sales Data
    const dailySalesData = await getDailySalesData(startDate, endDate);

    res.json({
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.error("Error in analytics route:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
