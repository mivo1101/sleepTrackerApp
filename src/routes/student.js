const express = require('express');
const router = express.Router();

/**
 * GET /api/student
 * Returns student identity for HD Task submission.
 */
router.get('/', (req, res) => {
    res.json({
        name: "Chau Tra Mi Vo (Mi Vo)",
        studentId: "224505179"
    });
});

module.exports = router;